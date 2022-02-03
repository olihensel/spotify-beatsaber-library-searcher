import Axios from "axios";
import { program } from "commander";
import { writeFileSync } from "fs";
import SpotifyWebApi from "spotify-web-api-node";
import { BeatsaverResponse, DocsEntity } from "./model";
import { BeatSaberPlaylist } from "./output-model";
export async function authAtSpotify(
  spotifyClientId: string,
  spotifySecret: string
) {
  const spotify = new SpotifyWebApi({
    clientId: spotifyClientId,
    clientSecret: spotifySecret,
  });
  const grant = await spotify.clientCredentialsGrant();

  console.log("The access token expires in " + grant.body["expires_in"]);
  console.log("The access token is " + grant.body["access_token"]);
  spotify.setAccessToken(grant.body["access_token"]);
  return spotify;
}

program
  .name("spotify-beatsaber-library-searcher")
  .description(
    "tool to search for songs of a spotify playlist on various beatsaber song platforms."
  );
program
  .command("search")
  .argument("<spotifyClientId>", "the spotify api client id")
  .argument("<spotifySecret>", "the spotify api secret")
  .argument("<url>", "the url of the spotify playlist")
  .option(
    "-d, --difficulty <difficulty>",
    "the difficulty of the song (Easy, Normal, Hard, Expert, ExpertPlus)"
  )
  .action(async (clientId, clientSecret, url, options) => {
    try {
      const spotify = await authAtSpotify(clientId, clientSecret);

      const id =
        /^https:\/\/open\.spotify\.com\/playlist\/([\da-zA-Z]+)/.exec(
          url
        )?.[1] ?? url;
      console.log(id);
      let playlist = await spotify.getPlaylist(id);
      const tracks = [...(playlist.body.tracks?.items ?? [])];
      while (tracks.length < playlist.body.tracks.total) {
        console.log(tracks.length + " / " + playlist.body.tracks.total);
        const nextTracks = await spotify.getPlaylistTracks(id, {
          offset: tracks.length,
        });
        tracks.push(...nextTracks.body.items);
      }

      console.log(
        tracks.map((t, index) => {
          return (
            index +
            1 +
            ": " +
            t.track.artists.map((a) => a.name).join(", ") +
            " - " +
            t.track.name
          );
        })
      );

      const output: BeatSaberPlaylist = {
        playlistTitle: `${
          options.difficulty ? options.difficulty + " - " : ""
        }${playlist.body.name} - Spotify`,
        playlistAuthor: `${playlist.body.owner.display_name}@spotify`,
        image:
          `base64,` +
          (
            await Axios.get(
              playlist.body.images?.[0].url ??
                `https://www.coolgenerator.com/Others/text_design_dl/text/${Buffer.from(
                  playlist.body.name,
                  "utf-8"
                ).toString("base64")}/font/en0001/size/30/color/000`,
              { responseType: "arraybuffer" }
            )
          ).data.toString("base64"),
        playlistDescription:
          "playlist created via spotify-beatsaber-library-searcher",
        songs: [],
      };
      let counter = 0;
      for (const item of tracks) {
        console.log(counter++ + " / " + tracks.length);
        const track = item.track;
        const title =
          track.artists.map((a) => a.name).join(" ") + " - " + track.name;
        // console.log(chalk.bgRed(title));
        // search in beatsaver for the song
        const songs = await searchInBeatsaver(title);

        for (const song of songs) {
          const key = song.id.toUpperCase();
          let addedSongs = 0;
          if (
            !output.songs?.find((s) => s.key === key) &&
            song.name.toLowerCase().includes(item.track.name.toLowerCase()) &&
            // if no difficulty is specified, search for all difficulties
            (!options.difficulty ||
              song.versions?.[0]?.diffs?.some(
                (d) => d.difficulty === options.difficulty
              )) &&
            addedSongs < 4
          ) {
            addedSongs++;
            console.log(song.id, song.name);
            const hash = song.versions?.[0]?.hash ?? "";
            output.songs?.push({
              key,
              hash,
              levelid: `custom_level_${hash}`,
              customData: {
                name: song.name,
                uploader: song.uploader?.name || undefined,
              },
            });
          }
        }
      }
      console.log(JSON.stringify(output, null, 2));
      writeFileSync(
        `${output.playlistTitle}_${playlist.body.owner?.display_name}.bplist`,
        JSON.stringify(output, null, 2)
      );
    } catch (e) {
      console.log(e);
    }
  });

program.parse();
async function searchInBeatsaver(query: string, maxPages: number = 100) {
  let page = 0;
  const results: DocsEntity[] = [];
  while (page < maxPages) {
    const res = await Axios.get<BeatsaverResponse>(
      "https://api.beatsaver.com/search/text/" + page,
      {
        params: {
          q: query,
          sortOrder: "Relevance",
        },
      }
    );
    const songs = res.data.docs ?? [];
    if (songs.length === 0) {
      break;
    }
    results.push(...songs);
    page++;
  }
  return results;
}

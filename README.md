# spotify-beatsaber-library-searcher

tool that extracts the song of a public spotify playlist (by id or open.spotify.com url) and searches for matching beatsaber songs on beatsaver.com

## get a spotify api key

See https://github.com/thelinmichael/spotify-web-api-node#authorization and specifically https://github.com/thelinmichael/spotify-web-api-node#client-credential-flow

## usage

```
npm install
# npm run start -- command args

npm run start -- search $SPOTIFY_CLIENT_ID $SPOTIFY_SECRET --difficulty Expert https://open.spotify.com/playlist/37i9dQZF1DWZryfp6NSvtz
```

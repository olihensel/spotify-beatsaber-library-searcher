export interface BeatSaberPlaylist {
  playlistTitle: string;
  playlistAuthor: string;
  playlistDescription: string;
  customData?: CustomData;
  songs?: SongsEntity[] | null;
  image: string;
}
export interface CustomData {
  syncURL?: string;
}
export interface SongsEntity {
  key: string;
  hash: string;
  levelid: string;
  customData?: CustomData1;
}
export interface CustomData1 {
  name?: string;
  uploader?: string;
}

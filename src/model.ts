export interface BeatsaverResponse {
  docs?: DocsEntity[] | null;
}
export interface DocsEntity {
  id: string;
  name: string;
  description: string;
  uploader: Uploader;
  metadata: Metadata;
  stats: Stats;
  uploaded: string;
  automapper: boolean;
  ranked: boolean;
  qualified: boolean;
  versions?: VersionsEntity[] | null;
  createdAt: string;
  updatedAt: string;
  lastPublishedAt: string;
  tags?: string[] | null;
}
export interface Uploader {
  id: number;
  name: string;
  hash?: string | null;
  avatar: string;
  type: string;
}
export interface Metadata {
  bpm: number;
  duration: number;
  songName: string;
  songSubName: string;
  songAuthorName: string;
  levelAuthorName: string;
}
export interface Stats {
  plays: number;
  downloads: number;
  upvotes: number;
  downvotes: number;
  score: number;
}
export interface VersionsEntity {
  hash: string;
  state: string;
  createdAt: string;
  sageScore: number;
  diffs?: DiffsEntity[] | null;
  downloadURL: string;
  coverURL: string;
  previewURL: string;
}
export interface DiffsEntity {
  njs: number;
  offset: number;
  notes: number;
  bombs: number;
  obstacles: number;
  nps: number;
  length: number;
  characteristic: string;
  difficulty: string;
  events: number;
  chroma: boolean;
  me: boolean;
  ne: boolean;
  cinema: boolean;
  seconds: number;
  paritySummary: ParitySummary;
}
export interface ParitySummary {
  errors: number;
  warns: number;
  resets: number;
}

export enum VideoSrcType {
  Device = "device",
  Uri = "uri",
}

export interface VideoStream {
  src: string;
  src_type: VideoSrcType;
  cover: string;
  name: string;
  description: string;
  udp_port: number;
}

export interface QcDataframeRow {
  adhesion__count: number;
  adhesion__mean: number;
  adhesion__std: number;
  nozzle__count: number;
  nozzle__mean: number;
  nozzle__std: number;
  print__count: number;
  print__mean: number;
  print__std: number;
  raft__count: number;
  raft__mean: number;
  raft__std: number;
  spaghetti__mean: number;
  spaghetti__count: number;
  spaghetti__std: number;
  detection_scores: number;
  ts: number;
}

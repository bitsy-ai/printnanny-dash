export interface JanusMedia {
  age_ms: number;
  codec: string;
  label: string;
  mid: string;
  mindex: number;
  port: number;
  pt: number;
  rtpmap: string;
  type: string;
}

export interface JanusStreamMetadata {
  path: string;
}
export interface JanusStream {
  description: string;
  enabled: boolean;
  id: number;
  media: Array<JanusMedia>;
  metadata: JanusStreamMetadata;
  name: string;
  type: string;
  viewers: number;
}
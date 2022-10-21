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

export interface JanusStream {
  description: string;
  enabled: boolean;
  id: number;
  media: Array<JanusMedia>;
  name: string;
  type: string;
  viewers: number;
}

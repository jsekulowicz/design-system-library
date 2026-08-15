export interface ShareBarDatum {
  label: string;
  value: number;
  color?: string;
}

export interface ShareBarSegment {
  label: string;
  value: number;
  percent: number;
  color?: string;
  isOther: boolean;
}

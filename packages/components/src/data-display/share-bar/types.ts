export interface ShareBarDatum {
  label: string;
  value: number;
  color?: string;
  icon?: string;
}

export interface ShareBarSegment {
  label: string;
  value: number;
  percent: number;
  color?: string;
  icon?: string;
  isOther: boolean;
}

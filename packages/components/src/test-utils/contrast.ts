export type LinearRgb = readonly [number, number, number];

function toLinearChannel(srgbChannel: number): number {
  if (srgbChannel <= 0.04045) {
    return srgbChannel / 12.92;
  }
  return ((srgbChannel + 0.055) / 1.055) ** 2.4;
}

function clipToUnit(channel: number): number {
  return Math.min(1, Math.max(0, channel));
}

export function parseHexToLinearRgb(hex: string): LinearRgb {
  const digits = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((offset) => toLinearChannel(parseInt(digits.slice(offset, offset + 2), 16) / 255));
  return [r!, g!, b!];
}

export function convertOklchToClippedLinearRgb(lightness: number, chroma: number, hueDegrees: number): LinearRgb {
  const a = chroma * Math.cos((hueDegrees * Math.PI) / 180);
  const b = chroma * Math.sin((hueDegrees * Math.PI) / 180);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    clipToUnit(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clipToUnit(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clipToUnit(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

function getRelativeLuminance([r, g, b]: LinearRgb): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(first: LinearRgb, second: LinearRgb): number {
  const [lighter, darker] = [getRelativeLuminance(first), getRelativeLuminance(second)].sort((x, y) => y - x);
  return (lighter! + 0.05) / (darker! + 0.05);
}

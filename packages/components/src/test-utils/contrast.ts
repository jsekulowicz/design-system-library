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
  const [red, green, blue] = [0, 2, 4].map((offset) =>
    toLinearChannel(parseInt(digits.slice(offset, offset + 2), 16) / 255),
  );
  return [red!, green!, blue!];
}

export function convertOklchToClippedLinearRgb(lightness: number, chroma: number, hueDegrees: number): LinearRgb {
  const greenRed = chroma * Math.cos((hueDegrees * Math.PI) / 180);
  const blueYellow = chroma * Math.sin((hueDegrees * Math.PI) / 180);
  const longCone = (lightness + 0.3963377774 * greenRed + 0.2158037573 * blueYellow) ** 3;
  const mediumCone = (lightness - 0.1055613458 * greenRed - 0.0638541728 * blueYellow) ** 3;
  const shortCone = (lightness - 0.0894841775 * greenRed - 1.291485548 * blueYellow) ** 3;
  return [
    clipToUnit(4.0767416621 * longCone - 3.3077115913 * mediumCone + 0.2309699292 * shortCone),
    clipToUnit(-1.2684380046 * longCone + 2.6097574011 * mediumCone - 0.3413193965 * shortCone),
    clipToUnit(-0.0041960863 * longCone - 0.7034186147 * mediumCone + 1.707614701 * shortCone),
  ];
}

function getRelativeLuminance([red, green, blue]: LinearRgb): number {
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function getContrastRatio(first: LinearRgb, second: LinearRgb): number {
  const [lighter, darker] = [getRelativeLuminance(first), getRelativeLuminance(second)].sort((x, y) => y - x);
  return (lighter! + 0.05) / (darker! + 0.05);
}

const BRAZILIAN_TZ_OFFSET = -180;

export function getBrazilianUTCDate() {
  const now = new Date();
  const offset = BRAZILIAN_TZ_OFFSET;
  return new Date(now.getTime() + offset * 60 * 1000);
}

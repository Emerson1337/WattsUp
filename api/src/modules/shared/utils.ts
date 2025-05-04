export const BRAZIL_TZ = "America/Sao_Paulo";

export type TIMEZONES = typeof BRAZIL_TZ;

export const calculateCIP = (kWh: number): number => {
  // https://www.sefin.fortaleza.ce.gov.br/Canal/16/Generico/1201/Ler
  // This is the taxes for Fortaleza. If we want to make it dynamic, let's have a collection per city here.
  const tiers = [
    { max: 30, percent: 0.0072 },
    { max: 100, percent: 0.0107 },
    { max: 150, percent: 0.0252 },
    { max: 200, percent: 0.0268 },
    { max: 250, percent: 0.0284 },
    { max: 350, percent: 0.0669 },
    { max: 400, percent: 0.0671 },
    { max: 500, percent: 0.0682 },
    { max: 800, percent: 0.1387 },
    { max: 1000, percent: 0.1905 },
    { max: 2000, percent: 0.3466 },
    { max: Infinity, percent: 0.359 },
  ];

  const tier = tiers.find((t) => kWh <= t.max);
  if (!tier) return 0;

  return kWh * tier.percent;
};

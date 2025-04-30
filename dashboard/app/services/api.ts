export function subscribeToLiveAreaChartData(
  callback: (data: { consumption: number }[]) => void
) {
  const data: { consumption: number }[] = [];
  const interval = setInterval(() => {
    const newEntry = {
      consumption: Math.floor(100 + Math.random() * 50),
    };

    data.push(newEntry);

    if (data.length > 90) {
      data.shift();
    }

    callback([...data]);
  }, 1000);

  return () => clearInterval(interval);
}

export async function fetchRadialChartData() {
  return new Promise<{ consumption: number; fill: string }[]>((resolve) => {
    setTimeout(() => {
      resolve([{ consumption: 200, fill: "var(--chart-2)" }]);
    }, 500);
  });
}

export async function fetchSimpleBarChartMultipleData() {
  return new Promise<{ month: string; past: number; current: number }[]>(
    (resolve) => {
      setTimeout(() => {
        resolve([
          { month: "January", past: 186, current: 80 },
          { month: "February", past: 305, current: 200 },
          { month: "March", past: 237, current: 120 },
          { month: "April", past: 73, current: 190 },
          { month: "May", past: 209, current: 130 },
          { month: "June", past: 214, current: 140 },
        ]);
      }, 500);
    }
  );
}

export async function fetchBarChartInteractiveData() {
  return new Promise<{ date: string; consumption: number }[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { date: "2024-04-01", consumption: 150 },
        { date: "2024-04-02", consumption: 180 },
        { date: "2024-04-03", consumption: 120 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        { date: "2024-04-04", consumption: 260 },
        // (...and so on...)
      ]);
    }, 500);
  });
}

export async function fetchMonthlyConsumptionData() {
  return new Promise<{ name: string; value: number; fill: string }[]>(
    (resolve) => {
      setTimeout(() => {
        resolve([
          { name: "energyConsumption", value: 120, fill: "var(--chart-1)" },
          { name: "taxes", value: 90, fill: "var(--chart-2)" },
          { name: "publicLighting", value: 60, fill: "var(--chart-3)" },
        ]);
      }, 500);
    }
  );
}

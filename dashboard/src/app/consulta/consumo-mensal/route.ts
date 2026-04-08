import { ApiPaths } from "@/lib/apiUrls";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const calibrate = searchParams.get("calibrate") === "true";

    const res = await fetch(ApiPaths.monthlyReport.get(calibrate));

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return new Response(JSON.stringify(await res.json()), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Erro ao consultar dados mensais de energia:", error);
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

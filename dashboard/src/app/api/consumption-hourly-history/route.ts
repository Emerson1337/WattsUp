import { ApiPaths } from "@/lib/apiUrls";

export async function GET() {
  try {
    const res = await fetch(ApiPaths.history.lastDay());

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return new Response(JSON.stringify(await res.json()), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(
      "Erro ao consultar dados históricos de consumo de energia:",
      error
    );
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

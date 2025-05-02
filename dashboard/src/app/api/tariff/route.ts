import { ApiPaths } from "@/lib/apiUrls";

export async function GET() {
  try {
    console.log("🟢🟢🟢🟢 ApiPaths.tariff.get()", ApiPaths.tariff.get());

    const res = await fetch(ApiPaths.tariff.get());

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return new Response(JSON.stringify(await res.json()), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Erro ao consultar dados de energia:", error);
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

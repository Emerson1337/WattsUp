import { ApiPaths } from "@/lib/apiUrls";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const res = await fetch(ApiPaths.tariff.update(params.id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return new Response(JSON.stringify(await res.json()), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar tarifa:", error);
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

import { fetchOpenDataContext } from "@/lib/open-data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") ?? "Milano";
  const sector = searchParams.get("sector") ?? "Manifattura";
  const context = await fetchOpenDataContext(city, sector);

  return NextResponse.json(context);
}

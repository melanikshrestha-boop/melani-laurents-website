import { NextResponse } from "next/server";
/** No Apple Books on public site — empty success so Wonder UI stays quiet. */
export async function GET() {
  return NextResponse.json({ source: "none", count: 0, books: [] });
}

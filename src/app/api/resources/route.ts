import { NextResponse } from "next/server";
import { fetchResourceViews } from "../util";

export async function GET() {
	return NextResponse.json(await fetchResourceViews());
}

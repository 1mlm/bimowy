import { NextResponse } from "next/server";
import { fetchResourceView } from "../../util";

export async function GET(_req: Request, { params }: { params: Promise<{ handle: string }> }) {
	const { handle } = await params;
	const resource = await fetchResourceView(handle);
	if (!resource)
		return NextResponse.json({ message: `No resource found for "${handle}"` }, { status: 404 });
	return NextResponse.json(resource);
}

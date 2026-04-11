import { echo } from "@/utils/echo";

export class NSError extends Error {
	constructor(message: string, _extra?: unknown) {
		if (_extra !== undefined) echo("🟥", _extra);
		super(message);
	}
}

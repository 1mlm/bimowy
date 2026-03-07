import { NSError } from "../error";

export function assertIsString(wtv: unknown): asserts wtv is string {
	if (typeof wtv !== "string") throw new NSError("Value is not a string", wtv);
}

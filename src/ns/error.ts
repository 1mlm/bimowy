export class NSError extends Error {
	constructor(message: string, _extra?: unknown) {
		super(message);
	}
}

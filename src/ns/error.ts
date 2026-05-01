export class NSError extends Error {
	constructor(message: string, _extra?: unknown) {
		super({ message, extra: _extra } as unknown as string);
	}
}

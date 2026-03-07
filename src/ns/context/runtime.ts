export class NSRuntimeContext {
	constructor(
		public parent: NSRuntimeContext | null = null,
		public variables = new Map()
	) {}
	getVar(id: string): unknown {
		if (this.variables.has(id)) return this.variables.get(id) ?? null;
		return this.parent?.getVar(id) ?? null;
	}
	setVar(id: string, value: unknown) {
		this.variables.set(id, value);
		return null;
	}
}

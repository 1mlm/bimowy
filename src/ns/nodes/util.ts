import z from "zod";
import type { RuntimeContext, ScantimeContext } from "@/ns/context";
import { NSError } from "@/ns/error";
import type { NSNodeID } from "@/ns/nodes";
import type { NSScan } from "@/ns/scan";

export function createSimpleNodeParser<Schema extends z.ZodType>({
	schema,
	execute,
	scan = () => ({ schema: z.never(), notes: [] })
}: {
	schema: Schema;
	execute: (node: z.infer<Schema>, ctx: RuntimeContext) => unknown;
	scan?: (node: z.infer<Schema>, ctx: ScantimeContext) => NSScan;
}) {
	return { schema, execute, scan };
}

export function createComplexNodeParser<
	T extends NSNodeID,
	P extends string,
	Schema = z.ZodType<NSBaseComplexNode<T, P>>
>({
	nstype,
	props,
	execute,
	scan = () => ({ schema: z.never(), notes: [] })
}: {
	nstype: T;
	props: P[];
	execute: (node: z.infer<Schema>, ctx: RuntimeContext) => unknown;
	scan?: (node: z.infer<Schema>, ctx: ScantimeContext) => NSScan;
}) {
	return {
		nstype,
		scan,
		schema: z.object({
			_nstype: z.literal(nstype),
			...props.reduce((acc, prop) => ({ ...acc, [prop]: z.unknown().default(null) }), {})
		}) as Schema,
		execute
	};
}

export type NSBaseComplexNode<NSType extends NSNodeID, NSKey extends string> = {
	_nstype: NSType;
} & {
	[key in NSKey]: unknown;
};

export function assertIsString(wtv: unknown): asserts wtv is string {
	if (typeof wtv !== "string") throw new NSError("Value is not a string", wtv);
}
export function assertIsArray(wtv: unknown): asserts wtv is unknown[] {
	if (!Array.isArray(wtv)) throw new NSError("Value is not an array", wtv);
}

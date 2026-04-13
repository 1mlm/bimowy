import z from "zod";

function orNull<T extends z.ZodTypeAny>(schema: T): z.ZodUnion<[T, z.ZodNull]> {
	return z.union([schema, z.null()]);
}

export const NSResource = z.object({
	id: z.uuid(),
	type: z.string(),
	title: z.string(),
	tags: z.array(z.string()),
	handle: z.string(),
	aliases: z.array(z.string()).default([]),
	beta: orNull(z.boolean()).transform((v) => (v == null ? true : v)),
	description: orNull(z.string()),
	data: z.unknown()
});

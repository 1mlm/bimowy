import z from "zod";
import { NSError } from "@/ns/error";
import { isSchemaSubset } from "@/ns/is-schema-subset";

export function assertIsBooleanSchema(schema: z.ZodType): asserts schema is z.ZodBoolean {
	if (!isSchemaSubset(z.boolean(), schema)) throw new NSError("Schema is not a boolean", schema);
}

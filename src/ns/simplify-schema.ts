import z, { type ZodType } from "zod";
import {
	areSelfSubset,
	getIntersectionSchemas,
	getUnionSchemas,
	isIntersectionSchema,
	isUnionSchema
} from "./is-schema-subset";

export function simplifySchema(schema: ZodType): ZodType {
	if (isUnionSchema(schema)) {
		const schemas = [...new Set(getUnionSchemas(schema).map((s) => simplifySchema(s)))];
		return z.union(schemas);
	}
	if (isIntersectionSchema(schema)) {
		const schemas = getIntersectionSchemas(schema).map((s) => simplifySchema(s));
		if (areSelfSubset(schemas[0], schemas[1])) return schemas[0];
		return z.intersection(schemas[0], schemas[1]);
	}
	return schema;
}

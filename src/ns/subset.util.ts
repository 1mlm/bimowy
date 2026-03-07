import type z from "zod";
import {
	type ZodAny,
	type ZodBoolean,
	type ZodIntersection,
	type ZodLiteral,
	type ZodNumber,
	type ZodString,
	ZodType,
	type ZodUnion,
	type ZodUnknown
} from "zod";

export function isSchema(schema: unknown): schema is ZodType {
	return (
		typeof schema === "object" && schema !== null && "type" in schema && schema instanceof ZodType
	);
}

export function isStringSchema(schema: unknown): schema is ZodString {
	return isStringLiteralSchema(schema) || (isSchema(schema) && schema.type === "string");
}

export function isNumberSchema(schema: unknown): schema is ZodNumber {
	return isSchema(schema) && schema.type === "number";
}

export function isBooleanSchema(schema: unknown): schema is ZodBoolean {
	return isSchema(schema) && schema.type === "boolean";
}

export function isLiteralSchema(schema: unknown): schema is ZodLiteral {
	return isSchema(schema) && schema.type === "literal";
}

export function isUnionSchema(schema: unknown): schema is ZodUnion {
	return isSchema(schema) && schema.type === "union";
}

export function isStringLiteralSchema(schema: unknown): schema is ZodLiteral<string> {
	return isSchema(schema) && isLiteralSchema(schema) && typeof schema.value === "string";
}

export function isNumberLiteralSchema(schema: unknown): schema is ZodLiteral<number> {
	return isSchema(schema) && isLiteralSchema(schema) && typeof schema.value === "number";
}

export function isBooleanLiteralSchema(schema: unknown): schema is ZodLiteral<boolean> {
	return isSchema(schema) && isLiteralSchema(schema) && typeof schema.value === "boolean";
}

export function isIntersectionSchema(schema: unknown): schema is ZodIntersection {
	return isSchema(schema) && schema.type === "intersection";
}

export function isWhateverSchema(schema: unknown): schema is ZodAny | ZodUnknown {
	return isSchema(schema) && (schema.type === "any" || schema.type === "unknown");
}

export function isNeverSchema(schema: unknown): schema is z.ZodNever {
	return isSchema(schema) && schema.type === "never";
}

export function getLiteralValue(schema: ZodLiteral): unknown {
	return schema.value;
}

export function getUnionSchemas(schema: ZodUnion): ZodType[] {
	// @ts-expect-error
	return schema.options;
}

export function getIntersectionSchemas(schema: ZodIntersection) {
	return [schema.def.left, schema.def.right] as [ZodType, ZodType];
}

export function areSelfSubset(schema1: ZodType, schema2: ZodType) {
	// Import locally to avoid circular dependency
	const { isSchemaSubset } = require("./subset");
	return (
		isSchema(schema1) &&
		isSchema(schema2) &&
		isSchemaSubset(schema1, schema2) &&
		isSchemaSubset(schema2, schema1)
	);
}

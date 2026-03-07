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
import { NSError } from "./error";

/**
 * Checks if the inputSchema can be used wherever the mainSchema is expected.
 * @covers Union, Literal, String, Number, Boolean
 * @author Ali Elbani (ft. Mohammed Ihab Kabiri)
 *
 * @example
 * areCompatible(z.string(), z.string()) // true cuz strings are strings nga
 * areCompatible(z.string(),z.literal("ok")) // true (because "ok" is a string)
 * areCompatible(z.literal("ok"),z.string()) // false (because not all strings are "ok")
 */
export function isSchemaSubset(mainSchema: ZodType, inputSchema: ZodType): boolean {
	if (isNeverSchema(mainSchema)) return true;
	if (isNeverSchema(inputSchema)) return false;
	if (isWhateverSchema(mainSchema)) return true;
	if (isWhateverSchema(inputSchema)) return false;

	if (isUnionSchema(mainSchema)) {
		const mainSchemas = getUnionSchemas(mainSchema);
		return mainSchemas.some((oneOfMainSchema) => isSchemaSubset(oneOfMainSchema, inputSchema));
	}

	if (isUnionSchema(inputSchema)) {
		const inputSchemas = getUnionSchemas(inputSchema);
		return inputSchemas.every((oneOfInputSchema) => isSchemaSubset(mainSchema, oneOfInputSchema));
	}

	if (isIntersectionSchema(mainSchema)) {
		const mainSchemas = getIntersectionSchemas(mainSchema);
		return mainSchemas.every((oneOfMainSchema) => isSchemaSubset(oneOfMainSchema, inputSchema));
	}

	// no recursivity here (hopefully)

	if (isLiteralSchema(mainSchema)) {
		if (isLiteralSchema(inputSchema)) {
			if (mainSchema.value === inputSchema.value) return true;
			return false;
		}
		return false;
	}

	if (isStringSchema(mainSchema)) {
		if (isStringLiteralSchema(inputSchema) || isStringSchema(inputSchema)) return true;
		return false;
	}

	if (isNumberSchema(mainSchema)) {
		if (isNumberLiteralSchema(inputSchema) || isNumberSchema(inputSchema)) return true;
		return false;
	}

	if (isBooleanSchema(mainSchema)) {
		if (isBooleanLiteralSchema(inputSchema) || isBooleanSchema(inputSchema)) return true;
		return false;
	}

	// TODO
	throw new NSError("areCompatible: Unsupported schema types", { mainSchema, inputSchema });
}

function isSchema(schema: unknown): schema is ZodType {
	return (
		typeof schema === "object" && schema !== null && "type" in schema && schema instanceof ZodType
	);
}

export function isStringSchema(schema: unknown): schema is ZodString {
	return isSchema(schema) && (isLiteralSchema(schema) || schema.type === "string");
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
	return isLiteralSchema(schema) && typeof schema.value === "string";
}

export function isNumberLiteralSchema(schema: unknown): schema is ZodLiteral<number> {
	return isLiteralSchema(schema) && typeof schema.value === "number";
}

export function isBooleanLiteralSchema(schema: unknown): schema is ZodLiteral<boolean> {
	return isLiteralSchema(schema) && typeof schema.value === "boolean";
}

export function getUnionSchemas(schema: ZodUnion): ZodType[] {
	// @ts-expect-error
	return schema.options;
}
export function getIntersectionSchemas(schema: ZodIntersection) {
	return [schema.def.left, schema.def.right] as [ZodType, ZodType];
}

export function isIntersectionSchema(schema: unknown): schema is ZodIntersection {
	return isSchema(schema) && schema.type === "intersection";
}

export function areSelfSubset(schema1: ZodType, schema2: ZodType) {
	return isSchemaSubset(schema1, schema2) && isSchemaSubset(schema2, schema1);
}

export function getLiteralValue(schema: ZodLiteral): unknown {
	return schema.value;
}

export function isWhateverSchema(schema: unknown): schema is ZodAny | ZodUnknown {
	return isSchema(schema) && (schema.type === "any" || schema.type === "unknown");
}

export function isNeverSchema(schema: unknown): schema is z.ZodNever {
	return isSchema(schema) && schema.type === "never";
}

import type z from "zod";
import { NSError } from "@/ns/error";
import { executeNS } from "@/ns/execute";
import { createComplexNodeParser } from "../util";

export const NSGetFieldNodeData = createComplexNodeParser({
	nstype: "get-field",
	props: ["object", "field"],
	execute: (node, ctx) => {
		const obj = executeNS(node.object, ctx);
		if ((typeof obj !== "object" || obj === null) && !Array.isArray(obj)) {
			throw new NSError("get-field target must be an object or array", { obj, node });
		}

		const field = executeNS(node.field, ctx);
		if (typeof field !== "string" && typeof field !== "number") {
			throw new NSError("get-field field must be a string or number", { field, node });
		}

		const value = (obj as Record<string | number, unknown>)[field];
		return typeof value === "undefined" ? null : value;
	}
});

export type NSGetFieldNode = z.infer<typeof NSGetFieldNodeData.schema>;

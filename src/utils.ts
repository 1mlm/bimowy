import { RESOURCE_TYPES_MAP } from "@/ui/config/resource-types";

export function getResourceTypeFromHandle(typeHandle: string) {
	return RESOURCE_TYPES_MAP.find((rt) => rt.handle === typeHandle) ?? null;
}

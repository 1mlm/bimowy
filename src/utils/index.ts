import { RESOURCE_TYPES_MAP } from "@/ui/constants/resource-types";

export function getResourceTypeFromHandle(resource_type_handle: string) {
	return RESOURCE_TYPES_MAP.find((item) => item.handle === resource_type_handle);
}

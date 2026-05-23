import type { FetchedResource } from "@/db/util";
import { RESOURCE_TYPES_MAP, UNKNOWN_RESOURCE_TYPE } from "@/ui/constants/resource-types";
import { formatToPascalCase } from "@/utils/format";

// TODO: polish
export function ResourceCardTopLeftBadge({
  resource,
  isFocused
}: {
  resource: FetchedResource;
  isFocused?: boolean;
}) {
  const resourceTypeData =
    RESOURCE_TYPES_MAP.find((r) => r.type === resource.type)
    || UNKNOWN_RESOURCE_TYPE;
  const label = formatToPascalCase(resource.type);
  return (
    <div
      className={`absolute -top-3.5 -left-3.5 rounded-full
				size-8
				${resourceTypeData.backgroundColorClassName}
        ${isFocused && "w-fit px-1.5 pr-3 -rotate-3 scale-105 -translate-y-1"}
				flex items-center justify-center duration-75
        origin-bottom-left
				overflow-hidden whitespace-nowrap
				shadow-xl`}
    >
      <resourceTypeData.icon className="p-1 h-full aspect-square shrink-0" />
      <span
        className={`duration-150 text-nowrap
				${isFocused ? "scale-100 w-fit pl-1" : "scale-0 w-0"}`}
      >
        {label}
      </span>
    </div>
  );
}

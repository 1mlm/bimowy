"use client";
import { useRef } from "react";
import type { FetchedResource } from "@/db/util";
import { useIsFocused } from "@/ui/hooks/useIsFocused";
import { RESOURCE_TYPES_MAP, UNKNOWN_RESOURCE_TYPE } from "../../config/resource-types";
import { ResourceCardPopupProvider } from "./ResourceCardPopupProvider";
import { ResourceCardTag } from "./ResourceCardTag";
import { ResourceCardTopLeftBadge } from "./ResourceCardTopLeftBadge";

export function ResourceCard(resource: FetchedResource) {
	const ref = useRef<HTMLDivElement>(null);
	const isFocused = useIsFocused(ref);
	const resourceTypeData = RESOURCE_TYPES_MAP.find(r => r.type === resource.type)
		|| UNKNOWN_RESOURCE_TYPE;

	return (
		<ResourceCardPopupProvider {...{ resource }}>
			<div
				{...{ ref }}
				className={`rounded-xl shadow-md w-fit p-3 text-center
				duration-75
				relative
				outline-0 hover:outline-2
				${resource.beta
						? `opacity-50 cursor-not-allowed ${isFocused && "hover:scale-95"} grayscale-75`
						: `${isFocused && "hover:scale-105"} active:scale-95 cursor-pointer`
					}`}
				style={{ outlineColor: resourceTypeData.color }}
			>
				<ResourceCardTopLeftBadge {...{ resource }} />
				<p className="text-2xl font-semibold">{resource.title}</p>
				<p className="text-sm opacity-80">{resource.desc}</p>
				<div className="mt-2 flex justify-center gap-1 flex-wrap">
					{resource.tags.map((tag, i) => (
						<ResourceCardTag key={i} {...tag} />
					))}
				</div>
			</div>
		</ResourceCardPopupProvider>
	);
}

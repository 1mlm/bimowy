import Link from "next/link";
import type { FetchedResource } from "@/db/util";
import { formatToPascalCase } from "@/utils/format";
import { RESOURCE_TYPES_UI_MAP } from "../constants/resource-types";
import { TAGS_ICON_MAP } from "../constants/tags";

export function ResourceCard(resource: FetchedResource) {
	const resourceTypeData = RESOURCE_TYPES_UI_MAP[resource.type];
	const href = resource.beta ? "" : `/${resourceTypeData.handle}/${resource.handle}`;

	const resourceTypeLabel = formatToPascalCase(resource.type);
	return (
		<Link
			{...{ href }}
			className={`rounded-xl shadow-sm w-fit p-3 text-center
				duration-75
				relative group/card
				border group-hover/card:border-2
				${resource.beta
					? "opacity-50 cursor-not-allowed hover:scale-95 grayscale-75"
					: "hover:scale-105 active:scale-95 cursor-pointer"
				}`}
			style={{ borderColor: resourceTypeData.color }}
		>
			<div
				className={`absolute -top-3.5 -left-3.5 rounded-full
				size-8
				${resourceTypeData.backgroundColorClassName}
				group-hover/card:w-fit group-hover/card:px-1.5 group-hover/card:pr-3  
				flex items-center justify-center duration-75
				group-hover/card:-rotate-3 origin-bottom-left
				group-hover/card:scale-105 group-hover/card:-translate-y-1
				overflow-hidden whitespace-nowrap`}
			>
				<resourceTypeData.icon className="p-1 h-full aspect-square shrink-0" />
				<span className="scale-0 w-0 duration-150 text-nowrap
				group-hover/card:scale-100 group-hover/card:w-fit group-hover/card:pl-1">
					{resourceTypeLabel}
				</span>
			</div>
			<p className="text-2xl font-semibold">{resource.title}</p>
			<p className="text-sm opacity-80">{resource.desc}</p>
			<div className="mt-2 flex justify-center gap-1 flex-wrap">
				{resource.tags.map((tag, i) => (
					<ResourceCardTag key={i} {...tag} />
				))}
			</div>
		</Link>
	);
}

export function ResourceCardTag(tag: FetchedResource["tags"][number]) {
	const Icon = TAGS_ICON_MAP[tag.handle]?.icon;

	return (
		<span
			className="bg-white/5 text-xs px-2 py-0.5 rounded-xl border
    flex items-center justify-center"
		>
			{Icon && <Icon className="inline-block mr-1 size-3" />}
			{tag.title}
		</span>
	);
}

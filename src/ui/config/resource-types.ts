import { FolderOpenIcon, type LucideIcon, OrigamiIcon, Table2Icon, TargetIcon } from "lucide-react";
import { ResourceType } from "@/db/generated/enums";

type ResourceTypeMapItem = {
	type: ResourceType;
	label: string;
	icon: LucideIcon;
	borderColorClassName: string;
	backgroundColorClassName: string;
	handle: string;
	color: string;
};

export const RESOURCE_TYPES_MAP: ResourceTypeMapItem[] = [
	{
		type: ResourceType.TEMPLATE_EXERCISE,
		label: "Template Exercise",
		icon: TargetIcon,
		color: "#d97706",
		borderColorClassName: "border-amber-500",
		backgroundColorClassName: "bg-amber-500",
		handle: "te"
	},
	{
		type: ResourceType.ARTICLE,
		label: "Article",
		icon: OrigamiIcon,
		color: "#22c55e",
		borderColorClassName: "border-green-500",
		backgroundColorClassName: "bg-green-500",
		handle: "a"
	},
	{
		type: ResourceType.COURSE,
		label: "Course",
		icon: FolderOpenIcon,
		color: "#a855f7",
		borderColorClassName: "border-purple-500",
		backgroundColorClassName: "bg-purple-500",
		handle: "c"
	},
	{
		type: ResourceType.RESOURCE_GROUP,
		label: "Resource Group",
		icon: FolderOpenIcon,
		color: "#f97316",
		borderColorClassName: "border-orange-500",
		backgroundColorClassName: "bg-orange-500",
		handle: "g"
	},
	{
		type: ResourceType.TABLE,
		label: "Table",
		icon: Table2Icon,
		color: "#ef4444",
		borderColorClassName: "border-red-500",
		backgroundColorClassName: "bg-red-500",
		handle: "t"
	}
];

export const UNKNOWN_RESOURCE_TYPE: ResourceTypeMapItem = {
	type: "unknown" as ResourceType,
	label: "Unknown",
	icon: FolderOpenIcon,
	color: "#94a3b8",
	borderColorClassName: "border-slate-500",
	backgroundColorClassName: "bg-slate-500",
	handle: "?"
};

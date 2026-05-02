import { FolderOpenIcon, type LucideIcon, OrigamiIcon, PencilIcon, Table2Icon } from "lucide-react";
import { ResourceType } from "@/db/generated/enums";

export const RESOURCE_TYPES_UI_MAP: Record<
	ResourceType,
	{
		icon: LucideIcon;
		borderColorClassName: string;
		backgroundColorClassName: string;
		handle: string;
		color: string;
	}
> = {
	[ResourceType.TEMPLATE_EXERCISE]: {
		icon: PencilIcon,
		color: "#d97706",
		borderColorClassName: "border-amber-500",
		backgroundColorClassName: "bg-amber-500",
		handle: "te"
	},
	[ResourceType.ARTICLE]: {
		icon: OrigamiIcon,
		color: "#22c55e",
		borderColorClassName: "border-green-500",
		backgroundColorClassName: "bg-green-500",
		handle: "a"
	},
	[ResourceType.COURSE]: {
		icon: FolderOpenIcon,
		color: "#a855f7",
		borderColorClassName: "border-purple-500",
		backgroundColorClassName: "bg-purple-500",
		handle: "c"
	},
	[ResourceType.RESOURCE_GROUP]: {
		icon: FolderOpenIcon,
		color: "#f97316",
		borderColorClassName: "border-orange-500",
		backgroundColorClassName: "bg-orange-500",
		handle: "g"
	},
	[ResourceType.TABLE]: {
		icon: Table2Icon,
		color: "#ef4444",
		borderColorClassName: "border-red-500",
		backgroundColorClassName: "bg-red-500",
		handle: "t"
	}
};

import type { LucideIcon } from "lucide-react";
import { Code, Compass, Plus, Signpost, UserRound } from "lucide-react";

const hubItems = [
	{ id: "create", label: "Create a Resource", icon: Plus, disabled: true },
	{ id: "browse", label: "Browse", icon: Compass, href: "/test" },
	{ id: "tuto", label: "Tutorial", icon: Signpost, disabled: true },
	{ id: "credits", label: "Source code", icon: Code, href: "https://github.com/bimoware/bimowy" },
	{ id: "profile", label: "Profile", icon: UserRound, disabled: true }
] satisfies {
	id: string;
	label: string;
	icon: LucideIcon;
	disabled?: boolean;
	href?: string;
}[];

export default function HomePage() {
	return <main>
		<div className="h-full aspect-square"></div>
	</main>;
}

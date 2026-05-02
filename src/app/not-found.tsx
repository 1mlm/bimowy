"use client";
import { BadgeQuestionMarkIcon } from "lucide-react";
import { MetaPage } from "@/ui/templates/MetaPage";

export default function NotFoundPage() {
	return (
		<MetaPage
			title="Page Not Found"
			description="bro WHAT could you be looking for"
			icon={BadgeQuestionMarkIcon}
		/>
	);
}

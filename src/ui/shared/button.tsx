"use client";
import { twMerge } from "tailwind-merge";
import { Button as ShadcnButton } from "@/ui/shadcn/ui/button";

export function Button({ children, className, ...props }: Parameters<typeof ShadcnButton>[0]) {
	return (
		<ShadcnButton
			{...props}
			className={twMerge(
				`font-semibold cursor-pointer
    hover:scale-105 active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed`,
				className
			)}
		>
			{children}
		</ShadcnButton>
	);
}

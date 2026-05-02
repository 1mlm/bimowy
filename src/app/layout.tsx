import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import type { PropsWithChildren } from "react";
import "@/ui/style.css";
import SideBarWrapper from "@/ui/layout/SidebarWrapper";

const outfitFont = Outfit({
	subsets: ["latin"],
	variable: "--font-outfit"
});

export const metadata: Metadata = {
	description: "Learning but it's actually fun",
	title: "AllForOne"
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className={`${outfitFont.className}`}>
				<SideBarWrapper>{children}</SideBarWrapper>
			</body>
		</html>
	);
}

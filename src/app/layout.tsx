import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import "@/ui/css/main.css";
import SideBarWrapper from "@/ui/layout/SidebarWrapper";
import { mainFont } from "@/ui/fonts";

export const metadata: Metadata = {
	description: "Learning but it's actually fun",
	title: "AllForOne"
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className={mainFont.className}>
				<SideBarWrapper>
					{children}
				</SideBarWrapper>
			</body>
		</html>
	);
}

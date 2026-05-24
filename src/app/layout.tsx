import type { Metadata } from "next";
import { Google_Sans_Code, Outfit } from "next/font/google";
import type { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import "@/ui/style.css";
import SideBarWrapper from "@/ui/layout/SidebarWrapper";

const mainFont = Outfit();
const monoFont = Google_Sans_Code({ variable: "--font-mono" });

export const metadata: Metadata = {
	description: "Learning but it's actually fun",
	title: "AllForOne"
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className={`${mainFont.className} ${monoFont.variable}`}>
				<SideBarWrapper>
					{children}
				</SideBarWrapper>
				<Toaster theme="dark" />
			</body>
		</html>
	);
}

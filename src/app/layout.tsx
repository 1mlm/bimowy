import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import type { PropsWithChildren } from "react";

import "./style.css";
import SideBarWrapper from "@/cpn/main/SidebarWrapper";

const outfitFont = Outfit({
	subsets: ["latin"],
	variable: "--font-outfit"
});

export const metadata: Metadata = {
	description: "Learning but it's actually fun",
	title: "Hub41"
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className={`${outfitFont.className}`}>
				{process.env.NODE_ENV === "production" && (
					<>
						<Analytics />
						<SpeedInsights />
					</>
				)}
				<SideBarWrapper>{children}</SideBarWrapper>
			</body>
		</html>
	);
}

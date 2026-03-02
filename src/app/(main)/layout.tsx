import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { PropsWithChildren } from "react";

import "@/css/style.css";
import SideBarWrapper from "@/cpn/main/SidebarWrapper";

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<>
			{process.env.NODE_ENV === "production" && (
				<>
					<Analytics />
					<SpeedInsights />
				</>
			)}
			<SideBarWrapper>{children}</SideBarWrapper>
		</>
	);
}

"use client";

import { Fragment } from "react";
import { UIRenderer } from "./UIRenderer";

export function Paragraph({ items }: { items: unknown[] }) {
	return (
		<p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-3xl leading-relaxed">
			{items.map((item, i) => (
				<Fragment key={i}>
					<UIRenderer node={item} />
				</Fragment>
			))}
		</p>
	);
}

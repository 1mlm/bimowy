"use client";

import { UIRenderer } from "./UIRenderer";

export function RootUIRenderer({ nodes }: { nodes: unknown[] }) {
	return (
		<div className="flex flex-col gap-6 w-full">
			{nodes.map((node, i) => (
				<UIRenderer key={i} node={node} />
			))}
		</div>
	);
}

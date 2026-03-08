import { useLayoutEffect, useRef } from "react";

const colors = {
	red: "bg-red-500",
	blue: "bg-blue-500",
	yellow: "bg-amber-600",
	green: "bg-green-600",
	purple: "bg-purple-600"
};

export type BlockProps = {
	id: string;
	text: string;
	color: keyof typeof colors;
	children?: BlockProps[];
};

export function Block({ data }: { data: BlockProps }) {
	const blockRef = useRef<HTMLDivElement>(null);
	const blockTextRef = useRef<HTMLDivElement>(null);

	function remToPx(rem: number) {
		return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
	}
	const IS_PARENT = data.children && data.children.length > 0;

	useLayoutEffect(() => {
		const el = blockRef.current;
		const el2 = blockTextRef.current;
		if (!el) return;
		if (!el2) return;
		const {
			width: tw, // Text Width
			height: th // Text Height
		} = el2.getBoundingClientRect();

		const r = remToPx(0.5), // Main Radius
			br = remToPx(0.1), // Bump & Hole radius
			o = remToPx(0.4), // Bump & Hole offset from corner
			bw = remToPx(0.3), // Bump/Hole width
			pw = remToPx(IS_PARENT ? 0.7 : 0); // Parent with

		const paddingX = r;
		const paddingTop = r;
		const paddingBottom = r;

		const w = tw + paddingX * 2; // Total width
		const h = th + paddingTop + paddingBottom; // Total height

		const bumpPath = [
			`q ${br},0 ${br},${-br}`,
			`q 0,${-br} ${br},${-br}`,

			`l ${bw},0`,

			`q ${br},0 ${br},${br}`,
			`q 0,${br} ${br},${br}`
		];

		const bumpPath2 = [
			`q ${-br},0 ${-br},${-br}`,
			`q 0,${-br} ${-br},${-br}`,
			`l ${-bw},0`,
			`q ${-br},0 ${-br},${br}`,
			`q 0,${br} ${-br},${br}`
		];
		const path = [
			// Just before the first top left radius
			`M 0,${r + br * 2}`,

			// Top left radius
			`q 0,${-r} ${r},${-r}`,

			`l ${o},0`,

			// Top bump
			...bumpPath,

			// Just before top right radius
			`L ${w - r},${br * 2}`,

			`q ${r},0 ${r},${r}`,

			// Just before bottom right radius
			`L ${w},${h - r}`,

			`q 0,${r} ${-r},${r}`,

			// Bottom middle-left (before hole)
			`L ${pw + r + o + br * 4 + bw},${h}`,

			...bumpPath2,
			// Hole
			...(!IS_PARENT
				? [
						// Teleport to bottom left (after bump, before radius) & do radius
						`L ${r},${h}`
					]
				: [
						// Go left
						`l ${-o},0`,
						`q ${-r},0 ${-r},${r}`,

						// Go down
						`l 0,${th}`,
						`q 0,${r} ${r},${r}`,

						// Go right
						`l ${o},0`,
						...bumpPath,
						`L ${w - r},${h + r + th + r}`,
						`q ${r},0 ${r},${r}`,

						// Go downleft
						`q 0,${r} ${-r},${r}`,

						`L ${r + br * 4 + bw + o},${h + th + r + r + r + r}`,
						...bumpPath2,
						`L ${r},${h + th + r * 4}`
					]),
			`q ${-r},0 ${-r},${-r}`,
			`Z`
		]
			.join("\n")
			.replace(/\s+/g, " ");

		el.style.paddingLeft = `${paddingX}px`;
		el.style.paddingRight = `${paddingX}px`;
		el.style.paddingTop = `${paddingTop}px`;
		el.style.paddingBottom = `${paddingBottom}px`;
		el.style.clipPath = `path("${path}")`;
	}, []);

	return (
		<div
			ref={(element) => {
				blockRef.current = element;
			}}
			className={`
				relative w-fit select-none cursor-pointer
        text-white ${colors[data.color]}
				duration-75 hover:translate-x-1
				${IS_PARENT && "h-72"}`}
		>
			<div ref={blockTextRef} className="leading-3.5">
				{data.text}
			</div>
		</div>
	);
}

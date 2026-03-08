import { type RefObject, useLayoutEffect } from "react";

function remToPx(rem: number) {
	return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function useClipLayoutEffect(
	blockRef: RefObject<HTMLDivElement | null>,
	blockTextRef: RefObject<HTMLDivElement | null>,
	isParent = false
) {
	return useLayoutEffect(() => {
		const el = blockRef.current;
		const el2 = blockTextRef.current;
		if (!el) return;
		if (!el2) return;
		const {
			width: txtw, // Text Width
			height: txth // Text Height
		} = el2.getBoundingClientRect();

		const r = remToPx(0.5), // Main Radius
			br = remToPx(0.1), // Bump radius
			bo = remToPx(0.4), // Bump offset
			bw = remToPx(0.3), // Bump width
			pw = remToPx(isParent ? 0.7 : 0); // Parent with

		const paddingX = r;
		const paddingTop = r;
		const paddingBottom = r;

		const w = txtw + paddingX * 2; // Total width
		const h = txth + paddingTop + paddingBottom; // Total height

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

			`l ${bo},0`,

			// Top bump
			...bumpPath,

			// Just before top right radius
			`L ${w - r},${br * 2}`,

			`q ${r},0 ${r},${r}`,

			// Just before bottom right radius
			`L ${w},${h - r}`,

			`q 0,${r} ${-r},${r}`,

			// Bottom middle-left (before hole)
			`L ${pw + r + bo + br * 4 + bw},${h}`,

			...bumpPath2,
			// Hole
			...(!isParent
				? [
						// Teleport to bottom left (after bump, before radius) & do radius
						`L ${r},${h}`
					]
				: [
						// Go left
						`l ${-bo},0`,
						`q ${-r},0 ${-r},${r}`,

						// Go down
						`l 0,${txth / 2 - br * 2}`,
						`q 0,${r} ${r},${r}`,

						// Go right
						`l ${bo},0`,
						...bumpPath,
						`L ${w - r},${h + r + txth / 2 + r - br * 2}`,
						`q ${r},0 ${r},${r}`,

						// Go downleft
						`q 0,${r} ${-r},${r}`,

						`L ${r + br * 4 + bw + bo},${h + txth / 2 + r * 4 - br * 2}`,
						...bumpPath2,
						`L ${r},${h + txth / 2 + r * 4 - br * 2}`
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
}

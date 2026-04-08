import { type PropsWithChildren, useRef } from "react";
import { bgClassNames, R, Rpx } from "./const";

export type BlockProps = PropsWithChildren & {
	id: string;
	text: string;
	color: keyof typeof bgClassNames;
};

export function Block(data: BlockProps) {
	const topPart = useRef<HTMLDivElement>(null),
		bottomPart = useRef<HTMLDivElement>(null),
		leftPart = useRef<HTMLDivElement>(null);

	const bg = bgClassNames[data.color];
	return (
		<div className={`w-fit p-1 flex flex-col **:leading-4`}>
			{/* ⬜ Top Part */}
			<div
				ref={topPart}
				className={`${bg} px-2 py-1 w-fit`}
				style={{ borderRadius: `${R}rem ${R}rem ${R}rem 0` }}
			>
				{data.text}
			</div>
			{/* Middle Part */}
			<div className="flex">
				{/* ⬜ Left Part */}
				<div ref={leftPart} className={`${bg} w-2`} />
				{/* ⬜ Top & Bottom absolute nubs */}
				<div className="relative">
					{[
						{ pos: "top-0", path: `M ${Rpx},0 Q0,0 0,${Rpx} L0,0 Z` },
						{ pos: "bottom-0", path: `M 0,0 Q 0,${Rpx} ${Rpx},${Rpx} L 0,${Rpx} Z` }
					].map(({ pos, path }) => (
						<BlockNub
							key={pos}
							className={`absolute left-0 ${pos} ${bg}`}
							clipPath={`path("${path}")`}
							{...{ size: Rpx }}
						/>
					))}
					{/* Children */}
					<div className="w-0 overflow-x-visible size-5"></div>
				</div>
			</div>
			{/* ⬜ Bottom Part */}
			<div
				ref={bottomPart}
				className={`${bg} w-full h-3`}
				style={{ borderRadius: `0 ${R}rem ${R}rem ${R}rem` }}
			/>
		</div>
	);
}

function BlockNub({
	clipPath,
	className,
	size
}: {
	clipPath: string;
	className: string;
	size: number;
}) {
	return <div {...{ className }} style={{ width: size, height: size, clipPath }} />;
}

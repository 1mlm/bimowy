import type { PropsWithChildren } from "react";
import { cn } from "@/shadcn/utils";
import { R, variants } from "./const";

export type BlockProps = PropsWithChildren & {
	id: string;
	text: string;
	color: keyof typeof variants;
	childrenGroups?: { id: string; children: BlockProps[] }[];
};

export function Block(data: BlockProps) {
	const { bgClass } = variants[data.color];
	const isParent = !!data.childrenGroups?.length;

	return (
		<div
			className={`w-fit flex flex-col **:leading-4
		duration-75 cursor-pointer hover:translate-x-1`}
		>
			{/* ⬜ Top Part */}
			<div
				className={`${bgClass} flex items-center justify-center h-6 px-2 select-none text-nowrap`}
				style={{ borderRadius: [R,R,R,isParent ? 0 : R].map((r) => `${r}rem`).join(' ') }}
			>
				{data.text}
			</div>
			{data.childrenGroups?.map((grp, i, arr) => {
				const isLastChildrenGroup = i === arr.length - 1;
				return (
					<div key={grp.id}>
						{/* Middle Part */}
						<div className="flex">
							{/* ⬜ Left Part */}
							<div className={`${bgClass} w-2`} />
							<div className="relative">
								<BlockNubs {...{ bgClass }} />
								{/* Children */}
								<div className="w-0 overflow-x-visible">
									{grp.children.map((child) => (
										<Block key={child.id} {...child} />
									))}
								</div>
							</div>
						</div>

						{/* ⬜ Bottom Part */}
						<div
							className={`${bgClass} w-11/12 h-3`}
							style={{ borderRadius: [0,R,R,isLastChildrenGroup ? R : 0].map((r) => `${r}rem`).join(' ') }}
						/>
					</div>
				);
			})}
		</div>
	);
}

const Rpx = remToPx(R);

function remToPx(rem: number) {
	return rem * 19; // Assuming the root font size is 16px
}

function BlockNubs({ bgClass }: { bgClass: string }) {
	return [
		{ pos: "top-0", className: "corner-br-scoop -translate-y-1/2", },
		{ pos: "bottom-0", className: "corner-tr-scoop translate-y-1/2" }
	].map(({ pos, className }) => (
		<BlockNub
			key={pos}
			className={cn(`absolute left-0 -translate-x-1/2  rounded-full`, pos, bgClass, className)}
			{...{ size: Rpx*2 }}
		/>
	));
}

function BlockNub({
	className,
	size
}: {
	className: string;
	size: number;
}) {
	return <div {...{ className }} style={{ width: size, height: size }} />;
}

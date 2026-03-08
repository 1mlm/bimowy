import { useDraggable } from "@dnd-kit/react";
import { useRef } from "react";

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
	const blockRef = useRef<HTMLDivElement>(null),
		blockTextRef = useRef<HTMLDivElement>(null),
		{ ref: dragRef } = useDraggable({ id: data.id }),
		isParent = data.children !== undefined;

	// useClipLayoutEffect(blockRef, blockTextRef, isParent);

	return (
		<div
			ref={(element) => {
				blockRef.current = element;
				dragRef(element);
			}}
			className={`
				relative w-fit select-none cursor-pointer
        text-white ${colors[data.color]}
				duration-75 hover:translate-x-1
				${isParent && "h-20"}`}
		>
			<div ref={blockTextRef} className="leading-3.5">
				{data.text}
			</div>
		</div>
	);
}

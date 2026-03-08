"use client";

import { Block, type BlockProps } from "./Block";

const blocks: BlockProps[] = [
	{ id: "attack", color: "red", text: "Attack" },
	{ id: "turn-r", color: "purple", text: "Turn right" },
	{
		id: "walk",
		color: "blue",
		text: "Walk 10 pixels"
	},
	{
		id: "repeat",
		color: "yellow",
		text: "Repeat 3 times",
		children: []
	},
	{
		id: "if",
		color: "green",
		text: "If touched grass",
		children: [
			{ id: "cheer", color: "yellow", text: "Cheer" },
			{ id: "turn-l", color: "purple", text: "Turn left" }
		]
	}
];

export default function TestPage() {
	return (
		<div className="p-4 flex flex-col gap-1">
			{blocks.map((data) => (
				<Block key={data.id} {...{ data }} />
			))}
		</div>
	);
}

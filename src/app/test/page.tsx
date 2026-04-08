"use client";

import { Block, type BlockProps } from "./Block";

const blocks: BlockProps[] = [
	{ id: "attack", color: "red", text: "Delete folder" },
	{ id: "turn-r", color: "purple", text: "Start screen recording" },
	{
		id: "walk",
		color: "blue",
		text: "Open file"
	},
	{
		id: "repeat",
		color: "yellow",
		text: "Repeat 5 times",
		children: []
	},
	{
		id: "if",
		color: "green",
		text: "if 1 + 1 == 2",
		childrenGroups: [
			{
				id: "yes",
				children: [
					{
						id: "print",
						color: "blue",
						text: "Scream \"Math works!\""
					},
					{
						id: "thx",
						color: "blue",
						text: "Be thankful"
					}
				]
			},
			{
				id: "no",
				children: [
					{
						id: "wtf",
						color: "red",
						text: "Question reality"
					},
					{
						id: "wtf2",
						color: "red",
						text: "Question the concept of existence"
					}
				]
			}
		]
	}
];

export default function TestPage() {
	return (
		<div className="p-4 flex flex-col gap-1">
			{blocks.map((data) => (
				<Block key={data.id} {...data} />
			))}
		</div>
	);
}

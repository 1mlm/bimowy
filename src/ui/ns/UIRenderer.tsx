"use client";

import { Fragment } from "react";
import { useExerciseStore } from "@/context/ExerciseContext";
import { NumberInput } from "@/ui/shared/NumberInput";
import { type WidgetId, WidgetsRegistry } from "@/ui/widgets";

function isUIInput(node: unknown): node is { _nstype: "ui-input"; id: string } {
	return (
		typeof node === "object" &&
		node !== null &&
		(node as Record<string, unknown>)._nstype === "ui-input" &&
		typeof (node as Record<string, unknown>).id === "string"
	);
}

function isWidget(node: unknown): node is { id: WidgetId; args: unknown } {
	if (typeof node !== "object" || node === null) return false;
	const obj = node as Record<string, unknown>;
	return typeof obj.id === "string" && obj.id in WidgetsRegistry && !("_nstype" in obj);
}

function UIInputNode({ id }: { id: string }) {
	const value = useExerciseStore((s) => s.inputs[id]);
	const inputGeneration = useExerciseStore((s) => s.inputGeneration);
	const correction = useExerciseStore((s) => s.correction);
	const status = useExerciseStore((s) => s.status);
	const setInput = useExerciseStore((s) => s.setInput);

	const inputCorrection = correction?.[id];
	const isWrong = status === "wrong" && inputCorrection && !inputCorrection.is_correct;
	const isCorrect = status === "correct";

	return (
		<NumberInput
			key={`${id}-${inputGeneration}`}
			allowEmpty
			defaultValue={value}
			disabled={isCorrect}
			onNewValue={(v) => setInput(id, v)}
			className={
				isWrong
					? "ring-red-500/60! ring-2! animate-[shake_0.35s_ease-in-out]"
					: isCorrect
						? "ring-green-500/40! ring-2! opacity-70"
						: ""
			}
		/>
	);
}

function WidgetNode({ id, args }: { id: WidgetId; args: unknown }) {
	const Widget = WidgetsRegistry[id];
	return (
		<div className="w-full rounded-xl overflow-hidden">
			{/* biome-ignore lint/suspicious/noExplicitAny: widget args are unknown at compile time */}
			<Widget {...(args as any)} />
		</div>
	);
}

export function UIRenderer({ node }: { node: unknown }) {
	if (node === null || node === undefined) return null;

	if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") {
		return <span className="text-[1em]">{String(node)}</span>;
	}

	if (Array.isArray(node)) {
		return (
			<p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-3xl leading-relaxed">
				{node.map((item, i) => (
					<Fragment key={i}>
						<UIRenderer node={item} />
					</Fragment>
				))}
			</p>
		);
	}

	if (isUIInput(node)) {
		return <UIInputNode id={node.id} />;
	}

	if (isWidget(node)) {
		return <WidgetNode id={node.id} args={node.args} />;
	}

	return null;
}

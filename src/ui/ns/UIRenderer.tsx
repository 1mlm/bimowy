"use client";

import { Fragment } from "react";
import { useExerciseStore } from "@/context/ExerciseContext";
import { NumberInput } from "@/ui/shared/NumberInput";
import { type WidgetId, WidgetsRegistry } from "@/ui/widgets";

type ChoiceOption = { label?: string; value: unknown };

function isUIInput(node: unknown): node is { _nstype: "ui-input"; id: string } {
	return (
		typeof node === "object" &&
		node !== null &&
		(node as Record<string, unknown>)._nstype === "ui-input" &&
		typeof (node as Record<string, unknown>).id === "string"
	);
}

function isUIInputChoice(
	node: unknown
): node is { _nstype: "ui-input-choice"; id: string; options: ChoiceOption[] } {
	if (typeof node !== "object" || node === null) return false;
	const obj = node as Record<string, unknown>;
	return obj._nstype === "ui-input-choice" && typeof obj.id === "string" && Array.isArray(obj.options);
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
	const isCorrect = status === "correct";
	const numValue = typeof value === "number" ? value : undefined;
	const showingAnswer = status === "wrong" && inputCorrection && !inputCorrection.is_correct && numValue === inputCorrection.value;
	const isWrong = status === "wrong" && inputCorrection && !inputCorrection.is_correct && !showingAnswer;

	return (
		<NumberInput
			key={`${id}-${inputGeneration}`}
			allowEmpty
			defaultValue={numValue}
			disabled={isCorrect || showingAnswer}
			onNewValue={(v) => setInput(id, v)}
			className={
				isWrong
					? "ring-red-500/60! ring-2! animate-[shake_0.35s_ease-in-out]"
					: showingAnswer
						? "ring-amber-400/50! ring-2! opacity-70"
						: isCorrect
							? "ring-green-500/40! ring-2! opacity-70"
							: ""
			}
		/>
	);
}

function UIInputChoiceNode({ id, options }: { id: string; options: ChoiceOption[] }) {
	const value = useExerciseStore((s) => s.inputs[id]);
	const inputGeneration = useExerciseStore((s) => s.inputGeneration);
	const correction = useExerciseStore((s) => s.correction);
	const status = useExerciseStore((s) => s.status);
	const setInput = useExerciseStore((s) => s.setInput);

	const inputCorrection = correction?.[id];
	const isCorrect = status === "correct";
	const isSubmitted = status === "wrong" || status === "correct";

	return (
		<div key={`${id}-${inputGeneration}`} className="grid grid-cols-2 gap-2 w-full max-w-sm">
			{options.map((opt) => {
				const selected = value === opt.value;
				const optCorrect = isSubmitted && inputCorrection && opt.value === inputCorrection.value;
				const optWrong = isSubmitted && selected && !optCorrect && inputCorrection && !inputCorrection.is_correct;

				return (
					<button
						key={String(opt.value)}
						type="button"
						disabled={isCorrect}
						onClick={() => setInput(id, opt.value)}
						className={[
							"rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-100",
							selected && !isSubmitted ? "border-white/40 bg-white/10" : "",
							optCorrect ? "border-green-500/60 bg-green-500/10 text-green-400" : "",
							optWrong ? "border-red-500/60 bg-red-500/10 text-red-400" : "",
							!selected && !optCorrect ? "border-white/10 bg-white/5 opacity-60 hover:opacity-100 hover:border-white/20" : ""
						].join(" ")}
					>
						{opt.label ?? String(opt.value)}
					</button>
				);
			})}
		</div>
	);
}

function WidgetNode({ id, args }: { id: WidgetId; args: unknown }) {
	const Widget = WidgetsRegistry[id];
	// biome-ignore lint/suspicious/noExplicitAny: widget args are unknown at compile time
	return <Widget {...(args as any)} />;
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

	if (isUIInput(node)) return <UIInputNode id={node.id} />;
	if (isUIInputChoice(node)) return <UIInputChoiceNode id={node.id} options={node.options} />;
	if (isWidget(node)) return <WidgetNode id={node.id} args={node.args} />;

	return null;
}

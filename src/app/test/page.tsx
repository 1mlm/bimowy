"use client";

import { CheckCheckIcon, EyeIcon, RefreshCwIcon, TargetIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/ui/shared/button";
import { NumberInput } from "@/ui/shared/NumberInput";

// ─── Fake data ────────────────────────────────────────────────────────────────

const FAKE_EXERCISE = {
	title: "Addition",
	desc: "Practice adding two numbers together.",
	a: 7,
	b: 3,
	answer: 10
};

// ─── Layout variants to iterate on ───────────────────────────────────────────

type Status = "idle" | "wrong" | "correct";

export default function TestPage() {
	const [status, setStatus] = useState<Status>("idle");
	const [input, setInput] = useState<number | undefined>(undefined);
	const [showAnswer, setShowAnswer] = useState(false);

	function handleSubmit() {
		if (input === FAKE_EXERCISE.answer) setStatus("correct");
		else setStatus("wrong");
	}

	function handleNext() {
		setStatus("idle");
		setInput(undefined);
		setShowAnswer(false);
	}

	return (
		<div className="flex flex-col h-full gap-3 max-w-5xl mx-auto w-full">
			{/* Resource header */}
			<div className="flex flex-col gap-0.5 px-2">
				<h1 className="text-2xl font-bold inline-flex items-center gap-2">
					<TargetIcon className="size-[0.85em] stroke-2" />
					{FAKE_EXERCISE.title}
				</h1>
				<p className="text-sm opacity-60">{FAKE_EXERCISE.desc}</p>
			</div>

			{/* Main exercise card */}
			<div className="flex-1 bg-white/5 rounded-2xl border overflow-hidden flex">
				{/* Exercise content */}
				<div className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
					<p
						className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-4xl leading-relaxed font-medium transition-all duration-150 ${status === "wrong" ? "animate-[shake_0.35s_ease-in-out]" : ""}`}
					>
						<span>The sum of</span>
						<span className="opacity-80">{FAKE_EXERCISE.a}</span>
						<span>and</span>
						<span className="opacity-80">{FAKE_EXERCISE.b}</span>
						<span>is</span>
						<NumberInput
							allowEmpty
							defaultValue={showAnswer ? FAKE_EXERCISE.answer : input}
							disabled={status === "correct" || showAnswer}
							onNewValue={setInput}
							className={
								status === "wrong"
									? "ring-red-500/60! ring-2!"
									: status === "correct"
										? "ring-green-500/40! ring-2! opacity-70"
										: ""
							}
						/>
					</p>

					{status === "correct" && (
						<p className="text-green-400 text-sm font-semibold tracking-wide animate-in fade-in slide-in-from-bottom-2">
							Correct! 🎉
						</p>
					)}
				</div>

				{/* Right sidebar */}
				<aside className="flex flex-col justify-between py-4 pr-3 pl-2 w-44 shrink-0 border-l border-white/5">
					{/* Top info */}
					<div className="flex flex-col gap-2">
						<div className="text-[10px] uppercase tracking-widest opacity-30 font-semibold">
							Exercise
						</div>
						<div className="text-xs font-mono opacity-50">
							{status === "idle" && "Ongoing"}
							{status === "wrong" && <span className="text-red-400">Incorrect</span>}
							{status === "correct" && <span className="text-green-400">Correct</span>}
						</div>
					</div>

					{/* Bottom buttons */}
					<div className="flex flex-col gap-2">
						{status === "correct" ? (
							<Button onClick={handleNext} className="gap-2 w-full">
								<RefreshCwIcon className="size-4 stroke-2" />
								Next
							</Button>
						) : (
							<Button
								onClick={handleSubmit}
								disabled={input === undefined && !showAnswer}
								className="gap-2 w-full"
							>
								<CheckCheckIcon className="size-4 stroke-2" />
								Submit
							</Button>
						)}
						<Button
							variant="secondary"
							onClick={() => {
								setShowAnswer(true);
								setStatus("wrong");
							}}
							disabled={status === "correct" || showAnswer}
							className="gap-2 w-full"
						>
							<EyeIcon className="size-4 stroke-2" />
							Show Answer
						</Button>
					</div>
				</aside>
			</div>
		</div>
	);
}

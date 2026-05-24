"use client";

import { CheckCheckIcon, EyeIcon, RefreshCwIcon } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { ExerciseProvider, useExerciseStore } from "@/context/ExerciseContext";
import { RootUIRenderer } from "@/ui/ns/RootUIRenderer";
import { Button } from "@/ui/shared/button";

type Props = {
	typeHandle: string;
	handle: string;
};

async function fetchSeed(typeHandle: string, handle: string) {
	const res = await fetch("/api/exercise/seed", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ type_handle: typeHandle, handle })
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json() as Promise<{ seed: unknown; ui: unknown[] }>;
}

async function fetchCorrection(
	typeHandle: string,
	handle: string,
	seed: unknown,
	inputs: Record<string, unknown>
) {
	const res = await fetch("/api/exercise/correct", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ type_handle: typeHandle, handle, seed, inputs })
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json() as Promise<{ result: Record<string, { is_correct: boolean; value?: unknown }> }>;
}

export function ExerciseClient({ typeHandle, handle }: Props) {
	return (
		<ExerciseProvider>
			<ExerciseInner typeHandle={typeHandle} handle={handle} />
		</ExerciseProvider>
	);
}

function ExerciseInner({ typeHandle, handle }: Props) {
	const ui = useExerciseStore((s) => s.ui);
	const status = useExerciseStore((s) => s.status);
	const seed = useExerciseStore((s) => s.seed);
	const inputs = useExerciseStore((s) => s.inputs);
	const streak = useExerciseStore((s) => s.streak);
	const setSeed = useExerciseStore((s) => s.setSeed);
	const setStatus = useExerciseStore((s) => s.setStatus);
	const setCorrection = useExerciseStore((s) => s.setCorrection);
	const setInputsAndBump = useExerciseStore((s) => s.setInputsAndBump);
	const resetForNewProblem = useExerciseStore((s) => s.resetForNewProblem);

	const loadNewSeed = useCallback(async () => {
		setStatus("loading");
		try {
			const { seed: newSeed, ui: newUi } = await fetchSeed(typeHandle, handle);
			setSeed(newSeed, newUi);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to load exercise.");
			setStatus("idle");
		}
	}, [typeHandle, handle, setSeed, setStatus]);

	useEffect(() => {
		loadNewSeed();
	}, [loadNewSeed]);

	const actionRef = useRef<() => void>(() => {});
	actionRef.current = status === "correct" ? handleNext : status !== "loading" ? handleSubmit : () => {};
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => { if (e.key === "Enter") actionRef.current(); };
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	async function handleSubmit() {
		if (status === "loading" || status === "correct") return;
		const filledInputs: Record<string, unknown> = {};
		for (const [id, val] of Object.entries(inputs)) {
			filledInputs[id] = val;
		}
		setStatus("loading");
		try {
			const { result } = await fetchCorrection(typeHandle, handle, seed, filledInputs);
			setCorrection(result);
			const allCorrect = Object.values(result).every((r) => r.is_correct);
			setStatus(allCorrect ? "correct" : "wrong");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Correction failed.");
			setStatus("idle");
		}
	}

	async function handleShowAnswer() {
		if (status === "loading") return;
		setStatus("loading");
		try {
			const { result } = await fetchCorrection(typeHandle, handle, seed, {});
			const answerInputs: Record<string, unknown> = {};
			for (const [id, val] of Object.entries(result)) {
				if (val.value !== undefined) answerInputs[id] = val.value;
			}
			setCorrection(result);
			setInputsAndBump(answerInputs);
			setStatus("wrong");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not retrieve answer.");
			setStatus("idle");
		}
	}

	async function handleNext() {
		setStatus("loading");
		try {
			const { seed: newSeed, ui: newUi } = await fetchSeed(typeHandle, handle);
			resetForNewProblem(newSeed, newUi, status === "correct");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to load next problem.");
			setStatus("correct");
		}
	}

	const isLoading = status === "loading";
	const isCorrect = status === "correct";
	const isWrong = status === "wrong";

	return (
		<div className="flex h-full">
			<div className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
				{isLoading && ui.length === 0 ? (
					<div className="opacity-30 text-sm animate-pulse">Loading…</div>
				) : (
					<RootUIRenderer nodes={ui} />
				)}
				{isCorrect && (
					<p className="text-green-400 text-sm font-semibold tracking-wide animate-in fade-in slide-in-from-bottom-2">
						Correct! 🎉
					</p>
				)}
			</div>

			<aside className="flex flex-col justify-between py-4 pr-3 pl-2 w-44 shrink-0 border-l border-white/5">
				<div className="flex flex-col gap-2">
					<div className="text-[10px] uppercase tracking-widest opacity-30 font-semibold">
						Exercise
					</div>
					<div className="text-xs font-mono opacity-50">
						{(status === "idle" || isLoading) && "Ongoing"}
						{isWrong && <span className="text-red-400">Incorrect</span>}
						{isCorrect && <span className="text-green-400">Correct</span>}
					</div>
					{streak > 0 && (
						<div className="text-xs font-mono text-amber-400">
							{streak} 🔥
						</div>
					)}
				</div>
				<div className="flex flex-col gap-2">
					{isCorrect ? (
						<Button onClick={handleNext} className="gap-2">
							<RefreshCwIcon className="size-4 stroke-2" />
							Next
						</Button>
					) : (
						<Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
							<CheckCheckIcon className="size-4 stroke-2" />
							{isLoading ? "…" : "Submit"}
						</Button>
					)}
					<Button
						variant="secondary"
						onClick={handleShowAnswer}
						disabled={isLoading || isCorrect}
						className="gap-2"
					>
						<EyeIcon className="size-4 stroke-2" />
						Show Answer
					</Button>
				</div>
			</aside>
		</div>
	);
}

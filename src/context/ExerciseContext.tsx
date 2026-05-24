"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { createStore, useStore } from "zustand";
import type { CorrectionResult } from "@/ns/resource-types/exercise-template";

export type ExerciseStatus = "idle" | "loading" | "submitted" | "correct" | "wrong";

type ExerciseStore = {
	seed: unknown;
	ui: unknown[];
	inputs: Record<string, unknown>;
	inputGeneration: number;
	status: ExerciseStatus;
	correction: CorrectionResult | null;
	globalVars: Record<string, unknown>;
	setSeed: (seed: unknown, ui: unknown[]) => void;
	setInput: (id: string, value: unknown) => void;
	setInputsAndBump: (inputs: Record<string, unknown>) => void;
	setGlobalVar: (id: string, value: unknown) => void;
	setStatus: (status: ExerciseStatus) => void;
	setCorrection: (correction: CorrectionResult | null) => void;
	resetForNewProblem: (seed: unknown, ui: unknown[]) => void;
};

function createExerciseStore() {
	return createStore<ExerciseStore>((set) => ({
		seed: null,
		ui: [],
		inputs: {},
		inputGeneration: 0,
		status: "idle",
		correction: null,
		globalVars: {},
		setSeed: (seed, ui) =>
			set((s) => ({ seed, ui, inputs: {}, inputGeneration: s.inputGeneration + 1, status: "idle", correction: null })),
		setInput: (id, value) => set((s) => ({ inputs: { ...s.inputs, [id]: value } })),
		setInputsAndBump: (inputs) =>
			set((s) => ({ inputs, inputGeneration: s.inputGeneration + 1 })),
		setGlobalVar: (id, value) => set((s) => ({ globalVars: { ...s.globalVars, [id]: value } })),
		setStatus: (status) => set({ status }),
		setCorrection: (correction) => set({ correction }),
		resetForNewProblem: (seed, ui) =>
			set((s) => ({ seed, ui, inputs: {}, inputGeneration: s.inputGeneration + 1, status: "idle", correction: null }))
	}));
}

type ExerciseStoreApi = ReturnType<typeof createExerciseStore>;
const ExerciseStoreContext = createContext<ExerciseStoreApi | null>(null);

export function ExerciseProvider({ children }: { children: ReactNode }) {
	const store = useRef(createExerciseStore()).current;
	return <ExerciseStoreContext.Provider value={store}>{children}</ExerciseStoreContext.Provider>;
}

export function useExerciseStore<T>(selector: (state: ExerciseStore) => T): T {
	const store = useContext(ExerciseStoreContext);
	if (!store) throw new Error("useExerciseStore must be inside ExerciseProvider");
	return useStore(store, selector);
}

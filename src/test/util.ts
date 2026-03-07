import assert from "node:assert";
import { suite, test } from "node:test";

export type PassCase<T = unknown> = {
	name?: string;
	actual: () => T;
	expected: T;
};

export type ThrowCase = {
	name?: string;
	actual: () => unknown;
	shouldThrow: true;
};

export type TestCase = PassCase | ThrowCase;

function isThrowCase(testCase: TestCase): testCase is ThrowCase {
	return "shouldThrow" in testCase && testCase.shouldThrow;
}

export function $group(name: string, testCases: TestCase[]) {
	suite(name, () => {
		for (const [i, testCase] of testCases.entries()) {
			if (isThrowCase(testCase)) {
				const testName = [i, "❇️ ", testCase.name].filter((v) => !!v).join(" ");
				test(testName, () => assert.throws(() => testCase.actual()));
				continue;
			}
			const testName = [i, testCase.name].filter((v) => !!v).join(" ");
			test(testName, () => assert.deepStrictEqual(testCase.actual(), testCase.expected));
		}
	});
}

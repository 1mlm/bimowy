import assert from "node:assert";
import test, { suite } from "node:test";
import "./execute-ns.test";
import "./exercise-template.test";
import "./subset-helper.test";
import "./subset.test";

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

export type TestCaseGroup = {
	name: string;
	items: TestCase[];
};

export type TestItem = TestCase | TestCaseGroup;

function isThrowCase(item: TestItem): item is ThrowCase {
	return "shouldThrow" in item && item.shouldThrow;
}

function isTestCaseGroup(item: TestItem): item is TestCaseGroup {
	return "items" in item;
}

export function $group(name: string, items: TestItem[]) {
	suite(name, () => {
		for (const [i, item] of items.entries()) {
			if (isThrowCase(item)) {
				test(`${i}`, () => assert.throws(() => item.actual()));
			} else if (isTestCaseGroup(item)) {
				$group(`${i} ${item.name}`, item.items);
			} else {
				test(`${i}`, () => assert.deepStrictEqual(item.actual(), item.expected));
			}
		}
	});
}

import assert from "node:assert/strict";
import test from "node:test";
import { fetchResourceData, fetchResourceView, fetchResourceViews } from "@/app/api/util";
import { V2_FAKE_EXERCISES } from "@/fake/exercises";
import { seedFakeData } from "@/fake/seed";
import { correct, getInputIds } from "@/ns/resource-types/exercise-template";

test("v2 api seeds coherent resources", async () => {
	await seedFakeData();
	const resources = await fetchResourceViews();
	assert.equal(resources.length, V2_FAKE_EXERCISES.length);
	assert.deepEqual(
		resources.map((resource) => resource.handle).sort(),
		V2_FAKE_EXERCISES.map((exercise) => exercise.handle).sort()
	);
});

test("v2 api can fetch a resource", async () => {
	await seedFakeData();
	const addition = V2_FAKE_EXERCISES.find((exercise) => exercise.handle === "addition");
	assert.ok(addition);

	const resource = await fetchResourceView(addition.handle);
	assert.ok(resource);
	assert.equal(resource.title, addition.title);
	assert.equal(resource.description, addition.desc);
});

test("v2 api correction falls back to solution plan", async () => {
	await seedFakeData();
	for (const exercise of V2_FAKE_EXERCISES) {
		const resource = await fetchResourceData(exercise.handle);
		assert.ok(resource);

		const inputIds = getInputIds(resource, exercise.data.exampleSeed);
		assert.deepEqual(inputIds, ["answer"]);

		const ok = correct(resource, exercise.data.exampleSeed, {
			answer: exercise.data.exampleAnswer
		});
		assert.equal(ok.answer.is_correct, true);
	}

	const addition = V2_FAKE_EXERCISES.find((exercise) => exercise.handle === "addition");
	assert.ok(addition);
	const additionResource = await fetchResourceData(addition.handle);
	assert.ok(additionResource);

	const additionNo = correct(additionResource, addition.data.exampleSeed, {
		answer: Number(addition.data.exampleAnswer) + 1
	});
	assert.equal(additionNo.answer.is_correct, false);
});

import { prisma } from "@/db/client";
import { echo } from "@/utils/echo";
import { FAKE_RESOURCES } from "./data/resources";
import { FAKE_TAGS } from "./data/tags";

export async function deleteFakeData() {
	echo("⏳", "Deleting fake data...");
	await prisma.resource.deleteMany();
	await prisma.tag.deleteMany();
	echo("✅", "Fake data deleted.");
}

export async function populateFakeData() {
	echo("⏳", "Populating fake data...");
	echo("\t⏳", "Tags...");
	const tagResult = await prisma.tag.createManyAndReturn({ data: FAKE_TAGS });
	echo("\t✅", `Created ${tagResult.length} tags.`);
	echo("\t⏳", "Resources...");
	let count = 0;
	for (const resource of FAKE_RESOURCES) {
		await prisma.resource.create({ data: resource });
		count++;
	}
	echo("\t✅", `Created ${count} resources.`);
	echo("✅", "Fake data population complete.");
}

export async function seedFakeData() {
	await deleteFakeData();
	await populateFakeData();
}

seedFakeData();

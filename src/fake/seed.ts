import { prisma } from "@/db";
import { ResourceType } from "@/db/prisma-generated/enums";
import { V2_FAKE_EXERCISES } from "./exercises";
import { V2_FAKE_TAGS } from "./tags";

export async function seedFakeData() {
	await prisma.resource.deleteMany({
		where: { type: ResourceType.TEMPLATE_EXERCISE }
	});

	for (const tag of V2_FAKE_TAGS) {
		await prisma.tag.upsert({
			where: { handle: tag.handle },
			create: tag,
			update: tag
		});
	}

	for (const exercise of V2_FAKE_EXERCISES) {
		await prisma.resource.create({
			data: {
				type: ResourceType.TEMPLATE_EXERCISE,
				title: exercise.title,
				aliases: exercise.aliases,
				handle: exercise.handle,
				beta: exercise.beta,
				desc: exercise.desc,
				visibility: "PUBLIC",
				data: exercise.data,
				tags: {
					connect: exercise.tags.map((handle) => ({ handle }))
				}
			}
		});
	}

	return prisma.resource.findMany({
		where: { type: ResourceType.TEMPLATE_EXERCISE },
		include: { tags: true },
		orderBy: { title: "asc" }
	});
}

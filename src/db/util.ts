import { prisma } from "@/db";
import { ResourceType } from "@/db/prisma-generated/enums";

export async function fetchResources() {
	return prisma.resource.findMany({
		where: { type: ResourceType.TEMPLATE_EXERCISE },
		include: { tags: true },
		orderBy: { title: "asc" }
	});
}

export async function fetchResource(handle: string) {
	return prisma.resource.findUnique({
		where: {
			handle_type: {
				handle,
				type: ResourceType.TEMPLATE_EXERCISE
			}
		},
		include: { tags: true }
	});
}

import { prisma } from "@/db/client";
import type { ResourceType } from "./generated/enums";

export type FetchedResource = Awaited<ReturnType<typeof fetchResources>>[number];

export async function fetchResources() {
	return prisma.resource.findMany({
		include: { tags: true },
		orderBy: { updatedAt: "desc" }
	});
}

export async function fetchResource(type: ResourceType, id: string) {
	return prisma.resource.findFirst({
		where: { handle: id, type },
		include: { tags: true }
	});
}

export async function fetchResourceById(id: string) {
	return prisma.resource.findFirst({
		where: { handle: id },
		include: { tags: true }
	});
}

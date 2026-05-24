import { prisma } from "@/db/client";
import type { ResourceType } from "./generated/enums";

export type FetchedResource = Awaited<ReturnType<typeof fetchResources>>[number];

export async function fetchResources(tagHandle?: string) {
	return prisma.resource.findMany({
		include: { tags: true },
		orderBy: { updatedAt: "desc" },
		where: tagHandle ? { tags: { some: { handle: tagHandle } } } : undefined
	});
}

export async function fetchTags() {
	return prisma.tag.findMany({ orderBy: { handle: "asc" } });
}

export async function fetchResource(type: ResourceType, handle: string) {
	return prisma.resource.findUnique({
		where: { handle_type: { type, handle } },
		include: { tags: true }
	});
}

import { prisma } from "@/db/client";

export type FetchedResource = Awaited<ReturnType<typeof fetchResources>>[number];

export async function fetchResources() {
	return prisma.resource.findMany({
		include: { tags: true },
		orderBy: { updatedAt: "desc" }
	});
}

// export async function fetchResource(handle: string) {
// 	return prisma.resource.findUnique({
// 		where: { handle },
// 		include: { tags: true }
// 	});
// }

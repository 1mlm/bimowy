import { fetchResource, fetchResources } from "@/db/util";
import type { ExerciseTemplateResource } from "@/ns/resource-types/exercise-template";

type DbResourceWithTags = Awaited<ReturnType<typeof fetchResources>>[number];

function toExerciseTemplateResource(resource: DbResourceWithTags): ExerciseTemplateResource {
	return {
		id: resource.id,
		type: "exercise-template",
		title: resource.title,
		tags: resource.tags.map((tag) => tag.handle),
		aliases: resource.aliases,
		handle: resource.handle,
		beta: resource.beta,
		description: resource.desc,
		data: resource.data as ExerciseTemplateResource["data"]
	};
}

export type ResourceView = Omit<ExerciseTemplateResource, "tags"> & {
	visibility: DbResourceWithTags["visibility"];
	tags: {
		handle: string;
		name: string;
		aliases: string[];
	}[];
};

function toResourceView(resource: DbResourceWithTags): ResourceView {
	const exercise = toExerciseTemplateResource(resource);
	return {
		...exercise,
		visibility: resource.visibility,
		tags: resource.tags.map((tag) => ({
			handle: tag.handle,
			name: tag.name,
			aliases: tag.aliases
		}))
	};
}

export async function fetchResourceData(handle: string): Promise<ExerciseTemplateResource | null> {
	const resource = await fetchResource(handle);
	if (!resource) return null;
	return toExerciseTemplateResource(resource);
}

export async function fetchResourceView(handle: string): Promise<ResourceView | null> {
	const resource = await fetchResource(handle);
	if (!resource) return null;
	return toResourceView(resource);
}

export async function fetchResourceViews(): Promise<ResourceView[]> {
	const resources = await fetchResources();
	return resources.map(toResourceView);
}

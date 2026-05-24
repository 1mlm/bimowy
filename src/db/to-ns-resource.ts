import type { ExerciseTemplateResource } from "@/ns/resource-types/exercise-template";
import type { FetchedResource } from "./util";

export function toExerciseTemplateResource(resource: FetchedResource): ExerciseTemplateResource {
	return {
		id: resource.id,
		type: "exercise-template",
		title: resource.title,
		tags: resource.tags.map((t) => t.handle),
		handle: resource.handle,
		aliases: resource.aliases,
		beta: resource.beta ?? true,
		description: resource.desc,
		data: resource.data as ExerciseTemplateResource["data"]
	};
}

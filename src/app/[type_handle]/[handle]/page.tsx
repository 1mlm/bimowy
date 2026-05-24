import { fetchResource } from "@/db/util";
import { ExerciseClient } from "@/ui/exercise/ExerciseClient";
import { getResourceTypeFromHandle } from "@/utils";

type ResourcePageParams = Promise<{ handle: string; type_handle: string }>;

export default async function ResourcePage({ params }: { params: ResourcePageParams }) {
	const { handle, type_handle } = await params;

	const resource_type = getResourceTypeFromHandle(type_handle);
	if (!resource_type) throw new Error(`Could not find resource type with handle "${type_handle}"`);

	const label = resource_type.label.toLowerCase();
	const resource = await fetchResource(resource_type.type, handle);
	if (!resource) throw new Error(`No ${label} found for handle: ${handle}`);

	return (
		<div className="flex flex-col h-full gap-3">
			<div className="flex flex-col gap-0.5 px-2">
				<h1 className="text-2xl font-bold inline-flex items-center gap-2">
					<resource_type.icon className="size-[0.85em] stroke-2" /> {resource.title}
				</h1>
				{resource.desc && <p className="text-sm opacity-60">{resource.desc}</p>}
			</div>
			<div className="flex-1 bg-white/5 rounded-2xl border overflow-hidden">
				<ExerciseClient typeHandle={type_handle} handle={handle} />
			</div>
		</div>
	);
}

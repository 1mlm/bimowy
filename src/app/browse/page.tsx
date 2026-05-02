import { fetchResources } from "@/db/util";
import { ResourceCard } from "@/ui/cpn/ResourceCard";
import { MetaPage } from "@/ui/templates/MetaPage";

export default async function BrowsePage() {
	const resources = await fetchResources();

	if (!resources.length) {
		return <MetaPage title="No Resources Found" description="Or there's no resources to begin with lol" />;
	}

	console.log(resources);

	return (
		<div className="flex flex-wrap gap-4">
			{resources.map((r) => (
				<ResourceCard key={r.id} {...r} />
			))}
		</div>
	);
}

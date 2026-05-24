import { fetchResources, fetchTags } from "@/db/util";
import { ResourceCard } from "@/ui/cpn/resource-card/ResourceCard";
import { TagFilter } from "@/ui/cpn/TagFilter";
import { MetaPage } from "@/ui/templates/MetaPage";

type BrowsePageProps = { searchParams: Promise<{ tag?: string }> };

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
	const { tag } = await searchParams;
	const [resources, tags] = await Promise.all([
		fetchResources(tag),
		fetchTags()
	]);

	return (
		<div className="flex flex-col gap-6">
			<TagFilter tags={tags} activeTag={tag} />
			{resources.length === 0 ? (
				<MetaPage title="No Resources Found" description="Nothing here yet." />
			) : (
				<div className="flex flex-wrap gap-4">
					{resources.map((r) => (
						<ResourceCard key={r.id} {...r} />
					))}
				</div>
			)}
		</div>
	);
}

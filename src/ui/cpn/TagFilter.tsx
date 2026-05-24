"use client";

import { useRouter } from "next/navigation";

type Tag = { handle: string; title: string };

type Props = {
	tags: Tag[];
	activeTag?: string;
};

export function TagFilter({ tags, activeTag }: Props) {
	const router = useRouter();

	function select(handle: string | undefined) {
		const url = handle ? `/browse?tag=${handle}` : "/browse";
		router.push(url);
	}

	return (
		<div className="flex flex-wrap gap-2">
			<button
				type="button"
				onClick={() => select(undefined)}
				className={[
					"rounded-full px-3 py-1 text-sm font-medium transition-all duration-75 border",
					!activeTag
						? "bg-white/15 border-white/30 text-white"
						: "bg-white/5 border-white/10 text-white/50 hover:text-white/80 hover:border-white/20"
				].join(" ")}
			>
				All
			</button>
			{tags.map((tag) => {
				const isActive = activeTag === tag.handle;
				return (
					<button
						key={tag.handle}
						type="button"
						onClick={() => select(tag.handle)}
						className={[
							"rounded-full px-3 py-1 text-sm font-medium transition-all duration-75 border",
							isActive
								? "bg-white/15 border-white/30 text-white"
								: "bg-white/5 border-white/10 text-white/50 hover:text-white/80 hover:border-white/20"
						].join(" ")}
					>
						{tag.title}
					</button>
				);
			})}
		</div>
	);
}

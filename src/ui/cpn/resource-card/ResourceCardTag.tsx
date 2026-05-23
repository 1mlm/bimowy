import type { FetchedResource } from "@/db/util";
import { TAGS_ICON_MAP } from "@/ui/constants/tags";


export function ResourceCardTag(tag: FetchedResource["tags"][number]) {
  const Icon = TAGS_ICON_MAP[tag.handle]?.icon;

  return (
    <span
      className={`bg-white/5 text-xs px-2 py-0.5 rounded-xl border
    flex items-center justify-center`}
    >
      {Icon && <Icon className="inline-block mr-1 size-3" />}
      {tag.title}
    </span>
  );
}

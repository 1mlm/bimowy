import { ArrowRightIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import type { FetchedResource } from "@/db/util";
import { RESOURCE_TYPES_MAP, UNKNOWN_RESOURCE_TYPE } from "@/ui/constants/resource-types";
import { useIsFocused } from "@/ui/hooks/useIsFocused";
import { DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/ui/shadcn/ui/dialog";
import { Button } from "@/ui/shared/button";
import { ResourceCardTopLeftBadge } from "./ResourceCardTopLeftBadge";

export function ResourceCardPopupContent({ resource }: { resource: FetchedResource }) {
  const ref = useRef<HTMLDivElement>(null);
  const isFocused = useIsFocused(ref);
  const resourceTypeData = RESOURCE_TYPES_MAP.find(r => r.type === resource.type)
    || UNKNOWN_RESOURCE_TYPE;
  const href = `/${resourceTypeData.handle}/${resource.handle}`;

  return (
    <DialogContent {...{ ref }}>
      <ResourceCardTopLeftBadge {...{ resource, isFocused }} />
      <DialogTitle>
        <p>{resource.title}</p>
        <p className="font-light! text-sm inline-flex gap-1 justify-center items-center">
          <ArrowRightIcon className="size-3.5" />
          {resource.aliases.join(" - ")}
        </p>
      </DialogTitle>
      <DialogDescription>{resource.desc}</DialogDescription>
      <DialogFooter>
        <Button asChild>
          <Link href={href}>
            <PlayIcon />
            Start
          </Link>
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

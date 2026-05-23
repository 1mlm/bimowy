import type { PropsWithChildren } from "react";
import type { FetchedResource } from "@/db/util";
import { ResourceCardPopupContent } from "./ResourceCardPopupContent";
import { Dialog, DialogTrigger } from "@/ui/shadcn/ui/dialog";

export function ResourceCardPopupProvider({
  children,
  resource
}: PropsWithChildren & { resource: FetchedResource }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <ResourceCardPopupContent {...{ resource }} />
    </Dialog>
  );
}

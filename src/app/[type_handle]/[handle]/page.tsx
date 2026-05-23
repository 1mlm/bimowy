import { fetchResource } from "@/db/util";
import { getResourceTypeFromHandle } from "@/utils";

type ResourcePageParams = Promise<{ handle: string; type_handle: string }>;

export default async function ResourcePage({ params }: { params: ResourcePageParams }) {
  const { handle, type_handle } = await params;

  const resource_type = getResourceTypeFromHandle(type_handle);
  if (!resource_type) throw new Error(`Could not find resource type with handle "${type_handle}"`);

  const label = resource_type.label.toLowerCase();
  const resource = await fetchResource(resource_type.type, handle);
  if (!resource) throw new Error(`No ${label} found for handle: ${handle}`);

  const uiNodes =
    resource.data && typeof resource.data === "object" && "uiPlan" in resource.data
      ? resource.data.uiPlan
      : null;
  if (!uiNodes) throw new Error(`${label} data is missing "uiNodes".`);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-5xl font-bold inline-flex items-center gap-2">
        <resource_type.icon className="size-[0.75em] stroke-2.5" /> {resource.title}
      </h1>
      <p className="opacity-90">{resource.desc}</p>
      <div className="flex size-full bg-white/5 rounded-2xl border m-4 mb-0">
        {/* <RootUIRenderer nodes={uiNodes} /> */}
        <pre className="p-3 overflow-x-auto text-sm font-mono">
          {JSON.stringify(resource.data, null, 2)} {/** UI test for long text */}
        </pre>
      </div>
    </div>
  );
}

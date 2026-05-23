import type { NSNode } from "@/ns/nodes";
import { UIRenderer } from "./UIRenderer";

export function RootUIRenderer({ nodes }: { nodes: NSNode[] }) {
  return (
    <div>
      {nodes.map((node, i) => <UIRenderer key={i} node={node} />)}
    </div>
  );
}

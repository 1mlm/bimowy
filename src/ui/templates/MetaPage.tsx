"use client";
import { type LucideIcon, Undo2Icon } from "lucide-react";
import { Button } from "../shared/button";

export function MetaPage({
  title,
  description,
  icon: Icon
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex items-center justify-center flex-col gap-2  size-full">
      {Icon && <Icon className="size-24" />}
      <h1 className="text-5xl font-bold ml-4">{title}</h1>
      <p className="text-lg opacity-80">{description}</p>
      <Button onClick={() => window.history.back()} className="mt-4">
        <Undo2Icon /> Go Back
      </Button>
    </div>
  );
}

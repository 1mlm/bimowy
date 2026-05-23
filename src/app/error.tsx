"use client";
import { OctagonAlertIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/ui/shared/button";

export default function ErrorPage({
  error,
  unstable_retry
}: {
  error: Error;
  unstable_retry: () => void;
}) {
  return (
    <div className={`w-full h-full
      flex items-center justify-center flex-col gap-3 text-center`}>
      <OctagonAlertIcon className="size-32" />
      <h1 className="text-6xl font-bold -rotate-1">{error.message}</h1>
      <p className="opacity-80 font-light">An unexpected error has occurred {">:c"} </p>
      <Button onClick={() => unstable_retry()} className="font-semibold">
        <RefreshCwIcon />
        Reload Page
      </Button>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export function CarSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4">
        <Skeleton className="h-6 w-2/3 mb-2" />
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </div>
  );
}
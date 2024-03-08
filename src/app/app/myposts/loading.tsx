import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-12 w-16" />

      <Skeleton className="h-6 w-96" />
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
    </div>
  );
};

export default loading;

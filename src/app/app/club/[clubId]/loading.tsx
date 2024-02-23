import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <div className="mx-auto flex w-full flex-col md:w-[65%] lg:w-[55%] xl:w-[45%]">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div className="flex flex-col gap-y-2" key={i}>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-36 w-full" />
            <div className="flex gap-x-2">
              <Skeleton className="w-18 h-12" />
              <Skeleton className="w-18 h-12" />
            </div>
          </div>
        ))}
    </div>
  );
};

export default loading;

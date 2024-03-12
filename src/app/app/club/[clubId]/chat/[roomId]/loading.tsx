import { Skeleton } from "../../../../../../components/ui/skeleton";

const loading = () => {
  return (
    <div className="flex h-full flex-col ">
      <div
        id="chatbox"
        className=" flex h-[calc(100vh-220px)] w-full flex-col-reverse gap-y-1 overflow-y-scroll "
      >
        {/* TODO: Check for solution without reversal */}
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              key={i}
              className={`h-24  min-w-60 max-w-fit ${i % 2 === 0 ? "self-end bg-secondary text-black" : "text-white"} rounded-lg  p-1  dark:text-black`}
            />
          ))}
      </div>
      <div>
        <Skeleton className="h-12 w-24" />
        <div className="mt-auto flex items-center justify-center gap-x-2 ">
          <Skeleton className="h-36 w-full" />
        </div>
      </div>
    </div>
  );
};

export default loading;

import Loading from "@/components/Loading";

const loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loading className="h-18 w-18" height={25} width={25} />
    </div>
  );
};

export default loading;

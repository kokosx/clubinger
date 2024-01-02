import AddPostCard from "./AddPostCard";

type Props = {
  params: {
    clubId: number;
  };
};

const page = ({ params }: Props) => {
  return (
    <div className="mx-auto  flex w-full flex-col gap-y-2 md:w-[65%] lg:w-[55%] xl:w-[45%]">
      <AddPostCard clubId={params.clubId} />
    </div>
  );
};

export default page;

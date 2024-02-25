import BackButton from "@/components/BackButton";
import ChatBox from "./ChatBox";

type Props = {
  params: {
    clubId: string;
  };
};

const page = ({ params }: Props) => {
  return (
    <div className="flex h-full min-h-full items-end">
      <BackButton />
      <ChatBox clubId={Number(params.clubId)} />
    </div>
  );
};

export default page;

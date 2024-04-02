import { ReloadIcon } from "@radix-ui/react-icons";
import { Card } from "./ui/card";

type Props = {
  loading?: boolean;
};

const LoadingPostCard = ({ loading }: Props) => {
  if (!loading) {
    return <></>;
  }
  return (
    <Card className="flex  h-48 w-full items-center justify-center">
      <ReloadIcon className="mr-2 h-12 w-12 animate-spin" />
    </Card>
  );
};

export default LoadingPostCard;

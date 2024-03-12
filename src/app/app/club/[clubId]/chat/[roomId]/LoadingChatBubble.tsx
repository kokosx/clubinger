import { Button } from "@/components/ui/button";

type Props = {
  message: string;
  username: string;
};

const LoadingChatBubble = ({ message, username }: Props) => {
  return (
    <div
      className={`h-full w-2/3 min-w-36 max-w-fit self-end rounded-lg bg-secondary p-1  text-black  dark:text-black`}
    >
      <Button
        variant={"link"}
        className={`p-0 text-lg font-semibold  text-black`}
      >
        @{username}
      </Button>

      <p>{message}</p>
    </div>
  );
};

export default LoadingChatBubble;

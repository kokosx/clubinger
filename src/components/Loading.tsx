import { ReloadIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { IconProps } from "@radix-ui/react-icons/dist/types";

type Props = IconProps;

const Loading = (props: Props) => {
  return (
    <ReloadIcon
      {...props}
      className={cn("mr-2 h-4 w-4 animate-spin", props.className)}
    />
  );
};

export default Loading;

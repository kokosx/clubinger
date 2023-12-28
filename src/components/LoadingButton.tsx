import { ReloadIcon } from "@radix-ui/react-icons";

import { Button, ButtonProps } from "@/components/ui/button";

type Props = ButtonProps & {
  loading?: boolean;
};

export function LoadingButton({ loading, ...props }: Props) {
  return (
    <Button disabled={loading} {...props}>
      {loading ? (
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      ) : undefined}
      {props.children}
    </Button>
  );
}

import type React from "react";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
> & {
  error: any;
};

const InputError = (props: Props) => {
  if (props.error) {
    return (
      <p className="text-sm text-red-500" {...props}>
        {props.error}
      </p>
    );
  }
  return null;
};

export default InputError;

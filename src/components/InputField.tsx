import { type PropsWithChildren } from "react";

const InputField = ({ children }: PropsWithChildren) => {
  return <div className="grid w-full items-center gap-1.5">{children}</div>;
};

export default InputField;

import type {
  DetailedHTMLProps,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Cross2Icon } from "@radix-ui/react-icons";

type GenreTagsProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const GenreTags = (props: GenreTagsProps) => {
  return <div className="flex flex-wrap gap-1" {...props}></div>;
};

type GenreTagProps = {
  children: ReactNode;
  withDelete?: MouseEventHandler<SVGElement> | undefined;
};

export const GenreTag = ({ children, withDelete }: GenreTagProps) => {
  return (
    <Badge variant="outline">
      {children}
      {withDelete && (
        <Cross2Icon className="h-4 w-4 cursor-pointer" onClick={withDelete} />
      )}
    </Badge>
  );
};

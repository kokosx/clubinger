"use client";
import { type PropsWithChildren, createContext, useState } from "react";
import { DisplayComment } from "./page";
import { CommentOutputs } from "../../../../../../server/api/root";

export const NewCommentContext = createContext<{
  addComment: (c: CommentOutputs["createComment"]["data"]) => void;
  newComments: CommentOutputs["createComment"]["data"][];
}>({
  addComment: () => {},
  newComments: [],
});

const NewCommentProvider = ({ children }: PropsWithChildren) => {
  const [comments, setComments] = useState<
    CommentOutputs["createComment"]["data"][]
  >([]);

  const addComment = (c: CommentOutputs["createComment"]["data"]) => {
    setComments((p) => [c, ...p]);
  };

  return (
    <NewCommentContext.Provider value={{ addComment, newComments: comments }}>
      {children}
    </NewCommentContext.Provider>
  );
};

export default NewCommentProvider;

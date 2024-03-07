"use client";
import { type PropsWithChildren, createContext, useState } from "react";
import { DisplayComment } from "./page";

export const NewCommentContext = createContext<{
  addComment: (c: DisplayComment) => void;
  newComments: DisplayComment[];
}>({
  addComment: () => {},
  newComments: [],
});

const NewCommentProvider = ({ children }: PropsWithChildren) => {
  const [comments, setComments] = useState<DisplayComment[]>([]);

  const addComment = (c: DisplayComment) => {
    setComments((p) => [c, ...p]);
  };

  return (
    <NewCommentContext.Provider value={{ addComment, newComments: comments }}>
      {children}
    </NewCommentContext.Provider>
  );
};

export default NewCommentProvider;

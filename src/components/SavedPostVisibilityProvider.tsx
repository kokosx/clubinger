"use client";

import { PropsWithChildren, createContext, useState } from "react";

export const SavedPostVisibilityContext = createContext<{
  addToHiddenPosts: (id: number) => void;
  removeFromHiddenPosts: (id: number) => void;
  isPostVisible: (id: number) => boolean;
}>({
  addToHiddenPosts: () => {},
  removeFromHiddenPosts: () => {},
  isPostVisible: () => true,
});

type HiddenPosts = {
  id: number;
}[];

const SavedPostVisibilityProvider = ({ children }: PropsWithChildren) => {
  const [hiddenPosts, setHiddenPosts] = useState<HiddenPosts>([]);

  const addToHiddenPosts = (id: number) => {
    setHiddenPosts((hiddenPosts) => [...hiddenPosts, { id }]);
  };
  const removeFromHiddenPosts = (id: number) => {
    setHiddenPosts((hiddenPosts) =>
      hiddenPosts.filter((post) => post.id !== id),
    );
  };
  const isPostVisible = (id: number) =>
    !hiddenPosts.some((post) => post.id === id);

  return (
    <SavedPostVisibilityContext.Provider
      value={{ isPostVisible, addToHiddenPosts, removeFromHiddenPosts }}
    >
      {children}
    </SavedPostVisibilityContext.Provider>
  );
};

export default SavedPostVisibilityProvider;

"use client";
//TODO: REWRITE BECAUSE UGLY
import {
  type ReactNode,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

type PostLikeChange = {
  id: number;
  change: "like" | "unlike";
};

type LikeCount = {
  id: number;
  count: number;
};

export const likedPostsContext = createContext<{
  postLikeChanges: PostLikeChange[];
  setPostLikeChanges?: Dispatch<SetStateAction<PostLikeChange[]>>;
  likeCount: LikeCount[];
  setLikeCount?: Dispatch<SetStateAction<LikeCount[]>>;
}>({
  postLikeChanges: [],
  setPostLikeChanges: undefined,
  likeCount: [],
  setLikeCount: undefined,
});

type Props = {
  children: ReactNode;
};

export const useLike = (
  postId: number,
  initiallyLiked: boolean,
  initialCount: number,
) => {
  const ctx = useContext(likedPostsContext);

  const getFromContext = () => {
    for (let i = 0; i < ctx.postLikeChanges.length; i++) {
      if (ctx.postLikeChanges[i]!.id === postId) {
        return { ...ctx.postLikeChanges[i], index: i };
      }
    }
    return null;
  };

  const initIsLiked = () => {
    const fc = getFromContext();
    if (fc) {
      if (fc?.change === "like") {
        return true;
      } else {
        return false;
      }
    }
    return initiallyLiked;
  };

  const initCount = () => {
    const fc = ctx.likeCount.filter((v) => v.id === postId).at(0);
    if (fc) {
      return fc.count;
    }
    return initialCount;
  };

  const [isLiked, setIsLiked] = useState<boolean>(initIsLiked());
  const [likeCount, setLikeCount] = useState(initCount());

  const addToCount = () => {
    ctx.setLikeCount!((p) => [
      ...p.filter((v) => v.id !== postId),
      { count: likeCount + 1, id: postId },
    ]);
    setLikeCount((p) => p + 1);
  };

  const subtractFromCount = () => {
    ctx.setLikeCount!((p) => [
      ...p.filter((v) => v.id !== postId),
      { count: likeCount - 1, id: postId },
    ]);
    setLikeCount((p) => p - 1);
  };

  const addLike = () => {
    setIsLiked(true);
    addToCount();
    ctx!.setPostLikeChanges!((prev) => [
      ...prev.filter((v) => v.id !== postId),
      { change: "like", id: postId },
    ]);
  };

  const deleteLike = () => {
    setIsLiked(false);
    subtractFromCount();
    ctx!.setPostLikeChanges!((prev) => [
      ...prev.filter((v) => v.id !== postId),
      { change: "unlike", id: postId },
    ]);
  };

  return { isLiked, deleteLike, addLike, likeCount };
};

export default function LikedPostsProvider({ children }: Props) {
  const [postLikeChanges, setPostLikeChanges] = useState<PostLikeChange[]>([]);
  const [likeCount, setLikeCount] = useState<LikeCount[]>([]);
  return (
    <likedPostsContext.Provider
      value={{ likeCount, postLikeChanges, setLikeCount, setPostLikeChanges }}
    >
      {children}
    </likedPostsContext.Provider>
  );
}

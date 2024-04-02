"use client";

import { BookmarkCheckIcon, BookmarkIcon, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { api } from "@/trpc/react";
import { useParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import SuccessToastIcon from "./SuccessToastIcon";
import ErrorToastIcon from "./ErrorToastIcon";
import { useContext, useState } from "react";
import { SavedPostVisibilityContext } from "./SavedPostVisibilityProvider";
import { revalidatePathAction } from "../actions/revalidatePathAction";

type Props = {
  postId: number;
  clubId: number;
  isInitiallySaved: boolean;
};

const PostActions = ({ postId, isInitiallySaved, clubId }: Props) => {
  const path = usePathname();
  const { addToHiddenPosts, removeFromHiddenPosts } = useContext(
    SavedPostVisibilityContext,
  );

  const removeIfSavedPage = () => {
    if (path === "/app/saved") {
      addToHiddenPosts(postId);
    }
  };

  const [isSaved, setIsSaved] = useState(isInitiallySaved);

  const _savePost = api.post.savePost.useMutation({
    onSuccess: () => {
      toast("Zapisano", { icon: <SuccessToastIcon /> });
      setIsSaved(true);
      removeFromHiddenPosts(postId);
    },
    onError: () => {
      toast("Nie udało się zapisać", { icon: <ErrorToastIcon /> });
    },
  });
  const _unsavePost = api.post.unsavePost.useMutation({
    onSuccess: () => {
      toast("Usunięto", { icon: <SuccessToastIcon /> });
      setIsSaved(false);
      removeIfSavedPage();
    },
    onError: () => {
      toast("Coś poszło nie tak", { icon: <ErrorToastIcon /> });
    },
  });

  const save = () => {
    if (isSaved) {
      _unsavePost.mutate({ postId });
    } else {
      _savePost.mutate({ clubId, postId });
    }
    if (path !== "/app/saved") {
      revalidatePathAction("/app/saved", "page");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          disabled={_savePost.isLoading || _unsavePost.isLoading}
          onClick={(e) => {
            e.stopPropagation();
            save();
          }}
          className="cursor-pointer space-x-1"
        >
          {isSaved ? <BookmarkCheckIcon /> : <BookmarkIcon />}

          <span>{isSaved ? "Usuń zapis" : "Zapisz"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostActions;

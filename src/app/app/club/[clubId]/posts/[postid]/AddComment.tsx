"use client";

import TextareaAutosize from "@/components/TextareaAutosize";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { commentMessage } from "@/schemas/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { LoadingButton } from "@/components/LoadingButton";
import { useContext } from "react";
import { NewCommentContext } from "./NewCommentProvider";

type Form = {
  message: typeof commentMessage._output;
};

type Props = {
  clubId: number;
  postId: number;
};

const AddComment = ({ clubId, postId }: Props) => {
  const { handleSubmit, register, reset } = useForm<Form>({
    resolver: zodResolver(z.object({ message: commentMessage })),
  });
  const ctx = useContext(NewCommentContext);
  const _addComment = api.comment.createComment.useMutation({
    onSuccess({ data }) {
      toast("Dodano komentarz!");
      ctx.addComment(data);
      reset();
    },
  });

  const onSubmit = handleSubmit(({ message }) => {
    _addComment.mutate({ clubId, message, parentId: postId });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-y-2">
      <TextareaAutosize />
      <Textarea
        {...register("message")}
        className="min-h-28 w-full md:max-w-[60%]"
      />
      <LoadingButton loading={_addComment.isLoading} className="max-w-24">
        Dodaj
      </LoadingButton>
    </form>
  );
};

export default AddComment;

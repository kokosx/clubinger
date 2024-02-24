"use client";

import TextareaAutosize from "@/components/TextareaAutosize";
import { Textarea } from "../../../../../../components/ui/textarea";
import { Button } from "../../../../../../components/ui/button";
import { api } from "../../../../../../trpc/react";
import { useForm } from "react-hook-form";
import { message } from "../../../../../../schemas/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

type Form = {
  message: typeof message._output;
};

type Props = {
  clubId: number;
  postId: number;
};

const AddComment = ({ clubId, postId }: Props) => {
  const { handleSubmit, register, reset } = useForm<Form>({
    resolver: zodResolver(z.object({ message })),
  });
  const _addComment = api.comment.createComment.useMutation({
    onSuccess() {
      toast("Dodano komentarz!");
      reset();
    },
  });
  const onSubmit = handleSubmit(({ message }) => {
    _addComment.mutate({ clubId, message, postId });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-y-2">
      <TextareaAutosize />
      <Textarea
        {...register("message")}
        className="min-h-28 w-full md:max-w-[60%]"
      />
      <Button className="max-w-24">Dodaj</Button>
    </form>
  );
};

export default AddComment;

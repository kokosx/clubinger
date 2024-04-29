import React, { Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TextareaAutosize from "@/components/TextareaAutosize";
import { Textarea } from "@/components/ui/textarea";
import InputField from "@/components/InputField";
import { Label } from "@/components/ui/label";
import InputError from "@/components/InputError";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { commentMessage } from "../../../../../../schemas/comment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../../../../trpc/react";
import { toast } from "sonner";
import { PostCommentReply } from "@prisma/client";
import { LoadingButton } from "../../../../../../components/LoadingButton";

const formSchema = z.object({
  message: commentMessage,
});

type Props = {
  addNewReply: (a: PostCommentReply) => void;
  commentId: number;
  clubId: number;
};

const AddReply = ({ addNewReply, clubId, commentId }: Props) => {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<typeof formSchema._output>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = handleSubmit(({ message }) => {
    _addReply.mutate({ message, parentId: commentId, clubId });
  });

  const _addReply = api.comment.createReply.useMutation({
    onSuccess: ({ data }) => {
      reset();
      addNewReply(data);

      toast("Pomyślnie dodano odpowiedź");
    },
    onError: () => {
      toast("Wystąpił nieznany błąd");
    },
  });

  return (
    <form onSubmit={onSubmit}>
      <Card className=" w-full border-primary">
        <CardHeader>
          <CardTitle>Odpowiedz</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2">
          <InputField>
            <Label htmlFor="message">Wiadomość</Label>
            <Textarea {...register("message")} id="message" />
            <InputError error={errors.message?.message} />
          </InputField>
          <span>
            <LoadingButton loading={_addReply.isLoading}>Dodaj</LoadingButton>
          </span>

          <TextareaAutosize />
        </CardContent>
      </Card>
    </form>
  );
};

export default AddReply;

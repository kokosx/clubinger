"use client";

import React, { useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import InputField from "@/components/InputField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/InputError";
import { useForm } from "react-hook-form";
import { addPostSchema } from "@/schemas/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@/components/LoadingButton";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import BackButton from "@/components/BackButton";
import { revalidatePathAction } from "@/actions/revalidatePathAction";

const page = () => {
  const { clubId } = useParams();
  const router = useRouter();

  const _addPost = api.post.addPost.useMutation({
    onSuccess: ({ post }) => {
      revalidatePathAction(`/app/club/${post.clubId}`);
      router.push(`/app/club/${post.clubId}/posts/${post.id}`);
      toast("Udało się utworzyć post!");
    },
  });

  const [content, setContent] = useState("");

  type FormType = { title: (typeof addPostSchema._output)["title"] };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(addPostSchema.omit({ clubId: true })),
  });

  const onSubmit = handleSubmit(
    (data) => {
      _addPost.mutate({
        title: data.title,
        description: content,
        clubId: Number(clubId),
      });
    },
    (e) => console.log(e),
  );

  return (
    <form onSubmit={onSubmit}>
      <BackButton />
      <InputField>
        <Label className="text-2xl" htmlFor="title">
          Tytuł
        </Label>
        <Input {...register("title")} />
        <InputError error={errors.title?.message} />
      </InputField>
      <div className="space-y-2">
        <p className="mb-2 text-2xl">Wpis (opcjonalne)</p>
        <RichTextEditor setValue={setContent} />
        <LoadingButton loading={_addPost.isLoading}>Dodaj</LoadingButton>
      </div>
    </form>
  );
};

export default page;

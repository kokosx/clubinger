"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import InputField from "../../../../../../components/InputField";
import { Input } from "../../../../../../components/ui/input";
import InputError from "../../../../../../components/InputError";
import { z } from "zod";
import { chatRoomName } from "../../../../../../schemas/chat";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../../../../components/ui/button";
import { api } from "../../../../../../trpc/react";
import { useParams } from "next/navigation";
import { revalidatePathAction } from "@/actions/revalidatePathAction";

type Props = {
  isSuperuser: boolean;
};

const form = z.object({
  name: chatRoomName,
});

type Form = typeof form._output;

const CreateNewChatRoom = ({ isSuperuser }: Props) => {
  if (!isSuperuser) {
    return;
  }

  const { clubId }: { clubId: string } = useParams();

  const _createNewChatRoom = api.chat.createNewChatRoom.useMutation({
    onSuccess() {
      revalidatePathAction(`/app/club/${clubId}/chat`);
      reset();
      closeDialog();
    },
  });

  const closeDialog = () => {
    //@ts-expect-error it exists
    document.querySelector("#close-new-room-dialog").click();
  };

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<Form>({ resolver: zodResolver(form) });

  const onSubmit = handleSubmit((data) => {
    _createNewChatRoom.mutate({
      clubId: Number(clubId),
      name: data.name,
    });
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className=" cursor-pointer justify-center">
          <CardHeader className="p-4">
            <CardTitle className="p-0 text-lg">Utwórz pokój</CardTitle>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="w-full md:w-1/2">
        <DialogHeader>Nowy pokój</DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-y-2">
          <InputField>
            <Input {...register("name")} />
            <InputError error={errors.name?.message} />
          </InputField>
          <Button disabled={!isValid}>Utwórz</Button>
        </form>
      </DialogContent>
      <DialogClose className="hidden" id="close-new-room-dialog"></DialogClose>
    </Dialog>
  );
};

export default CreateNewChatRoom;

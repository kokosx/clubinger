"use client";

import { FormEvent, useEffect, useState } from "react";
import Pusher from "pusher-js";
import { env } from "@/env";
import {
  NewClubMessage,
  clubChannel,
  newMessageEvent,
} from "@/lib/pusher/client";
import { api } from "@/trpc/react";
import { Textarea } from "@/components/ui/textarea";
import TextareaAutosize from "@/components/TextareaAutosize";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { chatMessageSchema } from "@/schemas/chat";

type Props = {
  clubId: number;
};

const formSchema = z.object({
  message: chatMessageSchema,
});

const ChatBox = ({ clubId }: Props) => {
  const _sendMessage = api.chat.sendClubMessage.useMutation();
  const [messages, setMessages] = useState<NewClubMessage[]>([]);
  const { register, handleSubmit, reset } = useForm<typeof formSchema._output>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(clubChannel(clubId));

    channel.bind(newMessageEvent, (data: NewClubMessage) => {
      console.log("NEW MESSAGE", data);
    });
  }, []);

  const onSubmit = handleSubmit(({ message }) => {
    _sendMessage.mutate({ message, clubId });
    reset();
  });

  return (
    <div className="flex flex-col">
      <div></div>
      <form onSubmit={onSubmit}>
        <Label htmlFor="message">Twoja wiadomość</Label>
        <div className="flex items-center gap-x-2">
          <Textarea {...register("message")} id="message" />
          <Button className="h-full min-h-full">Wyślij</Button>
          <TextareaAutosize />
        </div>
      </form>
    </div>
  );
};

export default ChatBox;

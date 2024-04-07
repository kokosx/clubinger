"use client";

import { useEffect, useState } from "react";
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
import InputField from "@/components/InputField";
import InputError from "@/components/InputError";
import { SendHorizonal } from "lucide-react";
import ChatBubble from "@/components/ChatBubble";
import { AuthUser } from "../../../../../../lib/auth/auth";
import useElementOnScreen from "./useChatScroll";
import { useInterval } from "usehooks-ts";

type Props = {
  clubId: number;
  roomId: number;
  initialMessages: NewClubMessage[];
  user: AuthUser;
  initialCursor?: number;
};

const formSchema = z.object({
  message: chatMessageSchema,
});
//FIXME: Fix this terrible code
const ChatBox = ({
  clubId,
  roomId,
  initialMessages,
  user,
  initialCursor,
}: Props) => {
  const [newMessages, setNewMessages] = useState<NewClubMessage[]>([]);
  const _sendMessage = api.chat.sendClubMessage.useMutation({});
  const _getChatMessages = api.chat.getChatMessages.useInfiniteQuery(
    { clubId, roomId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor,
      initialData: {
        pages: [
          {
            items: initialMessages,
            nextCursor: initialCursor,
          },
        ],
        pageParams: [],
      },
    },
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<typeof formSchema._output>({
    resolver: zodResolver(formSchema),
  });

  let optimisticId = 0;

  useEffect(() => {
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(clubChannel(clubId));

    channel.bind(newMessageEvent, (data: NewClubMessage) => {
      setNewMessages((p) => [data, ...p]);
    });
  }, []);

  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [lastElement, setLastElement] = useState(null);

  useEffect(() => {
    const newChild = document.querySelector("#chatbox")?.lastChild;

    //@ts-expect-error
    setLastElement(newChild);
  }, [_getChatMessages.data]);

  useInterval(
    () => {
      setIsOnCooldown(false);
    },
    isOnCooldown ? 100 : null,
  );

  useEffect(() => {
    setIsOnCooldown(true);
  }, [_getChatMessages.data]);

  const fetchNextPage = () => {
    if (initialCursor && !isOnCooldown) {
      _getChatMessages.fetchNextPage();
      setIsOnCooldown(true);
    }
  };

  useElementOnScreen(
    //@ts-expect-error
    lastElement,
    fetchNextPage,
  );

  const onSubmit = handleSubmit(({ message }) => {
    _sendMessage.mutate({ message, roomId, clubId, optimisticId });
    reset();
  });

  return (
    <div className="flex h-full flex-col ">
      <div
        id="chatbox"
        className=" flex h-[calc(100vh-240px)] w-full flex-col-reverse gap-y-1 overflow-y-scroll "
      >
        {/* TODO: Check for solution with reversal */}
        {newMessages.map((message) => (
          <ChatBubble message={message} userId={user.id} key={message.id} />
        ))}
        {_getChatMessages.data?.pages.map((page, i) => {
          const isLastPage = _getChatMessages.data.pages.length - 1 === i;
          return page.items.map((message, i) => {
            const isLastMessage = page.items.length - 1 === i;
            return (
              <ChatBubble message={message} userId={user.id} key={message.id} />
            );
          });
        })}
      </div>
      <form onSubmit={onSubmit}>
        <Label htmlFor="message">Twoja wiadomość</Label>
        <div className="mt-auto flex items-center justify-center gap-x-2 ">
          <InputField>
            <Textarea {...register("message")} id="message" />
            <InputError error={errors.message?.message} />
          </InputField>

          <Button
            disabled={!isValid || _sendMessage.isLoading}
            className="space-x-1"
          >
            <span>Wyślij</span> <SendHorizonal className="h-4" />
          </Button>
          <TextareaAutosize />
        </div>
      </form>
    </div>
  );
};

export default ChatBox;

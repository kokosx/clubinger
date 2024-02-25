"use client";

import { FormEvent, useEffect, useState } from "react";
import Pusher from "pusher-js";
import { env } from "@/env";
import {
  NewClubMessage,
  clubChannel,
  newMessageEvent,
} from "@/lib/pusher/client";
import { api } from "../../../../../trpc/react";

type Props = {
  clubId: number;
};

const ChatBox = ({ clubId }: Props) => {
  const _sendMessage = api.chat.sendClubMessage.useMutation();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(clubChannel(clubId));

    channel.bind(newMessageEvent, (data: NewClubMessage) => {
      console.log("NEW MESSAGE", data);
    });
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    _sendMessage.mutate({ clubId, message });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
      />
      <button>wyslj</button>
    </form>
  );
};

export default ChatBox;

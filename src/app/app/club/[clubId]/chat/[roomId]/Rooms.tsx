"use client";

import { ChatRoom } from "@prisma/client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";

type Props = {
  rooms: ChatRoom[];
  initialRoom: number;
  clubId: string;
};

const Rooms = ({ rooms, initialRoom, clubId }: Props) => {
  const [roomId, setRoomId] = useState(initialRoom);
  console.log(initialRoom);
  return rooms.map((room) => (
    <Link href={`/app/club/${clubId}/chat/${room.id}`}>
      <Card
        key={room.id}
        className={`${room.id === roomId && "border-2 border-primary"} cursor-pointer`}
        onClick={() => {
          setRoomId(room.id);
        }}
      >
        <CardHeader className="p-4">
          <CardTitle className="p-0 text-lg">{room.name}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  ));
};

export default Rooms;

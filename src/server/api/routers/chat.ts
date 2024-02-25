import { sendClubMessageSchema } from "@/schemas/chat";
import { attendingUserProcedure, createTRPCRouter } from "../trpc";
import Pusher from "pusher";
import { pusherConfig } from "../../../lib/pusher/server";
import {
  NewClubMessage,
  clubChannel,
  newMessageEvent,
} from "../../../lib/pusher/client";

export const chatRouter = createTRPCRouter({
  sendClubMessage: attendingUserProcedure
    .input(sendClubMessageSchema)
    .mutation(async ({ ctx, input }) => {
      const newMessage = await ctx.db.chatMessage.create({
        data: {
          message: input.message,
          clubId: input.clubId,
          createdBy: ctx.user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
              avatarMediaType: true,
            },
          },
        },
      });

      const pusher = new Pusher(pusherConfig);

      const msgToSend = {
        id: newMessage.id,
        message: newMessage.message,
        user: newMessage.user,
      } as NewClubMessage;

      pusher.trigger(clubChannel(input.clubId), newMessageEvent, msgToSend);

      return {};
    }),
});

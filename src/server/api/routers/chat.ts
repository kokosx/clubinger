import { createChatRoomSchema, sendClubMessageSchema } from "@/schemas/chat";
import { attendingUserProcedure, createTRPCRouter } from "../trpc";
import Pusher from "pusher";
import { pusherConfig } from "../../../lib/pusher/server";
import {
  NewClubMessage,
  clubChannel,
  newMessageEvent,
} from "../../../lib/pusher/client";
import { getGeneralIdSchema } from "../../../schemas/club";

export const chatRouter = createTRPCRouter({
  getGeneralId: attendingUserProcedure
    .input(getGeneralIdSchema)
    .query(async ({ input, ctx }) => {
      const room = await ctx.db.chatRoom.findFirst({
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
        },
        where: {
          clubId: input.clubId,
        },
      });

      return { id: room!.id };
    }),
  createNewChatRoom: attendingUserProcedure
    .input(createChatRoomSchema)
    .mutation(async ({ input, ctx }) => {
      const room = await ctx.db.chatRoom.create({
        data: {
          name: input.name,
          createdBy: ctx.user.id,
          clubId: input.clubId,
        },
      });
      return { room };
    }),
  sendClubMessage: attendingUserProcedure
    .input(sendClubMessageSchema)
    .mutation(async ({ ctx, input }) => {
      const newMessage = await ctx.db.chatMessage.create({
        data: {
          message: input.message,
          roomId: input.roomId,
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

      return { resolvedId: input.optimisticId };
    }),
});

import {
  DEFAULT_GET_CHAT_MESSAGES_TAKE,
  createChatRoomSchema,
  getChatMessagesSchema,
  sendClubMessageSchema,
} from "@/schemas/chat";
import {
  attendingUserProcedure,
  createTRPCRouter,
  sendPagination,
} from "../trpc";
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

  getChatMessages: attendingUserProcedure
    .input(getChatMessagesSchema)
    .query(async ({ ctx, input }) => {
      const messages: NewClubMessage[] = await ctx.db.chatMessage.findMany({
        where: {
          roomId: Number(input.roomId),
        },
        orderBy: {
          id: "desc",
        },
        take: DEFAULT_GET_CHAT_MESSAGES_TAKE + 1,
        select: {
          id: true,
          message: true,
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
              avatarMediaType: true,
            },
          },
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });
      return sendPagination({
        items: messages,
        cursor: input.cursor,
        limit: input.limit,
      });
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

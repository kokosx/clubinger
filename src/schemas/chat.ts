import { z } from "zod";
import { schemaWithPagination } from ".";

export const DEFAULT_GET_CHAT_MESSAGES_TAKE = 15;

export const chatMessageSchema = z.string().min(1);

export const chatRoomName = z.string().min(3);

export const createChatRoomSchema = z.object({
  name: chatRoomName,
  clubId: z.number(),
});

export const getChatMessagesSchema = schemaWithPagination(
  z.object({
    clubId: z.number(),
    roomId: z.number(),
  }),
  DEFAULT_GET_CHAT_MESSAGES_TAKE,
);

export const sendClubMessageSchema = z.object({
  clubId: z.number(),
  roomId: z.number(),
  message: chatMessageSchema,
  optimisticId: z.number().optional(),
});

import { z } from "zod";

export const chatMessageSchema = z.string().min(1);

export const chatRoomName = z.string().min(3);

export const createChatRoomSchema = z.object({
  name: chatRoomName,
  clubId: z.number(),
});

export const sendClubMessageSchema = z.object({
  clubId: z.number(),
  roomId: z.number(),
  message: chatMessageSchema,
  optimisticId: z.number().optional(),
});

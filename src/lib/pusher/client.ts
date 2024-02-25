import { type AvatarMediaType } from "@prisma/client";

export type NewClubMessage = {
  id: number;
  message: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string;
    avatarMediaType: AvatarMediaType;
  };
};

export const clubChannel = (clubId: any) => `club-channel-${clubId}`;

export const newMessageEvent = `new-message`;

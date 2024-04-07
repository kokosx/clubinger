import * as openPeeps from "@dicebear/open-peeps";
import { createAvatar } from "@dicebear/core";
import type { AvatarMediaType } from "@prisma/client";
import Image from "next/image";

type Props = {
  mediaType: AvatarMediaType;
  avatarUrl: string;
  size?: number;
  className?: string;
};

const UserAvatar = ({
  avatarUrl,
  mediaType,
  size,
  className: _className,
}: Props) => {
  const getSource = () => {
    if (mediaType === "DICEBEAR") {
      return createAvatar(openPeeps, {
        seed: avatarUrl,
        size: size ?? 30,
      }).toDataUriSync();
    }
    return avatarUrl;
  };

  return (
    <Image
      width={size ?? 30}
      height={size ?? 30}
      className={_className ?? ""}
      src={getSource()}
      alt="avatar"
    />
  );
};

export default UserAvatar;

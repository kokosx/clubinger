import { shapes } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import Image from "next/image";

type Props = {
  avatarUrl: string;
  size?: number;
};

const ClubAvatar = ({ avatarUrl, size }: Props) => {
  const getSource = () => {
    return createAvatar(shapes, {
      seed: avatarUrl,
      size: 64,
      radius: 50,
    }).toDataUriSync();
  };

  return (
    <Image
      className="mask mask-circle group-hover:mask-squircle rounded-md bg-accent p-0 transition-all duration-200 ease-in-out group-hover:p-1"
      width={size ?? 60}
      height={size ?? 60}
      src={getSource()}
      alt="avatar"
    />
  );
};

export default ClubAvatar;

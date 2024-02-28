import { type PropsWithChildren } from "react";
import LikedPostsProvider from "./LikedPostsProvider";

const layout = ({ children }: PropsWithChildren) => {
  return <LikedPostsProvider>{children}</LikedPostsProvider>;
};

export default layout;

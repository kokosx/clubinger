import Pusher from "pusher";
import { env } from "../../env";

export const pusherConfig: Pusher.Options = {
  appId: env.PUSHER_APP_ID,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  secret: env.PUSHER_SECRET,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
};

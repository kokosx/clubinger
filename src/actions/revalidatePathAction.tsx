"use server";

import { revalidatePath } from "next/cache";

export const revalidatePathAction = (
  path: string,
  type?: "layout" | "page",
) => {
  revalidatePath(path, type);
};

// app.d.ts
/// <reference types="lucia" />

import type { AvatarMediaType } from "@prisma/client";

declare global {
  namespace App {
    // interface PageData {}
    // interface Error {}
    // interface Platform {}
    interface Locals {
      auth: import("@/lib/auth/auth").AuthRequest;
    }
  }
  namespace Lucia {
    type Auth = import("@/lib/auth/auth").Auth;
    type DatabaseUserAttributes = {
      username: string;
      email: string;
      avatarUrl: string;
      avatarMediaType: AvatarMediaType;
    };
    type DatabaseSessionAttributes = Record<string, never>;
  }
}

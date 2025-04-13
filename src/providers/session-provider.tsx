// Workaround since React Context is unavailable in Server Components (layout.tsx)
// See https://github.com/nextauthjs/next-auth/issues/7760#issuecomment-2307132823

"use client";

import { SessionProvider } from "next-auth/react";

export default SessionProvider;
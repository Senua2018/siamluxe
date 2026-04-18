import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
import { type NextRequest } from "next/server";
import { updateSession } from "./src/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Refresh Supabase session
  const supabaseResponse = await updateSession(request);

  // Run i18n middleware
  const intlResponse = intlMiddleware(request);

  // Merge Supabase cookies into i18n response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next|icons|images|.*\\..*).*)",
  ],
};

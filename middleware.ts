import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { safeInternalPath } from "@/lib/security/safeRedirectPath";

export async function middleware(request: NextRequest) {
  // Neprovádět refresh session před OAuth/PKCE výměnou — může rozbít magic link.
  if (request.nextUrl.pathname === "/auth/callback") {
    return NextResponse.next({ request });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url?.trim() || !anon) {
    if (request.nextUrl.pathname.startsWith("/admin")) {
      const login = new URL("/login", request.url);
      login.searchParams.set("error", "config");
      login.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
        if (headers) {
          Object.entries(headers).forEach(([key, value]) => supabaseResponse.headers.set(key, value));
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/admin")) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/login";
    redirect.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirect);
  }

  if (user && request.nextUrl.pathname === "/login") {
    // Bez tohoto: účet bez řádku v `profiles` dostane /login?error=forbidden z requireEditor(),
    // middleware by ho hned přesměroval zpět na /admin → nekonečná smyčka (ERR_TOO_MANY_REDIRECTS).
    if (request.nextUrl.searchParams.get("error")) {
      return supabaseResponse;
    }
    const raw = request.nextUrl.searchParams.get("next");
    const next = safeInternalPath(raw, "/admin");
    return NextResponse.redirect(new URL(next, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

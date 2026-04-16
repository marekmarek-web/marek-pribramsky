import type { NextConfig } from "next";

function supabaseImageHost(): string | undefined {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!u?.trim()) return undefined;
  try {
    return new URL(u).hostname;
  } catch {
    return undefined;
  }
}

const supabaseHost = supabaseImageHost();

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  experimental: {
    // Menší klientské bundly: tree-shake ikon a podobných barrel exportů
    optimizePackageImports: ["lucide-react"],
  },
  async redirects() {
    return [
      { source: "/favicon.ico", destination: "/img/logos/pb-logo-no-bg.png", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/blog/index.html", destination: "/blog", permanent: true },
      { source: "/kontakt/index.html", destination: "/kontakt", permanent: true },
      { source: "/spoluprace/index.html", destination: "/spoluprace", permanent: true },
      { source: "/kalkulacky/index.html", destination: "/kalkulacky", permanent: true },
      { source: "/cookies/index.html", destination: "/cookies", permanent: true },
      { source: "/gdpr/index.html", destination: "/gdpr", permanent: true },
      { source: "/hypotecnikalkulacka/index.html", destination: "/hypotecnikalkulacka", permanent: true },
      { source: "/investicnikalkulacka/index.html", destination: "/investicnikalkulacka", permanent: true },
      { source: "/zivotnikalkulacka/index.html", destination: "/zivotnikalkulacka", permanent: true },
      { source: "/penzijnikalkulacka/index.html", destination: "/penzijnikalkulacka", permanent: true },
      { source: "/kariera/index.html", destination: "/kariera", permanent: true },
      { source: "/blog/", destination: "/blog", permanent: true },
      { source: "/kontakt/", destination: "/kontakt", permanent: true },
      { source: "/spoluprace/", destination: "/spoluprace", permanent: true },
      { source: "/kalkulacky/", destination: "/kalkulacky", permanent: true },
      { source: "/cookies/", destination: "/cookies", permanent: true },
      { source: "/gdpr/", destination: "/gdpr", permanent: true },
      { source: "/hypotecnikalkulacka/", destination: "/hypotecnikalkulacka", permanent: true },
      { source: "/investicnikalkulacka/", destination: "/investicnikalkulacka", permanent: true },
      { source: "/zivotnikalkulacka/", destination: "/zivotnikalkulacka", permanent: true },
      { source: "/penzijnikalkulacka/", destination: "/penzijnikalkulacka", permanent: true },
      { source: "/kariera/", destination: "/kariera", permanent: true },
    ];
  },
  async headers() {
    const global = [
      ...securityHeaders,
      ...(process.env.NODE_ENV === "production"
        ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
        : []),
    ];
    return [
      { source: "/:path*", headers: global },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
      {
        source: "/login",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
      {
        source: "/auth/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  images: {
    qualities: [75, 78, 82],
    ...(supabaseHost
      ? {
          remotePatterns: [
            {
              protocol: "https",
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ],
        }
      : {}),
  },
};

export default nextConfig;

import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import { BookOpen, ShieldCheck, TrendingUp, Users } from "lucide-react";
import {
  RECRUITMENT_BENTO_BENEFITS,
  RECRUITMENT_BENTO_INTRO,
  RECRUITMENT_CHALLENGE_CARD,
  RECRUITMENT_WHY_TEAM_PHOTO,
  type BentoBenefitIcon,
  type RecruitmentBentoBenefit,
} from "@/components/recruitment/recruitment-data";

/** Lucide-compatible map pin — místo `MapPin` z barrelu (kvůli `optimizePackageImports` může být undefined). */
function MapPinGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

const ICONS: Record<
  BentoBenefitIcon,
  ComponentType<{ size?: number; className?: string; strokeWidth?: number; color?: string }>
> = {
  trending: TrendingUp,
  users: Users,
  book: BookOpen,
  shield: ShieldCheck,
};

function BentoIcon({ name, theme }: { name: BentoBenefitIcon; theme: "light" | "dark" }) {
  const Cmp = ICONS[name];
  if (name === "trending") {
    return <Cmp size={28} className="text-brand-gold" strokeWidth={1.5} aria-hidden />;
  }
  if (name === "shield") {
    return <Cmp size={28} className="text-brand-cyan" strokeWidth={1.5} aria-hidden />;
  }
  const color = theme === "dark" ? "#4FC6F2" : "#1D2354";
  return <Cmp size={28} color={color} strokeWidth={1.5} aria-hidden />;
}

function iconBox(b: RecruitmentBentoBenefit) {
  return (
    <div
      className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
      style={{
        backgroundColor: b.theme === "dark" ? "rgba(79, 198, 242, 0.1)" : "#EAF3FF",
        border: b.theme === "dark" ? "1px solid rgba(79, 198, 242, 0.2)" : undefined,
      }}
    >
      <BentoIcon name={b.icon} theme={b.theme} />
    </div>
  );
}

export function RecruitmentLpBentoBenefits() {
  return (
    <section className="relative z-20 py-16 md:py-24" aria-labelledby="kariera-proc">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col items-center">
          <h2
            id="kariera-proc"
            className="mb-8 text-center text-4xl font-extrabold tracking-tight text-brand-text md:mb-10 md:text-5xl"
          >
            {RECRUITMENT_BENTO_INTRO.title}
          </h2>

          <figure className="relative mb-10 w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-brand-border bg-white shadow-[0_24px_60px_-24px_rgba(29,35,84,0.25)] md:mb-12 md:rounded-[2rem]">
            <Image
              src={RECRUITMENT_WHY_TEAM_PHOTO.src}
              alt={RECRUITMENT_WHY_TEAM_PHOTO.alt}
              width={RECRUITMENT_WHY_TEAM_PHOTO.width}
              height={RECRUITMENT_WHY_TEAM_PHOTO.height}
              className="h-auto w-full object-cover object-center"
              sizes="(min-width: 1024px) 896px, 100vw"
              priority={false}
            />
          </figure>

          <article
            className="w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-[#2A3366] bg-gradient-to-br from-[#0a0f29] via-brand-navy to-[#12183a] px-6 py-8 text-left shadow-[0_28px_70px_-28px_rgba(10,15,41,0.55)] md:rounded-[2rem] md:px-10 md:py-10"
            aria-labelledby="kariera-vyzva-badge"
          >
            <h3
              id="kariera-vyzva-badge"
              className="mb-6 inline-block rounded-md bg-brand-cyan px-4 py-2.5 text-base font-extrabold tracking-tight text-brand-navy md:text-lg"
            >
              {RECRUITMENT_CHALLENGE_CARD.badge}
            </h3>
            <div className="space-y-5 text-base leading-relaxed md:text-lg">
              <p className="font-medium text-sky-200/95">{RECRUITMENT_CHALLENGE_CARD.intro}</p>
              <p className="font-medium text-sky-200/95">{RECRUITMENT_CHALLENGE_CARD.offers}</p>
              <p className="font-medium text-white">{RECRUITMENT_CHALLENGE_CARD.requirements}</p>
              <p className="font-medium text-white">{RECRUITMENT_CHALLENGE_CARD.cta}</p>
            </div>
            <p className="mt-8 flex flex-wrap items-start gap-2 border-t border-white/10 pt-6 text-sm font-medium text-sky-200/90 md:text-base">
              <MapPinGlyph className="mt-0.5 h-5 w-5 shrink-0 text-brand-cyan" />
              <span>
                <span className="font-semibold text-brand-cyan">{RECRUITMENT_CHALLENGE_CARD.branchesLabel}</span>{" "}
                {RECRUITMENT_CHALLENGE_CARD.branches}
              </span>
            </p>
          </article>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {RECRUITMENT_BENTO_BENEFITS.map((b, idx) => {
            const isBrandCard = b.theme === "dark" && b.showPbWatermark;

            return (
              <div
                key={idx}
                className={`group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[2rem] p-10 transition-all duration-500 hover:-translate-y-1 ${
                  b.theme === "light" ? "border border-brand-border bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.03)]" : ""
                }`}
                style={
                  b.theme === "dark"
                    ? {
                        background: "linear-gradient(145deg, #1D2354, #0A0F29)",
                        color: "white",
                        boxShadow: "0 20px 40px -10px rgba(10, 15, 41, 0.4)",
                        border: "1px solid #2A3366",
                      }
                    : undefined
                }
              >
                {b.theme === "light" && (
                  <div
                    className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                    style={{
                      background:
                        b.accent === "gold"
                          ? "radial-gradient(circle at 100% 100%, #fbbf24, transparent)"
                          : b.accent === "cyan"
                            ? "radial-gradient(circle at 100% 100%, #4FC6F2, transparent)"
                            : "radial-gradient(circle at 100% 100%, #1D2354, transparent)",
                    }}
                    aria-hidden
                  />
                )}

                {b.theme === "dark" && (
                  <div
                    className="pointer-events-none absolute -right-24 -top-24 z-0 h-64 w-64 rounded-full opacity-20 blur-3xl"
                    style={{ backgroundColor: "#4FC6F2" }}
                    aria-hidden
                  />
                )}

                <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden rounded-[inherit]" aria-hidden>
                  <div
                    className={`absolute inset-y-0 -left-1/3 w-2/3 bg-gradient-to-r from-transparent to-transparent animate-shimmer ${
                      b.theme === "dark" ? "via-white/[0.12]" : "via-white/45"
                    }`}
                    style={{ animationDelay: `${idx * 0.35}s` }}
                  />
                </div>

                {isBrandCard ? (
                  <div
                    className="pointer-events-none absolute right-3 top-3 z-[3] select-none sm:right-4 sm:top-4 md:right-5 md:top-5"
                    aria-hidden
                  >
                    <Image
                      src="/img/logos/pb-logo-no-bg.png"
                      alt=""
                      width={512}
                      height={512}
                      sizes="(min-width: 768px) 200px, 148px"
                      className="h-auto w-[min(9.25rem,42vw)] max-w-[148px] object-contain object-right object-top brightness-0 invert sm:max-w-[168px] md:w-44 md:max-w-[200px] md:opacity-95"
                    />
                  </div>
                ) : null}

                <div className={`relative z-10 ${isBrandCard ? "pr-[min(10rem,38vw)] sm:pr-40 md:pr-44" : ""}`}>
                  {iconBox(b)}
                  <h3
                    className={`mb-4 text-2xl font-extrabold tracking-tight md:text-3xl ${
                      b.theme === "dark" ? "text-white" : "text-brand-navy"
                    }`}
                  >
                    {b.title}
                  </h3>
                </div>
                <p
                  className={`relative z-10 text-base font-medium leading-relaxed md:text-lg ${
                    b.theme === "dark" ? "text-slate-300" : "text-slate-500"
                  } ${isBrandCard ? "pr-[min(10rem,38vw)] sm:pr-40 md:pr-44" : ""}`}
                >
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

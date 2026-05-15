import type { ComponentType } from "react";
import Image from "next/image";
import { BookOpen, ShieldCheck, TrendingUp, Users } from "lucide-react";
import {
  RECRUITMENT_BENTO_BENEFITS,
  RECRUITMENT_BENEFITS_SECTION,
  type BentoBenefitIcon,
  type RecruitmentBentoBenefit,
} from "@/components/recruitment/recruitment-data";

const NAVY_DEEP = "#07122F";

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
  const color = theme === "dark" ? "#4FC6F2" : NAVY_DEEP;
  return <Cmp size={28} color={color} strokeWidth={1.5} aria-hidden />;
}

function iconBox(b: RecruitmentBentoBenefit) {
  return (
    <div
      className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 sm:mb-8"
      style={{
        backgroundColor: b.theme === "dark" ? "rgba(79, 198, 242, 0.1)" : "#EAF3FF",
        border: b.theme === "dark" ? "1px solid rgba(79, 198, 242, 0.2)" : undefined,
      }}
    >
      <BentoIcon name={b.icon} theme={b.theme} />
    </div>
  );
}

export function RecruitmentLpBenefitsGrid() {
  return (
    <section className="relative z-10 py-14 md:py-20" aria-labelledby="kariera-benefity">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <h2
            id="kariera-benefity"
            className="mb-4 text-3xl font-extrabold tracking-tight text-[#07122F] text-balance md:text-4xl lg:text-5xl"
          >
            {RECRUITMENT_BENEFITS_SECTION.title}
          </h2>
          <p className="text-lg leading-relaxed text-slate-600 text-pretty">{RECRUITMENT_BENEFITS_SECTION.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {RECRUITMENT_BENTO_BENEFITS.map((b, idx) => {
            const isBrandCard = b.theme === "dark" && b.showPbWatermark;

            return (
              <div
                key={`${b.title}-${idx}`}
                className={`group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[2rem] p-6 sm:p-10 transition-all duration-500 hover:-translate-y-1 ${
                  b.theme === "light" ? "border border-brand-border bg-white shadow-[0_14px_40px_-18px_rgba(7,18,47,0.12)]" : ""
                }`}
                style={
                  b.theme === "dark"
                    ? {
                        background: `linear-gradient(145deg, ${NAVY_DEEP} 0%, #1D2354 52%, #0A0F29)`,
                        color: "white",
                        boxShadow: "0 22px 48px -14px rgba(7, 18, 47, 0.55)",
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
                            : `radial-gradient(circle at 100% 100%, ${NAVY_DEEP}, transparent)`,
                    }}
                    aria-hidden
                  />
                )}

                {b.theme === "dark" && (
                  <div
                    className="pointer-events-none absolute -right-24 -top-24 z-0 h-64 w-64 rounded-full opacity-25 blur-3xl"
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
                      sizes="(min-width: 640px) 168px, 72px"
                      className="h-auto w-16 object-contain object-right object-top brightness-0 invert opacity-95 sm:w-[min(9.25rem,42vw)] sm:max-w-[168px] md:w-44 md:max-w-[200px]"
                    />
                  </div>
                ) : null}

                <div className={`relative z-10 ${isBrandCard ? "pr-20 sm:pr-40 md:pr-44" : ""}`}>
                  {iconBox(b)}
                  <h3
                    className={`mb-3 text-xl font-extrabold tracking-tight text-balance sm:mb-4 sm:text-2xl md:text-3xl ${
                      b.theme === "dark" ? "text-white" : "text-[#07122F]"
                    }`}
                  >
                    {b.title}
                  </h3>
                </div>
                <p
                  className={`relative z-10 text-base font-medium leading-snug text-pretty sm:text-lg sm:leading-relaxed ${
                    b.theme === "dark" ? "text-slate-300" : "text-slate-500"
                  } ${isBrandCard ? "pr-20 sm:pr-40 md:pr-44" : ""}`}
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

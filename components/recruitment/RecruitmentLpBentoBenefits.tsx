import type { ComponentType } from "react";
import Image from "next/image";
import { BookOpen, ShieldCheck, TrendingUp, Users } from "lucide-react";
import {
  RECRUITMENT_BENTO_BENEFITS,
  RECRUITMENT_BENTO_INTRO,
  type BentoBenefitIcon,
  type RecruitmentBentoBenefit,
} from "@/components/recruitment/recruitment-data";

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
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 id="kariera-proc" className="mb-6 text-4xl font-extrabold tracking-tight text-brand-text md:text-5xl">
            {RECRUITMENT_BENTO_INTRO.title}
          </h2>
          <p className="max-w-2xl text-lg text-slate-500">{RECRUITMENT_BENTO_INTRO.subtitle}</p>
        </div>

        <div className="grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-6 md:grid-cols-3">
          {RECRUITMENT_BENTO_BENEFITS.map((b, idx) => {
            const isBrandCard = b.theme === "dark" && b.showPbWatermark;

            return (
              <div
                key={idx}
                className={`${b.colSpan} group relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-10 transition-all duration-500 hover:-translate-y-1 ${
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
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10"
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
                    className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
                    style={{ backgroundColor: "#4FC6F2" }}
                    aria-hidden
                  />
                )}

                {isBrandCard ? (
                  <div
                    className="pointer-events-none absolute right-3 top-3 z-0 select-none sm:right-4 sm:top-4 md:right-5 md:top-5"
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

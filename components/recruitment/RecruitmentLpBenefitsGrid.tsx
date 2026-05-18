import Image from "next/image";
import {
  KIconBookOpen,
  KIconShieldCheck,
  KIconTrendingUp,
  KIconUsers,
} from "@/components/recruitment/kariera-ui-icons";
import {
  RECRUITMENT_BENTO_BENEFITS,
  RECRUITMENT_BENEFITS_SECTION,
  type BentoBenefitIcon,
  type RecruitmentBentoBenefit,
} from "@/components/recruitment/recruitment-data";

/** Světlé ikony — stejný odstín jako dřívější bento (#1D2354 / brand-navy) */
const ICON_NAVY = "#1D2354";

function BentoIcon({ name, theme }: { name: BentoBenefitIcon; theme: "light" | "dark" }) {
  const stroke = 1.5;
  const sz = 28;
  if (name === "trending") {
    return <KIconTrendingUp size={sz} strokeWidth={stroke} className="text-brand-gold" aria-hidden />;
  }
  if (name === "shield") {
    return <KIconShieldCheck size={sz} strokeWidth={stroke} className="text-brand-cyan" aria-hidden />;
  }
  const color = theme === "dark" ? "#4FC6F2" : ICON_NAVY;
  if (name === "users") {
    return <KIconUsers size={sz} strokeWidth={stroke} style={{ color }} aria-hidden />;
  }
  return <KIconBookOpen size={sz} strokeWidth={stroke} style={{ color }} aria-hidden />;
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

        {/* Bento: max. 2 sloupce (2×2 + poslední řádek); bez xl:grid-cols-3 */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2">
          {RECRUITMENT_BENTO_BENEFITS.map((b, idx) => {
            const isBrandCard = b.theme === "dark" && b.showPbWatermark;
            const isLast = idx === RECRUITMENT_BENTO_BENEFITS.length - 1;

            return (
              <div
                key={`${b.title}-${idx}`}
                className={`group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[2rem] p-6 sm:p-10 transition-all duration-500 hover:-translate-y-1 ${
                  b.theme === "light"
                    ? "border border-brand-border bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.03)]"
                    : ""
                } ${isLast ? "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-4xl" : ""}`}
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
                      sizes="(min-width: 640px) 168px, 72px"
                      className="h-auto w-16 object-contain object-right object-top brightness-0 invert opacity-95 sm:w-[min(9.25rem,42vw)] sm:max-w-[168px] md:w-44 md:max-w-[200px]"
                    />
                  </div>
                ) : null}

                <div className={`relative z-10 ${isBrandCard ? "pr-20 sm:pr-40 md:pr-44" : ""}`}>
                  {iconBox(b)}
                  <h3
                    className={`mb-4 text-2xl font-extrabold tracking-tight text-balance md:text-3xl ${
                      b.theme === "dark" ? "text-white" : "text-brand-navy"
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

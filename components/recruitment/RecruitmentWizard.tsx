"use client";

import Link from "next/link";
import { CheckCircle2, Mail, Phone, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { submitRecruitmentApplication } from "@/app/actions/recruitment";
import { legalConfig } from "@/config/legal";
import { siteConfig } from "@/config/site";
import {
  CONTACT_STEP_COPY,
  WIZARD_STEPS,
  WIZARD_SUCCESS_COPY,
  type WizardQuestionStep,
} from "@/components/recruitment/recruitment-data";
import { pageUrl } from "@/lib/forms/page-url";

export type WizardAnswers = Record<string, string | { choice: string; other?: string }>;

const BRAND_NAVY_LIGHT = "#2A3366";
const BRAND_CYAN = "#4FC6F2";
const AUTO_ADVANCE_MS = 400;

function isChoiceOther(s: WizardQuestionStep): s is Extract<WizardQuestionStep, { kind: "choice-other" }> {
  return s.kind === "choice-other";
}

export function RecruitmentWizard() {
  const totalQuestionSteps = WIZARD_STEPS.length;
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>({});
  const [selectedOptionValue, setSelectedOptionValue] = useState<string | null>(null);
  const [customInputText, setCustomInputText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = stepIndex < totalQuestionSteps ? WIZARD_STEPS[stepIndex] : null;
  const progressPercent = (stepIndex / totalQuestionSteps) * 100;

  const clearAdvanceTimer = () => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  };

  useEffect(() => () => clearAdvanceTimer(), []);

  const commitAndGoNext = useCallback(
    (step: WizardQuestionStep, choiceValue: string, otherText?: string) => {
      setAnswers((prev) => {
        const next = { ...prev };
        if (isChoiceOther(step) && choiceValue === step.otherOptionValue && otherText?.trim()) {
          next[step.id] = { choice: choiceValue, other: otherText.trim() };
        } else if (isChoiceOther(step) && choiceValue === step.otherOptionValue) {
          next[step.id] = { choice: choiceValue };
        } else {
          const opt = step.options.find((o) => o.value === choiceValue);
          next[step.id] = opt?.label ?? choiceValue;
        }
        return next;
      });
      setSelectedOptionValue(null);
      setCustomInputText("");
      setStepIndex((i) => i + 1);
    },
    []
  );

  const handleOptionSelect = (optionValue: string) => {
    if (!currentQuestion) return;
    setSelectedOptionValue(optionValue);
    setError(null);
    clearAdvanceTimer();

    if (isChoiceOther(currentQuestion) && optionValue === currentQuestion.otherOptionValue) {
      return;
    }

    advanceTimerRef.current = setTimeout(() => {
      commitAndGoNext(currentQuestion, optionValue);
      advanceTimerRef.current = null;
    }, AUTO_ADVANCE_MS);
  };

  const handleCustomInputSubmit = () => {
    if (!currentQuestion || !isChoiceOther(currentQuestion)) return;
    if (customInputText.trim() === "") return;
    clearAdvanceTimer();
    commitAndGoNext(currentQuestion, currentQuestion.otherOptionValue, customInputText);
  };

  const onSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const contact = [`e-mail: ${email.trim()}`, `tel: ${phone.trim()}`].join(", ");
      const result = await submitRecruitmentApplication({
        name: name.trim(),
        contact,
        message: undefined,
        consent: consent === true,
        pageHref: pageUrl(),
        wizardAnswers: answers,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setDone(true);
    } catch {
      setError("Nepodařilo se odeslat. Zkuste to prosím znovu.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (stepIndex >= totalQuestionSteps) return;
    const q = WIZARD_STEPS[stepIndex];
    const existing = answers[q.id];
    if (typeof existing === "string") {
      const match = q.options.find((o) => o.label === existing);
      setSelectedOptionValue(match?.value ?? null);
      setCustomInputText("");
    } else if (existing && typeof existing === "object" && "choice" in existing) {
      setSelectedOptionValue(existing.choice);
      setCustomInputText(existing.other ?? "");
    } else {
      setSelectedOptionValue(null);
      setCustomInputText("");
    }
  }, [stepIndex, totalQuestionSteps, answers]);

  if (done) {
    return (
      <div className="animate-in fade-in zoom-in py-12 text-center duration-700 md:py-16">
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full">
          <div className="absolute inset-0 animate-ping rounded-full opacity-20" style={{ backgroundColor: BRAND_CYAN }} aria-hidden />
          <div
            className="relative flex h-full w-full items-center justify-center rounded-full"
            style={{
              backgroundColor: "rgba(79,198,242,0.1)",
              border: `1px solid ${BRAND_CYAN}`,
            }}
          >
            <CheckCircle2 size={48} color={BRAND_CYAN} strokeWidth={2} aria-hidden />
          </div>
        </div>
        <h3 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl">{WIZARD_SUCCESS_COPY.title}</h3>
        <p className="mx-auto max-w-lg text-lg font-light leading-relaxed text-slate-300 md:text-xl">{WIZARD_SUCCESS_COPY.body}</p>
        <p className="mx-auto mt-6 max-w-md text-sm text-slate-400">
          Spěchá to? Napište na{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="font-semibold text-brand-cyan hover:underline">
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  if (stepIndex >= totalQuestionSteps) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-12 text-center">
          <h3 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">{CONTACT_STEP_COPY.title}</h3>
          <p className="text-lg text-slate-400">{CONTACT_STEP_COPY.subtitle}</p>
        </div>

        <form onSubmit={onSubmitContact} className="mx-auto max-w-md space-y-6">
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
              <User size={20} className="text-slate-500 transition-colors group-focus-within:text-brand-cyan" aria-hidden />
            </div>
            <input
              required
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Jan Novák"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-brand-navyLight bg-[#1D2354]/40 py-4 pl-14 pr-5 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-slate-500 focus:outline-none"
              style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)" }}
              onFocus={(e) => {
                e.target.style.borderColor = BRAND_CYAN;
                e.target.style.boxShadow = "0 0 0 4px rgba(79,198,242,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = BRAND_NAVY_LIGHT;
                e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.1)";
              }}
            />
          </div>

          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
              <Mail size={20} className="text-slate-500 transition-colors group-focus-within:text-brand-cyan" aria-hidden />
            </div>
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              placeholder="jan@email.cz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-brand-navyLight bg-[#1D2354]/40 py-4 pl-14 pr-5 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-slate-500 focus:outline-none"
              style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)" }}
              onFocus={(e) => {
                e.target.style.borderColor = BRAND_CYAN;
                e.target.style.boxShadow = "0 0 0 4px rgba(79,198,242,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = BRAND_NAVY_LIGHT;
                e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.1)";
              }}
            />
          </div>

          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
              <Phone size={20} className="text-slate-500 transition-colors group-focus-within:text-brand-cyan" aria-hidden />
            </div>
            <input
              required
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder="+420 123 456 789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl border border-brand-navyLight bg-[#1D2354]/40 py-4 pl-14 pr-5 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-slate-500 focus:outline-none"
              style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)" }}
              onFocus={(e) => {
                e.target.style.borderColor = BRAND_CYAN;
                e.target.style.boxShadow = "0 0 0 4px rgba(79,198,242,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = BRAND_NAVY_LIGHT;
                e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.1)";
              }}
            />
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input
              id="wiz-consent"
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-brand-navyLight bg-[#1D2354]/40 text-brand-cyan focus:ring-brand-cyan"
            />
            <label htmlFor="wiz-consent" className="text-left text-sm text-slate-400">
              Souhlasím se zpracováním osobních údajů v rámci náboru.{" "}
              <Link href="/gdpr" className="font-semibold text-brand-cyan hover:underline">
                Webové zásady
              </Link>
              , partner:{" "}
              <a
                href={legalConfig.partnerPrivacyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-cyan hover:underline"
              >
                BEplan
              </a>
              .
            </label>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="pt-4">
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-2xl py-5 text-lg font-bold text-[#0A0F29] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(79,198,242,0.3)] disabled:opacity-60"
              style={{ background: `linear-gradient(90deg, ${BRAND_CYAN}, #7ce0ff)` }}
            >
              {busy ? "Odesílám…" : "Odeslat kontakt"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="relative z-10 transition-all">
      <div className="mb-12">
        <div className="mb-3 flex items-end justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-cyan">
            Krok {stepIndex + 1} z {totalQuestionSteps}
          </span>
          <span className="text-xs font-semibold text-slate-400">{Math.round(progressPercent)} %</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#1D2354] shadow-inner">
          <div
            className="relative h-full rounded-full transition-all duration-700 ease-out"
            style={{ backgroundColor: BRAND_CYAN, boxShadow: `0 0 10px ${BRAND_CYAN}`, width: `${progressPercent}%` }}
          >
            <div className="absolute bottom-0 right-0 top-0 w-10 animate-pulse bg-white/30 blur-[2px]" aria-hidden />
          </div>
        </div>
      </div>

      <div className="mb-10 flex items-center">
        <h3 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl">{currentQuestion.question}</h3>
      </div>

      <div className="space-y-4">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOptionValue === option.value;
          const showOtherBlock =
            isChoiceOther(currentQuestion) && isSelected && option.value === currentQuestion.otherOptionValue;

          return (
            <div key={option.value} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 75}ms` }}>
              <button
                type="button"
                onClick={() => handleOptionSelect(option.value)}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl px-6 py-5 text-left outline-none backdrop-blur-sm transition-all duration-300"
                style={{
                  backgroundColor: isSelected ? "rgba(79, 198, 242, 0.05)" : "rgba(29, 35, 84, 0.4)",
                  border: `1px solid ${isSelected ? BRAND_CYAN : BRAND_NAVY_LIGHT}`,
                  boxShadow: isSelected ? "0 0 20px rgba(79, 198, 242, 0.15), inset 0 0 10px rgba(79, 198, 242, 0.05)" : "none",
                }}
              >
                <div className="pointer-events-none absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className={`relative text-lg font-medium transition-colors ${isSelected ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
                  {option.label}
                </span>
                <div
                  className="relative ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    border: `2px solid ${isSelected ? BRAND_CYAN : "#475569"}`,
                    backgroundColor: isSelected ? "rgba(79, 198, 242, 0.1)" : "transparent",
                  }}
                >
                  <div
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${isSelected ? "scale-100" : "scale-0"}`}
                    style={{ backgroundColor: BRAND_CYAN, boxShadow: `0 0 8px ${BRAND_CYAN}` }}
                  />
                </div>
              </button>

              {showOtherBlock && isChoiceOther(currentQuestion) && (
                <div className="ml-2 mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex flex-col gap-3 rounded-2xl border border-[#2A3366] bg-[#1D2354]/30 p-2 sm:flex-row">
                    <input
                      type="text"
                      autoFocus
                      placeholder={currentQuestion.otherPlaceholder ?? currentQuestion.otherLabel}
                      value={customInputText}
                      onChange={(e) => setCustomInputText(e.target.value)}
                      className="flex-1 bg-transparent px-5 py-3 text-white placeholder:text-slate-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCustomInputSubmit}
                      disabled={customInputText.trim() === ""}
                      className="rounded-xl px-8 py-3 font-bold text-[#0A0F29] transition-all hover:shadow-[0_0_15px_rgba(79,198,242,0.4)] disabled:cursor-not-allowed disabled:opacity-30"
                      style={{ background: BRAND_CYAN }}
                    >
                      Potvrdit
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </div>
  );
}

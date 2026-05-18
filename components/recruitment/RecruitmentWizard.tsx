"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  KIconArrowLeft,
  KIconCircleCheck,
  KIconMail,
  KIconPhone,
  KIconUser,
} from "@/components/recruitment/kariera-ui-icons";
import { submitRecruitmentApplication } from "@/app/actions/recruitment";
import { legalConfig } from "@/config/legal";
import { siteConfig } from "@/config/site";
import {
  CONTACT_STEP_COPY,
  WIZARD_STEPS,
  WIZARD_SUBMIT_LABEL,
  WIZARD_SUCCESS_COPY,
  type WizardQuestionStep,
} from "@/components/recruitment/recruitment-data";
import { pageUrl } from "@/lib/forms/page-url";

export type WizardAnswers = Record<string, string | { choice: string; other?: string }>;

const BRAND_NAVY_LIGHT = "#2A3366";
const BRAND_CYAN = "#4FC6F2";
const AUTO_ADVANCE_MS = 420;

const TOTAL_FLOW_STEPS = 7;

function isChoiceOther(s: WizardQuestionStep): s is Extract<WizardQuestionStep, { kind: "choice-other" }> {
  return s.kind === "choice-other";
}

function validateContactFields(input: {
  name: string;
  email: string;
  phone: string;
  consent: boolean;
}): string | null {
  if (input.name.trim().length < 2) {
    return "Prosím zadej celé jméno — ať vím, jak se k tobě mám hlásit.";
  }
  const em = input.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    return "E-mail vypadá neplatně — zkontroluj prosím překlepy (např. @ a doménu).";
  }
  const digits = input.phone.replace(/\D/g, "");
  if (digits.length < 9) {
    return "Telefon potřebuju na zpětný kontakt — stačí aspoň 9 číslic (s předvolbou nebo bez).";
  }
  if (!input.consent) {
    return "Bez souhlasu se zpracováním údajů to teď nepošlu — jde o GDPR a chrání nás oba.";
  }
  return null;
}

function friendlyServerError(raw: string): string {
  const t = raw.trim();
  if (/Souhlas se zpracováním/i.test(t)) return t;
  if (/Jméno je povinné/i.test(t)) return "Prosím vyplň jméno.";
  if (/Kontakt je povinný/i.test(t)) return "Prosím vyplň e-mail i telefon.";
  if (/Neplatný odkaz/i.test(t)) return t;
  if (/RESEND|nakonfigurováno|Production/i.test(t)) {
    return "Formulář teď nejde technicky odeslat. Napiš mi prosím přímo na " + siteConfig.contactEmail + ".";
  }
  if (/doménu|RESEND_FROM|verify/i.test(t)) {
    return "Odesílání máme zrovna v údržbě. Ozvi se prosím na " + siteConfig.contactEmail + ".";
  }
  return "Nepodařilo se to hned odeslat — zkus to prosím za minutu znovu, nebo mi napiš na " + siteConfig.contactEmail + ".";
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
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onContactStep = stepIndex >= totalQuestionSteps;
  const currentQuestion = !onContactStep ? WIZARD_STEPS[stepIndex] : null;

  const progressPercent =
    stepIndex >= totalQuestionSteps ? 100 : Math.min(100, ((stepIndex + 1) / TOTAL_FLOW_STEPS) * 100);

  const stepLabel =
    stepIndex >= totalQuestionSteps
      ? `Krok ${TOTAL_FLOW_STEPS} z ${TOTAL_FLOW_STEPS}`
      : `Krok ${stepIndex + 1} z ${TOTAL_FLOW_STEPS}`;

  const clearAdvanceTimer = () => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  };

  useEffect(() => () => clearAdvanceTimer(), []);

  const commitAndGoNext = useCallback((step: WizardQuestionStep, choiceValue: string, otherText?: string) => {
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
  }, []);

  const handleGoBack = () => {
    clearAdvanceTimer();
    setError(null);
    setStepIndex((i) => Math.max(0, i - 1));
  };

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

    const clientErr = validateContactFields({ name, email, phone, consent });
    if (clientErr) {
      setError(clientErr);
      return;
    }

    setBusy(true);
    try {
      const contact = [`e-mail: ${email.trim()}`, `tel: ${phone.trim()}`].join(", ");
      const result = await submitRecruitmentApplication({
        name: name.trim(),
        contact,
        message: note.trim() ? note.trim().slice(0, 4000) : undefined,
        consent: consent === true,
        pageHref: pageUrl(),
        wizardAnswers: answers,
      });
      if (!result.ok) {
        setError(friendlyServerError(result.message));
        return;
      }
      setDone(true);
    } catch {
      setError("Teď se nepodařilo spojit se serverem — zkus to prosím za chvíli znovu.");
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
      <div className="animate-in fade-in zoom-in py-10 text-center duration-700 md:py-14">
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full">
          <div className="absolute inset-0 animate-ping rounded-full opacity-20" style={{ backgroundColor: BRAND_CYAN }} aria-hidden />
          <div
            className="relative flex h-full w-full items-center justify-center rounded-full"
            style={{
              backgroundColor: "rgba(79,198,242,0.1)",
              border: `1px solid ${BRAND_CYAN}`,
            }}
          >
            <KIconCircleCheck size={48} strokeWidth={2} style={{ color: BRAND_CYAN }} aria-hidden />
          </div>
        </div>
        <h3 className="mb-6 text-3xl font-extrabold tracking-tight text-white text-balance md:text-4xl lg:text-5xl">
          {WIZARD_SUCCESS_COPY.title}
        </h3>
        <p className="mx-auto max-w-xl text-lg font-normal leading-relaxed text-slate-300 text-pretty md:text-xl">
          {WIZARD_SUCCESS_COPY.body}
        </p>
        <p className="mx-auto mt-8 max-w-md text-sm text-slate-400">
          Spěchá to? Napiš mi na{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="font-semibold text-brand-cyan hover:underline">
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  if (onContactStep) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-10">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <span className="text-sm font-bold uppercase tracking-wide text-brand-cyan">{stepLabel}</span>
            <span className="text-sm font-semibold text-slate-300">{Math.round(progressPercent)} %</span>
          </div>
          <div className="h-3.5 overflow-hidden rounded-full border border-white/10 bg-[#07122F]/90 shadow-inner">
            <div
              className="relative h-full rounded-full transition-all duration-700 ease-out"
              style={{
                backgroundColor: BRAND_CYAN,
                boxShadow: `0 0 16px ${BRAND_CYAN}`,
                width: `${progressPercent}%`,
              }}
            >
              <div className="absolute bottom-0 right-0 top-0 w-14 animate-pulse bg-white/25 blur-[3px]" aria-hidden />
            </div>
          </div>
        </div>

        <div className="mb-10 text-center">
          <h3 className="mb-3 text-2xl font-extrabold tracking-tight text-white text-balance md:text-3xl lg:text-4xl">
            {CONTACT_STEP_COPY.title}
          </h3>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-slate-400 text-pretty md:text-lg">{CONTACT_STEP_COPY.subtitle}</p>
        </div>

        <form onSubmit={onSubmitContact} className="mx-auto max-w-lg space-y-5">
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
              <KIconUser size={20} className="text-slate-500 transition-colors group-focus-within:text-brand-cyan" aria-hidden />
            </div>
            <input
              required
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Jméno a příjmení"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-brand-navyLight bg-[#07122F]/50 py-4 pl-14 pr-5 text-white backdrop-blur-sm transition-all placeholder:text-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan/15"
            />
          </div>

          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
              <KIconMail size={20} className="text-slate-500 transition-colors group-focus-within:text-brand-cyan" aria-hidden />
            </div>
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-brand-navyLight bg-[#07122F]/50 py-4 pl-14 pr-5 text-white backdrop-blur-sm transition-all placeholder:text-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan/15"
            />
          </div>

          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
              <KIconPhone size={20} className="text-slate-500 transition-colors group-focus-within:text-brand-cyan" aria-hidden />
            </div>
            <input
              required
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder="Telefon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl border border-brand-navyLight bg-[#07122F]/50 py-4 pl-14 pr-5 text-white backdrop-blur-sm transition-all placeholder:text-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan/15"
            />
          </div>

          <div>
            <label htmlFor="wiz-note" className="mb-2 block text-left text-sm font-semibold text-slate-300">
              Poznámka <span className="font-normal text-slate-500">(volitelné)</span>
            </label>
            <textarea
              id="wiz-note"
              name="note"
              rows={4}
              placeholder="Třeba aktuální situaci nebo dotaz — pomůže mi to připravit si první hovor."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full resize-y rounded-2xl border border-brand-navyLight bg-[#07122F]/50 px-5 py-4 text-white backdrop-blur-sm transition-all placeholder:text-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan/15"
            />
          </div>

          <div className="flex items-start gap-3 pt-1">
            <input
              id="wiz-consent"
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-brand-navyLight bg-[#07122F]/60 text-brand-cyan focus:ring-brand-cyan"
            />
            <label htmlFor="wiz-consent" className="text-left text-sm leading-relaxed text-slate-400">
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

          {error && (
            <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-left text-sm leading-relaxed text-amber-50">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleGoBack}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
            >
              <KIconArrowLeft className="h-4 w-4" size={16} aria-hidden />
              Zpět
            </button>
            <button
              type="submit"
              disabled={busy}
              className="min-h-[52px] flex-1 rounded-2xl py-4 text-base font-bold text-[#07122F] transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(79,198,242,0.35)] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[240px] sm:flex-none sm:px-10"
              style={{ background: `linear-gradient(90deg, ${BRAND_CYAN}, #7ce0ff)` }}
            >
              {busy ? "Odesílám…" : WIZARD_SUBMIT_LABEL}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="relative z-10 transition-all">
      <div className="mb-10">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <span className="text-sm font-bold uppercase tracking-wide text-brand-cyan">{stepLabel}</span>
          <span className="text-sm font-semibold text-slate-300">{Math.round(progressPercent)} %</span>
        </div>
        <div className="h-3.5 overflow-hidden rounded-full border border-white/10 bg-[#07122F]/90 shadow-inner">
          <div
            className="relative h-full rounded-full transition-all duration-700 ease-out"
            style={{
              backgroundColor: BRAND_CYAN,
              boxShadow: `0 0 16px ${BRAND_CYAN}`,
              width: `${progressPercent}%`,
            }}
          >
            <div className="absolute bottom-0 right-0 top-0 w-14 animate-pulse bg-white/25 blur-[3px]" aria-hidden />
          </div>
        </div>
      </div>

      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        {stepIndex > 0 ? (
          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
          >
            <KIconArrowLeft className="h-4 w-4" size={16} aria-hidden />
            Zpět
          </button>
        ) : (
          <span className="text-sm text-slate-500">Nezávazné ověření · bez tlaku</span>
        )}
      </div>

      <div className="mb-8 md:mb-10">
        <h3 className="text-2xl font-extrabold leading-snug tracking-tight text-white text-balance md:text-3xl lg:text-4xl">
          {currentQuestion.question}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOptionValue === option.value;
          const showOtherBlock =
            isChoiceOther(currentQuestion) && isSelected && option.value === currentQuestion.otherOptionValue;

          return (
            <div key={option.value} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 60}ms` }}>
              <button
                type="button"
                onClick={() => handleOptionSelect(option.value)}
                className="group relative flex w-full min-h-[56px] items-center justify-between gap-4 overflow-hidden rounded-3xl px-5 py-5 text-left outline-none backdrop-blur-sm transition-all duration-300 sm:min-h-[64px] sm:px-7 sm:py-6 md:py-7"
                style={{
                  backgroundColor: isSelected ? "rgba(79, 198, 242, 0.08)" : "rgba(7, 18, 47, 0.55)",
                  border: `2px solid ${isSelected ? BRAND_CYAN : BRAND_NAVY_LIGHT}`,
                  boxShadow: isSelected ? "0 0 24px rgba(79, 198, 242, 0.18), inset 0 0 12px rgba(79, 198, 242, 0.06)" : "none",
                }}
              >
                <div className="pointer-events-none absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span
                  className={`relative text-base font-semibold transition-colors sm:text-lg md:text-xl ${
                    isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                  }`}
                >
                  {option.label}
                </span>
                <div
                  className="relative ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    border: `2px solid ${isSelected ? BRAND_CYAN : "#475569"}`,
                    backgroundColor: isSelected ? "rgba(79, 198, 242, 0.12)" : "transparent",
                  }}
                >
                  <div
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${isSelected ? "scale-100" : "scale-0"}`}
                    style={{ backgroundColor: BRAND_CYAN, boxShadow: `0 0 8px ${BRAND_CYAN}` }}
                  />
                </div>
              </button>

              {showOtherBlock && isChoiceOther(currentQuestion) && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex flex-col gap-3 rounded-3xl border border-[#2A3366] bg-[#07122F]/40 p-3 sm:flex-row">
                    <input
                      type="text"
                      autoFocus
                      placeholder={currentQuestion.otherPlaceholder ?? currentQuestion.otherLabel}
                      value={customInputText}
                      onChange={(e) => setCustomInputText(e.target.value)}
                      className="flex-1 rounded-2xl bg-transparent px-5 py-3 text-white placeholder:text-slate-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCustomInputSubmit}
                      disabled={customInputText.trim() === ""}
                      className="rounded-2xl px-8 py-3 font-bold text-[#07122F] transition-all hover:shadow-[0_0_15px_rgba(79,198,242,0.4)] disabled:cursor-not-allowed disabled:opacity-30"
                      style={{ background: BRAND_CYAN }}
                    >
                      Pokračovat
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm leading-relaxed text-amber-50">
          {error}
        </div>
      )}
    </div>
  );
}

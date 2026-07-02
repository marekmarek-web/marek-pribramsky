"use client";

export function CalculatorCurrencyAmount({
  value,
  size = "md",
  prefix,
  suffix = "Kč",
  valueClassName = "text-white",
}: {
  value: string;
  size?: "md" | "lg" | "sm";
  prefix?: string;
  suffix?: string;
  valueClassName?: string;
}) {
  const sizeClass =
    size === "lg"
      ? "text-[1.75rem] sm:text-[2.5rem] font-extrabold"
      : size === "sm"
        ? "text-sm font-bold"
        : "text-[15px] font-bold";

  const suffixClass =
    size === "lg"
      ? "text-sm font-medium text-white/50 shrink-0"
      : "text-[11px] font-semibold text-white/40 shrink-0";

  return (
    <span
      className={`inline-flex flex-nowrap items-baseline gap-x-1 leading-none whitespace-nowrap ${sizeClass} ${valueClassName}`}
    >
      {prefix ? <span className="text-white/70">{prefix}</span> : null}
      <span>{value}</span>
      {suffix ? <span className={suffixClass}>{suffix}</span> : null}
    </span>
  );
}

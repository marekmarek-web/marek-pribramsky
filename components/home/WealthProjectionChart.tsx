"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

function formatCzk(n: number) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(n);
}

export function WealthProjectionChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wealthSvgEl = svgRef.current;
    const wrap = wrapRef.current;
    const tooltip = tooltipRef.current;
    if (!wealthSvgEl || !wrap || !tooltip) return;
    const svgRoot: SVGSVGElement = wealthSvgEl;
    const wrapRoot: HTMLDivElement = wrap;
    const tip = tooltip;

    const labels = ["Start", "2 roky", "4 roky", "6 let", "8 let", "10 let"];
    const averageData = [500000, 505000, 510000, 515000, 520000, 526000];
    const strategyData = [500000, 550000, 650000, 750000, 900000, 1100000];
    const yMin = 500000;
    const yMax = 1100000;
    const w = 400;
    const h = 200;

    function yToCoord(val: number) {
      return h - ((val - yMin) / (yMax - yMin)) * h;
    }
    function xToCoord(i: number) {
      return (i / (strategyData.length - 1)) * w;
    }
    function dataToPathSmooth(data: number[]) {
      let d = "";
      for (let i = 0; i < data.length; i++) {
        const x = xToCoord(i);
        const y = yToCoord(data[i]);
        if (i === 0) d += `M${x},${y}`;
        else {
          const x0 = xToCoord(i - 1);
          const y0 = yToCoord(data[i - 1]);
          const cp1x = x0 + (x - x0) * 0.5;
          const cp2x = x0 + (x - x0) * 0.5;
          d += ` C${cp1x},${y0} ${cp2x},${y} ${x},${y}`;
        }
      }
      return d;
    }

    const pathLine = svgRoot.querySelector<SVGPathElement>("#wealthChartPathLine");
    const pathFill = svgRoot.querySelector<SVGPathElement>("#wealthChartPathFill");
    const pathAvg = svgRoot.querySelector<SVGPathElement>("#wealthChartPathAverage");
    if (!pathLine || !pathFill || !pathAvg) return;

    const lineD = dataToPathSmooth(strategyData);
    const fillD = `${lineD} V${h} H0 Z`;
    pathLine.setAttribute("d", lineD);
    pathFill.setAttribute("d", fillD);
    pathAvg.setAttribute("d", dataToPathSmooth(averageData));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.registerPlugin(ScrollTrigger);
        const pathLen = pathLine.getTotalLength?.() ?? 0;
        if (pathLen) {
          pathLine.style.strokeDasharray = `${pathLen}`;
          pathLine.style.strokeDashoffset = `${pathLen}`;
          gsap.to(pathLine, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: svgRoot,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        }
      }
    }, wrapRoot);

    function onMove(e: MouseEvent) {
      const rect = svgRoot.getBoundingClientRect();
      const wrapRect = wrapRoot.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * w;
      let i = Math.round((x / w) * (strategyData.length - 1));
      i = Math.max(0, Math.min(i, strategyData.length - 1));
      const strat = strategyData[i];
      const avg = averageData[i];
      const diff = strat - avg;
      tip.innerHTML = [
        `<span class="wealth-tip-line wealth-tip-time">${labels[i]}</span>`,
        `<span class="wealth-tip-line">Strategie: <strong>${formatCzk(strat)}</strong></span>`,
        `<span class="wealth-tip-line">Běžný účet: <strong>${formatCzk(avg)}</strong></span>`,
        `<span class="wealth-tip-line wealth-tip-diff">Rozdíl: <strong>${formatCzk(diff)}</strong></span>`,
      ].join("");
      tip.classList.add("visible");
      tip.style.left = `${e.clientX - wrapRect.left}px`;
      tip.style.top = `${e.clientY - wrapRect.top}px`;
    }
    function onLeave() {
      tip.classList.remove("visible");
    }
    wrapRoot.addEventListener("mousemove", onMove);
    wrapRoot.addEventListener("mouseleave", onLeave);

    return () => {
      wrapRoot.removeEventListener("mousemove", onMove);
      wrapRoot.removeEventListener("mouseleave", onLeave);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const chartCard = document.querySelector<HTMLElement>(".chart-card-tilt");
    if (!chartCard || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    chartCard.style.setProperty("--angle", "135deg");
    const onMove = (e: MouseEvent) => {
      const rect = chartCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      chartCard.style.setProperty("--x", `${x}px`);
      chartCard.style.setProperty("--y", `${y}px`);
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * -8;
      chartCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      chartCard.style.setProperty("--angle", `${135 + rotateX - rotateY}deg`);
    };
    const onLeave = () => {
      chartCard.style.transform = "rotateX(0deg) rotateY(0deg)";
      chartCard.style.setProperty("--angle", "135deg");
    };
    chartCard.addEventListener("mousemove", onMove);
    chartCard.addEventListener("mouseleave", onLeave);
    return () => {
      chartCard.removeEventListener("mousemove", onMove);
      chartCard.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const milestoneIdx = [0, 3, 5];
  const strategyData = [500000, 550000, 650000, 750000, 900000, 1100000];
  const w = 400;
  const h = 200;
  const yMin = 500000;
  const yMax = 1100000;
  function yToCoord(val: number) {
    return h - ((val - yMin) / (yMax - yMin)) * h;
  }
  function xToCoord(i: number) {
    return (i / (strategyData.length - 1)) * w;
  }

  return (
    <div className="relative h-64 w-full wealth-chart-svg-wrap" ref={wrapRef}>
      <svg
        ref={svgRef}
        viewBox="0 0 400 220"
        className="h-full w-full stroke-[1.5] fill-none wealth-chart-svg"
        id="wealthChartSvg"
        aria-label="Graf projekce majetku"
      >
        <defs>
          <linearGradient id="wealthChartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#4FC6F2", stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: "#4FC6F2", stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <g transform="scale(1, 0.82)">
          <g transform="translate(0, 0)">
            <g className="chart-grid" stroke="rgba(255,255,255,0.12)">
              <line x1="0" y1="40" x2="400" y2="40" />
              <line x1="0" y1="80" x2="400" y2="80" />
              <line x1="0" y1="120" x2="400" y2="120" />
              <line x1="0" y1="160" x2="400" y2="160" />
              <line x1="80" y1="0" x2="80" y2="200" />
              <line x1="160" y1="0" x2="160" y2="200" />
              <line x1="240" y1="0" x2="240" y2="200" />
              <line x1="320" y1="0" x2="320" y2="200" />
            </g>
            <path id="wealthChartPathAverage" strokeDasharray="6 4" strokeWidth={2} d="" />
            <path id="wealthChartPathFill" fill="url(#wealthChartGradient)" stroke="none" d="" />
            <path id="wealthChartPathLine" strokeWidth={3} d="" className="wealth-chart-line-stroke" />
            {milestoneIdx.map((i) => {
              const cx = xToCoord(i);
              const cy = yToCoord(strategyData[i]) - 8;
              return (
                <text
                  key={i}
                  x={cx}
                  y={cy}
                  className="wealth-milestone-label"
                  textAnchor={i === 0 ? "start" : i === 5 ? "end" : "middle"}
                >
                  {formatCzk(strategyData[i])}
                </text>
              );
            })}
          </g>
        </g>
        <text x="0" y="205" className="wealth-chart-axis" textAnchor="start">
          Start
        </text>
        <text x="400" y="205" className="wealth-chart-axis" textAnchor="end">
          10 let
        </text>
      </svg>
      <div id="wealthChartTooltip" ref={tooltipRef} className="wealth-chart-tooltip" aria-hidden />
    </div>
  );
}

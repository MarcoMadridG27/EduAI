"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ShieldCheck, Users2, Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;

interface LandingHeroProps {
  readonly onEnterGeneratorPreview: () => void;
  readonly onEnterRepositoryPreview: () => void;
}

// Mock document content the "AI" streams in — a hero prop, not real generator output.
const BLOCKS = [
  {
    label: "I. Propósito de Aprendizaje",
    text:
      "Competencia: Resuelve problemas de cantidad. Capacidad: traduce datos y relaciones a expresiones numéricas de fracciones.",
  },
  {
    label: "II. Secuencia Didáctica",
    text:
      "Inicio (15 min): dinámica 'Repartiendo la pizza', recojo de saberes previos. Desarrollo (60 min): representación gráfica y simbólica guiada.",
  },
  {
    label: "III. Evaluación Formativa",
    text:
      "Criterio: representa fracciones equivalentes con material concreto. Instrumento: lista de cotejo alineada al CNEB.",
  },
] as const;

const THINKING_MS = 650;
const WORD_INTERVAL_MS = 45;
const HOLD_DONE_MS = 1100;
const HOLD_RESTART_MS = 900;

type Phase = "thinking" | "streaming" | "done";

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "var(--violet-500)" }}
          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: EASE_STANDARD }}
        />
      ))}
    </span>
  );
}

function StreamingCaret() {
  return (
    <motion.span
      className="inline-block align-middle ml-0.5"
      style={{ width: 2, height: "1em", background: "var(--violet-500)" }}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
    />
  );
}

/** Drives the "AI writes the document" loop: thinking -> stream words -> done -> next block. */
function useLiveInk() {
  const [activeBlock, setActiveBlock] = useState(0);
  const [phase, setPhase] = useState<Phase>("thinking");
  const [revealedWords, setRevealedWords] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const words = BLOCKS[activeBlock].text.split(" ");
    setRevealedWords(0);
    setPhase("thinking");

    timeoutRef.current = setTimeout(() => {
      setPhase("streaming");
      let count = 0;
      intervalRef.current = setInterval(() => {
        count += 1;
        setRevealedWords(count);
        if (count >= words.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setPhase("done");
          const isLast = activeBlock === BLOCKS.length - 1;
          const holdBeforeNext = isLast ? HOLD_RESTART_MS : HOLD_DONE_MS;
          timeoutRef.current = setTimeout(() => {
            setActiveBlock((b) => (b + 1) % BLOCKS.length);
          }, holdBeforeNext);
        }
      }, WORD_INTERVAL_MS);
    }, THINKING_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBlock]);

  return { activeBlock, phase, revealedWords };
}

function LiveInkPanel() {
  const { activeBlock, phase, revealedWords } = useLiveInk();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.15 }}
      className="relative w-full max-w-[440px] rounded-[var(--ds-radius-lg)] p-6"
      style={{ background: "var(--white)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-lg)" }}
    >
      {/* Doc header: filename + the one persistent AI badge */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <span className="text-[11px] font-mono tracking-wide" style={{ color: "var(--ink-300)" }}>
          sesion_fracciones_3ro.docx
        </span>
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--ds-radius-pill)] text-[10px] font-semibold uppercase tracking-wide"
          style={{ background: "var(--violet-50)", color: "var(--violet-700)", border: "1px solid var(--violet-300)" }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--violet-500)" }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: EASE_STANDARD }}
          />
          Generando sesión
        </span>
      </div>

      {/* Original teacher prompt, quoted, mono, quiet */}
      <div
        className="text-[11px] font-mono mb-5 px-3 py-2 rounded-[var(--ds-radius-sm)]"
        style={{ background: "var(--bg-subtle)", color: "var(--ink-500)" }}
      >
        &quot;Sesión de fracciones para 3ro de primaria, 90 minutos&quot;
      </div>

      {/* The document blocks */}
      <div className="space-y-4">
        {BLOCKS.map((block, i) => {
          const isPast = i < activeBlock;
          const isActive = i === activeBlock;
          const isFuture = i > activeBlock;
          const words = block.text.split(" ");

          return (
            <div
              key={block.label}
              className="rounded-[var(--ds-radius-md)] p-4 transition-colors"
              style={{
                background: isActive && phase !== "done" ? "var(--violet-50)" : "var(--bg-subtle)",
                border: `1px solid ${isActive && phase !== "done" ? "var(--violet-300)" : "var(--border-subtle)"}`,
                opacity: isFuture ? 0.45 : 1,
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: isActive && phase !== "done" ? "var(--violet-700)" : "var(--ink-500)" }}
                >
                  {block.label}
                </span>
                {(isPast || (isActive && phase === "done")) && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15, ease: EASE_OUT }}
                  >
                    <Check className="w-3.5 h-3.5" style={{ color: "var(--emerald-500)" }} />
                  </motion.span>
                )}
                {isActive && phase === "thinking" && <ThinkingDots />}
              </div>

              {(isPast || (isActive && phase === "done")) && (
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--ink-700)" }}>
                  {block.text}
                </p>
              )}

              {isActive && phase === "streaming" && (
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--ink-700)" }}>
                  {words.slice(0, revealedWords).map((w, wi) => (
                    <motion.span
                      key={wi}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.16, ease: EASE_STANDARD }}
                      className="inline-block mr-1"
                    >
                      {w}
                    </motion.span>
                  ))}
                  <StreamingCaret />
                </p>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function LandingHero({ onEnterGeneratorPreview, onEnterRepositoryPreview }: LandingHeroProps) {
  const { t } = useLanguage();

  return (
    <section className="px-4 lg:px-8 pt-10 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-[var(--container-max)] mx-auto grid lg:grid-cols-12 gap-14 items-center">
        {/* Left: editorial copy, no AI color here */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--ds-radius-pill)] text-[11px] font-semibold uppercase tracking-wide mb-6"
            style={{ background: "var(--emerald-50)", color: "var(--emerald-700)", border: "1px solid var(--emerald-300)" }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Alineado al CNEB
          </div>

          <h1 className="mb-6" style={{ font: "var(--text-display-1)", color: "var(--ink-900)", letterSpacing: "-0.01em" }}>
            Planifica tu clase
            <br />
            mientras la IA <span style={{ color: "var(--blue-500)" }}>la escribe</span>.
          </h1>

          <p className="max-w-xl mb-9" style={{ font: "var(--text-body-lg)", color: "var(--ink-500)" }}>
            {t("heroSubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Button
              onClick={onEnterGeneratorPreview}
              className="rounded-[var(--ds-radius-pill)] font-semibold px-7 h-12 text-[15px] flex items-center gap-2"
              style={{ backgroundColor: "var(--blue-500)", color: "var(--white)" }}
            >
              {t("startNow")}
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={onEnterRepositoryPreview}
              variant="outline"
              className="rounded-[var(--ds-radius-pill)] font-semibold px-7 h-12 text-[15px]"
              style={{ borderColor: "var(--border-default)", color: "var(--ink-800)", background: "var(--white)" }}
            >
              {t("exploreRepo")}
            </Button>
          </div>

          <div
            className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-6 w-full"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" style={{ color: "var(--emerald-500)" }} />
              <span className="text-[13px] font-medium" style={{ color: "var(--ink-700)" }}>
                Alineado al Currículo Nacional (CNEB)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users2 className="w-4 h-4" style={{ color: "var(--emerald-500)" }} />
              <span className="text-[13px] font-medium" style={{ color: "var(--ink-700)" }}>
                Usado por docentes en todo el Perú
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right: the AI moment */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <LiveInkPanel />
        </div>
      </div>
    </section>
  );
}

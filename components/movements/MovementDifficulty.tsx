import type { Difficulty } from "@/lib/movements/types";

type MovementDifficultyProps = { difficulty: Difficulty; showLabel?: boolean };

const levels: Record<Difficulty, number> = { Beginner: 2, Intermediate: 3, Advanced: 4 };

export default function MovementDifficulty({ difficulty, showLabel = true }: MovementDifficultyProps) {
  const level = levels[difficulty];
  return <span className="inline-flex items-center gap-2 text-xs font-medium text-neutral-300">{showLabel && <span>{difficulty}</span>}<span aria-label={`${difficulty}: ${level}/5`} className="tracking-[0.12em] text-[#C9A14A]">{"●".repeat(level)}<span className="text-neutral-600">{"○".repeat(5 - level)}</span></span></span>;
}

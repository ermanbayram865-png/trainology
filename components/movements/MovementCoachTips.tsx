import { Lightbulb } from "lucide-react";

import Card from "@/components/ui/Card";

type MovementCoachTipsProps = { tips: readonly string[] };

export default function MovementCoachTips({ tips }: MovementCoachTipsProps) {
  return <Card title="Koçluk ipuçları" icon={<Lightbulb aria-hidden="true" />} variant="subtle"><ul className="space-y-3 text-sm leading-6 text-neutral-400">{tips.map((tip) => <li key={tip} className="flex gap-3"><span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-[#C9A14A]" />{tip}</li>)}</ul></Card>;
}

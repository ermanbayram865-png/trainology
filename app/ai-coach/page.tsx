import type { Metadata } from "next";

import AICoachComingSoon from "@/features/ai-coach/AICoachComingSoon";
import AICoachExperience from "@/features/ai-coach/AICoachExperience";
import { FEATURES } from "@/lib/features";

export const metadata: Metadata = {
  title: { absolute: "Trainology AI Coach | Yakında" },
  description:
    "Trainology'nin kanıta dayalı yapay zekâ destekli fitness koçu yakında kullanıma açılacak.",
  alternates: { canonical: "/ai-coach" },
  robots: { index: false, follow: true },
};

export default function AICoachPage() {
  return FEATURES.aiCoach ? <AICoachExperience /> : <AICoachComingSoon />;
}

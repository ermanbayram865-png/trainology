export type SupplementCategory = "Performance" | "Health" | "Recovery";

export type EvidenceLevel =
  | "Strong Evidence"
  | "Moderate Evidence"
  | "Limited Evidence"
  | "Emerging Evidence";

export type ClaimEvidenceGrade = "Strong" | "Moderate" | "Limited" | "Not Supported";

export type EvidenceClaim = {
  claim: string;
  grade: ClaimEvidenceGrade;
  conclusion: string;
  practicalInterpretation?: string;
  referenceIds: readonly string[];
};

export type ResearchProtocol = {
  label: string;
  protocol: string;
  timing?: string;
  form?: string;
  note?: string;
};

export type SupplementReference = {
  id: string;
  citation: string;
  url: string;
};

export type SupplementEvidenceContent = {
  oneLiner: string;
  whatItIs?: string;
  mechanism?: string;
  quickUses: readonly string[];
  evidence: readonly EvidenceClaim[];
  whoMayBenefit?: readonly string[];
  whoMayNotNeed?: readonly string[];
  researchProtocols?: readonly ResearchProtocol[];
  timeToEffect?: string;
  safety?: string;
  sideEffects?: readonly string[];
  cautions?: readonly string[];
  interactions?: readonly string[];
  myths?: readonly { myth: string; answer: string }[];
  limitations?: readonly string[];
  verdict: string;
  references: readonly SupplementReference[];
};

export type Supplement = {
  id: string;
  name: string;
  slug: string;
  category: SupplementCategory;
  evidenceLevel: EvidenceLevel;
  purpose: string;
  description: string;
  benefits: string[];
  usage: string;
  considerations: string[];
  sources: string[];
  image: string;
  evidenceContent: SupplementEvidenceContent;
};

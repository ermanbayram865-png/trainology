export type SupplementCategory = "Performance" | "Health" | "Recovery";

export type EvidenceLevel =
  | "Strong Evidence"
  | "Moderate Evidence"
  | "Limited Evidence"
  | "Emerging Evidence";

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
};

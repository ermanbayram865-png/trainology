export type ArticleCategory =
  | "Training Science"
  | "Nutrition Science"
  | "Supplement Science"
  | "Movement Science";

export type ArticleEvidenceLevel =
  | "Strong Evidence"
  | "Moderate Evidence"
  | "Limited Evidence"
  | "Emerging Evidence";

export type ArticleFaq = {
  question: string;
  answer: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  category: ArticleCategory;
  evidenceLevel: ArticleEvidenceLevel;
  summary: string;
  content: string[];
  sources: string[];
  relatedTools: string[];
  publishedDate: string;
  updatedDate: string;
  readingTime: string;
  author: string;
  reviewedBy: string;
  faq: ArticleFaq[];
  image: string;
};

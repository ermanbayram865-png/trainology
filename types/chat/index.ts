export type AICoachMode =
  | "general"
  | "training"
  | "nutrition"
  | "supplements"
  | "recovery"
  | "weight-loss"
  | "muscle-gain";

export type ChatRole = "assistant" | "user";

export type EvidenceLevel = "Strong Evidence" | "Moderate Evidence" | "Limited Evidence";

export type SourceReference = {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  pmid?: string;
  evidenceLevel: EvidenceLevel;
};

export type CoachAnswer = {
  summary: string;
  explanation: string;
  practicalAdvice: string[];
  evidenceNote: string;
  sources?: SourceReference[];
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  answer?: CoachAnswer;
  status?: "complete" | "error";
};

export type Conversation = {
  id: string;
  title: string;
  updatedAt: string;
  pinned?: boolean;
  messages: ChatMessage[];
};

export type UserProfile = {
  goal?: string;
  experience?: string;
  gender?: string;
  age?: string;
  height?: string;
  weight?: string;
  trainingDays?: string;
  equipment?: string;
  injuries?: string;
  timeAvailable?: string;
};

export type PromptRequest = {
  mode: AICoachMode;
  educationMode: boolean;
  context?: string;
  userProfile?: UserProfile;
  memory: ChatMessage[];
  evidencePriority: "standard" | "high";
  format: "structured" | "concise";
};

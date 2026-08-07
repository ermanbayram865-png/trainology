import SourceCard from "@/components/source/SourceCard";
import type { SourceReference } from "@/types/chat";

export default function ReferenceCard({ source }: { source: SourceReference }) {
  return <SourceCard source={source} />;
}

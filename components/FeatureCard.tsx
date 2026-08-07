type FeatureCardProps = {
  emoji: string;
  title: string;
  description: string;
};

export default function FeatureCard({
  emoji,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition hover:border-white hover:scale-105">
      <div className="text-5xl">{emoji}</div>

      <h3 className="mt-5 text-2xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-center text-zinc-400">
        {description}
      </p>
    </div>
  );
}
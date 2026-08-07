type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

export default function FeatureCard({
  icon,
  title,
 description,
}: FeatureCardProps) {
  return (
    <div
      className="
      group
      rounded-3xl
      border
      border-[#C9A14A]/10
      bg-[#0A0A0A]
      p-10
      transition-all
      duration-300
      hover:-translate-y-2
      hover:border-[#C9A14A]/50
      hover:bg-[#101010]
      "
    >
      <div className="text-5xl transition duration-300 group-hover:scale-110">
        {icon}
      </div>

      <h3 className="mt-8 text-3xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-5 leading-8 text-zinc-400">
        {description}
      </p>
    </div>
  );
}
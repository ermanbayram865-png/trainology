import Link from "next/link";

type CardProps = {
  title: string;
  description: string;
  href: string;
};

export default function Card({
  title,
  description,
  href,
}: CardProps) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-white hover:bg-zinc-800"
    >
      <h2 className="text-2xl font-bold">
        {title}
      </h2>

      <p className="mt-4 text-zinc-400">
        {description}
      </p>
    </Link>
  );
}
type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
      inline-flex
      items-center
      justify-center
      rounded-xl
      border
      border-[#C9A14A]
      bg-[#C9A14A]
      px-8
      py-4
      text-sm
      font-semibold
      tracking-wide
      text-black
      transition-all
      duration-300
      hover:-translate-y-1
      hover:bg-[#D4AF37]
      hover:shadow-[0_0_30px_rgba(201,161,74,.35)]
      "
    >
      {children}
    </button>
  );
}
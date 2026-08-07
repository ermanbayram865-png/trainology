"use client";

type ButtonProps = {
  text: string;
};

export default function Button({ text }: ButtonProps) {
  return (
    <button
      onClick={() => alert("Trainology'ye Hoş Geldin!")}
      className="mt-8 bg-white text-black px-6 py-3 rounded-lg font-semibold"
    >
      {text}
    </button>
  );
}
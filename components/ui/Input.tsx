type InputProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export default function Input({
  label,
  value,
  placeholder,
  onChange,
}: InputProps) {
  return (
    <div>
      <label className="mb-2 block text-lg font-medium">
        {label}
      </label>

      <input
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-white outline-none"
      />
    </div>
  );
}
"use client";

type Props<T extends string> = {
  options: { label: string; value: T }[];
  selected: T;
  onChange: (value: T) => void;
};

export default function FilterTabs<T extends string>({
  options,
  selected,
  onChange,
}: Props<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={[
            "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border",
            selected === opt.value
              ? "bg-stone-700 text-white border-stone-700 shadow-sm"
              : "bg-white text-stone-500 border-stone-200 hover:border-stone-400",
          ].join(" ")}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

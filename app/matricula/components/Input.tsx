import React from 'react';

type ColSpanClass = 'col-span-1' | 'col-span-2' | 'w-full' | '';

interface InputProps {
  label: string;
  onChange: (v: string) => void;
  colSpan?: ColSpanClass;
  value?: string;
  type?: string;
}

export default function Input({ label, onChange, colSpan = "", value = "", type = "text" }: InputProps) {
  return (
    <div className={colSpan}>
      <label className="text-[9px] font-black text-zinc-400 uppercase ml-1">{label}</label>
      <input
        type={type}
        value={value}
        className="w-full bg-white border border-zinc-200 p-2 rounded-lg text-sm outline-none focus:border-blue-500 transition-all shadow-sm"
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

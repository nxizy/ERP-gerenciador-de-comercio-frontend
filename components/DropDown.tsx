import { useState, useRef, useEffect, ReactNode } from "react";
import Link from "next/link";

interface DropDownProps {
  label: string;
  items: { name: string; href: string }[];
  icon?: ReactNode;
}

export default function DropDown({ label, items, icon }: DropDownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-white font-bold text-2xl mt-10 flex justify-left items-center gap-5 hover:bg-[#3D5AFE] cursor-pointer p-4 rounded-lg"
      >
        {icon}
        <p>{label}</p>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-54 bg-white shadow-lg rounded-xl p-2 flex flex-col z-50">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <p className="text-lg">{item.name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

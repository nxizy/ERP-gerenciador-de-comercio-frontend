import { PiSealCheck } from "react-icons/pi";

interface SaveButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  colSpan?: number;
  children?: React.ReactNode;
  label: string;
}

export default function SaveButton({ onClick, colSpan, children, label }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`col-span-${colSpan} mt-13 h-15 bg-blue-700 text-white font-bold flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-blue-900 cursor-pointer`}
    >
      {children}
      <p>{label}</p>
    </button>
  );
}

interface FormCampProps {
  identifier: string;
  name: string;
  colSpan: number;
  rowSpan?: number;
  placeHolder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}

const COL_MAP: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

const ROW_MAP: Record<number, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
  5: "row-span-5",
  6: "row-span-6",
};

export default function FormCamp({
  identifier,
  name,
  colSpan,
  rowSpan,
  placeHolder,
  required = false,
  value,
  onChange,
  onKeyDown,
  children,
}: FormCampProps) {
  const colClass = COL_MAP[colSpan] ?? "col-span-1";
  const rowClass = rowSpan ? (ROW_MAP[rowSpan] ?? "") : "";

  return (
    <div className={`flex flex-col mt-10 ${colClass} ${rowClass}`}>
      <label htmlFor={`${identifier}`} className="font-bold">
        {name}
      </label>
      <input
        type="text"
        placeholder={placeHolder}
        className="p-3 bg-gray-300 rounded-lg font-bold"
        id={`${identifier}`}
        name={`${identifier}`}
        required={required}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      {children}
    </div>
  );
}

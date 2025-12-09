interface FormCampProps {
  identifier: string;
  name: string;
  colSpan: number;
  placeHolder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}

export default function FormCamp({
  identifier,
  name,
  colSpan,
  placeHolder,
  required = false,
  value,
  onChange,
  onKeyDown,
  children,
}: FormCampProps) {
  return (
    <div className={`flex flex-col mt-10 col-span-${colSpan}`}>
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

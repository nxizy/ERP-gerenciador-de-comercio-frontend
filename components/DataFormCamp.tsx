interface DataFormCampProps {
  colSpan: number;
  identifier: string;
  name: string;
  data: any;
  placeholder?: any
}

export default function DataFormCamp({
  colSpan,
  identifier,
  name,
  data,
  placeholder
}: DataFormCampProps) {
  return (
    <div className={`flex flex-col mt-10 col-span-${colSpan}`}>
      <label htmlFor={identifier} className="self-start font-bold">
        {name}
      </label>
      <p className={`p-3 text-center bg-gray-300 rounded-lg font-bold ${data? "text-gray-700!" : "text-gray-400!"}`}> {data? data : placeholder}</p>
    </div>
  );
}


export interface CheckboxData {
  label: string;
  value: string | number;
}

interface CheckProps {
  data: CheckboxData[];
  selected:CheckboxData[];
  setSelected:Function
  show?:'row'|'col'
}

export default function Checkbox({data,selected,setSelected, show="row"}:CheckProps) {


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = Number(e.target.value);
    if (e.target.checked) {
      setSelected([
        ...selected,
        ...data.filter((item) => item.value === currentValue),    
      ]);
     } else {
      setSelected(selected.filter((item) => item.value !== currentValue)); 
    }    
  };

  return (

    <fieldset>
      <div className={` ${show === "row" ? "grid grid-cols-4 gap-5" : "flex-col"}`}>
        {data.map((item, idx) => (
          <div key={idx} className="flex items-start p-2">
            <div className="flex h-6 items-center">
              <input
                name={item.label}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-600"
                onChange={(e) => { onChange(e); }}
                value={item.value}
                checked = {selected.filter(check=>check.value === item.value).length !== 0}
              />
            </div>
            <div className="ml-2 text-md leading-6">
              <label htmlFor="offers" className="font-medium text-gray-700">
                {item.label}
              </label>
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

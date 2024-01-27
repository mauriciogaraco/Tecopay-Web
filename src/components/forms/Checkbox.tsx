import { BasicNomenclator } from '../../interfaces/ServerInterfaces';

interface CheckProps {
  data: BasicNomenclator[];
  selected: BasicNomenclator[];
  setSelected: Function;
  displayCol?: boolean;
}

export default function Checkbox({
  data,
  selected,
  setSelected,
  displayCol,
}: CheckProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    const currentValue = isNaN(e.target.value)
      ? e.target.value
      : Number(e.target.value);
    if (e.target.checked) {
      setSelected([
        ...selected,
        ...data.filter((item) => item.id === currentValue),
      ]);
    } else {
      setSelected(selected.filter((item) => item.id !== currentValue),e.target.value);
    }
  };

  return (
    <fieldset>
      <div className={`${displayCol ? 'flex-col' : 'grid grid-cols-4 gap-5'}`}>
        {data.map((item, idx) => (
          <div key={idx} className='flex items-start p-2'>
            <div className='flex h-6 items-center'>
              <input
                name={item.name}
                type='checkbox'
                className={`h-4 w-4 rounded border-gray-300 focus:bg-transparent  focus:ring-transparent ${
                  //@ts-ignore
                  item.disabled ? 'text-slate-400' : 'text-slate-600'
                }`}
                onChange={(e) => onChange(e)}
                value={item.id}
                checked={
                  selected.filter((check) => check.id === item.id).length !== 0
                }
                //@ts-ignore
                disabled={Boolean(item.disabled)}
              />
            </div>
            <div className='ml-2 text-md leading-6'>
              <label
                htmlFor='offers'
                className={`font-medium ${
                  //@ts-ignore
                  item.disabled ? 'text-slate-400' : 'text-gray-700'
                }`}
              >
                {/* @ts-ignore */}
                {item.label || item.name}
              </label>{' '}
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

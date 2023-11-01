import { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { useController, UseControllerProps } from "react-hook-form";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export interface InlineRadioData {
  label: string;
  value: string | number;
  disabled?: boolean;

}

interface InlineRadio {
  label?: string;
  data: InlineRadioData[];
  adjustContent?: boolean;
}
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NotInlineRadio(props: UseControllerProps & InlineRadio) {

  const { data, label, defaultValue, adjustContent } = props;
  const { field, fieldState } = useController(props);
  const [selected, setSelected] = useState<InlineRadioData|null>(null);

  useEffect(() => {
    if(defaultValue) setSelected(data.find((item) => item.value === defaultValue)??null)
  }, []);

  const onChange = (e: any) => {
    setSelected(e);
    field.onChange(e.value);
  };

  return (
    <>
      <div className="w-full">
        {label && (
          <div className="flex items-center">
            <h2 className="text-md font-medium leading-6 text-gray-900">
              {label}
            </h2>
          </div>
        )}
        
        <RadioGroup        
          value={selected}
          onChange={onChange}
          by={(y, z) => y && z && y.value === z?.value}
        >
          <div className="gap-3 w-full justify-center flex-shrink-0">
            {data.map((option, idx) => (
              <div className="py-1">
                <RadioGroup.Option
                  key={idx + 1}
                  value={option}
                  className={({ active, checked }) =>
                    classNames(
                      !option.disabled
                        ? "cursor-pointer focus:outline-none"
                        : "cursor-not-allowed opacity-25",
                      active ? "ring-2 ring-slate-600 ring-offset-2" : "",
                      checked
                        ? "bg-slate-600 text-white hover:bg-slate-500"
                        : "ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50",
                      `flex items-center justify-center flex-shrink-0 rounded-md py-2 px-3 text-sm font-semibold sm:${
                        adjustContent ? "flex-shrink" : "flex-1"
                      }`
                    )
                  }
                  disabled={option.disabled}
                >
                  <RadioGroup.Label as="span">{option.label}</RadioGroup.Label>
                </RadioGroup.Option>
              </div>   
            ))}
          </div>
        </RadioGroup>

        <div className="relative rounded-md shadow-sm inline-flex items-center w-full">
          {fieldState.error && (
            <>
              <div className="pointer-events-none absolute inset-y-0 right-0 top-0 pr-2">
                <ExclamationCircleIcon
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>

              <p className="absolute -bottom-5 text-xs text-red-600 flex flex-shrink-0">
                {fieldState.error?.message}
              </p>
            </>
          )}
      </div>
      </div>
      
    </>
  );
}

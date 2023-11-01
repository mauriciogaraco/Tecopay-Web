import React, { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { useController, UseControllerProps } from "react-hook-form";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconType } from "react-icons";

interface RadioInterface {
  icon?:IconType,
  value: number | string;
  title: string;
  description: string;
}

interface RadioProps {
  label?: string;
  disabled?: boolean;
  data: Array<RadioInterface>;
  action?:Function;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function RadioGroupForm(props: UseControllerProps & RadioProps) {
    const {data,label,disabled, defaultValue, action} = props; 
    const {field} = useController(props)

  const [radioValue, setRadioValue] = useState<RadioInterface|null>(null);

  useEffect(() => {
    const index = data.findIndex(item=>item.value === defaultValue || item.value === field.value)
    if( index !== -1) setRadioValue(data[index])
  }, [])
  
  const onChange = (e:any)=>{
    setRadioValue(e);
    field.onChange(e.value)
    action && action()
  }

  return (
    <RadioGroup value={radioValue} onChange={onChange}>
      <RadioGroup.Label className="text-base font-semibold leading-6 text-gray-900">        
        {label}
      </RadioGroup.Label>

      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
        {data.map((item) => (
          <RadioGroup.Option
            key={item.value}
            value={item}
            className={({ checked, active }) =>
              classNames(
                checked ? "border-transparent" : "border-gray-300",
                active ? "border-indigo-600 ring-2 ring-slate-600" : "",
                "relative flex cursor-pointer rounded-lg border bg-white p-6 shadow-sm focus:outline-none"
              )
            }
          >
            {({ checked, active }) => (
              <>
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className="flex gap-2 items-center text-lg font-medium text-gray-600"
                    >
                      {item.icon && <item.icon className="text-gray-400" />}
                      {item.title}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className="mt-1 flex items-center text-md text-gray-500"
                    >
                      {item.description}
                    </RadioGroup.Description>
                  </span>
                </span>
                <span
                  className={classNames(
                    active ? "border" : "border-2",
                    checked ? "border-slate-500" : "border-transparent",
                    "pointer-events-none absolute -inset-px rounded-lg"
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}

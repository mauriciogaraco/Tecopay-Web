import {useState} from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useController, UseControllerProps } from "react-hook-form";

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: "number" | "text";
  paddingInput?: string
}

const TextArea = (
  props: UseControllerProps & InputProps
) => {
  const { label, placeholder, paddingInput } = props;
  const { field, fieldState } = useController(props);

  const [input, setInput] = useState<string>(props.defaultValue ?? "")

  return (
    <div className={`${paddingInput ? paddingInput : 'py-2'}`}>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <textarea
          {...field}
          className={`${fieldState.error ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500" : "focus:ring-slate-400 border-slate-400 focus:border-slate-600 text-gray-500"} block w-full rounded-md  pr-10 sm:text-sm placeholder:text-slate-400 scrollbar-thin`}
          value={input}
           placeholder={placeholder && placeholder}
          onChange={(e)=>{
            field.onChange(e.target.value);
            setInput(e.target.value)
          }}
        />

        {fieldState.error && (
          <>
            <div className="pointer-events-none absolute inset-y-0 right-0 -top-6 flex items-center pr-3">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>

            <p className="mt-2 text-sm text-red-600">
              {fieldState.error?.message}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default TextArea;

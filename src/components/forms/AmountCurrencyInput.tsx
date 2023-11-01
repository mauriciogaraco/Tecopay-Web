import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { useController, UseControllerProps } from "react-hook-form";

interface InputProps {
  label?: string;
  name: string;
  placeholder?: string;
  currencies: string[];
  showInline?: boolean;
  disabled?: boolean;
  byDefault?: { amount: number; codeCurrency: string };
}

const AmountCurrencyInput = (props: UseControllerProps & InputProps) => {
  const { label, placeholder, currencies, showInline, disabled, defaultValue } =
    props;
  const { field, fieldState } = useController(props);

  const [currentValue, setCurrentValue] = useState<{
    amount: number;
    codeCurrency: string;
  }>(defaultValue ? defaultValue : { amount: 0, codeCurrency: currencies[0] });

  useEffect(() => {
    field.onChange(currentValue)
  }, [currentValue]);

  return (
    <div
      className={`${
        showInline ? "inline-flex items-center " : "flex-col"
      } py-2 w-full`}
    >
      {label && (
        <label
          htmlFor={label}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="number"
          min={0}
          step="any"
          className={`${
            fieldState.error && !field.value.amount
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
              : "focus:ring-gray-500 border-gray-500 focus:border-gray-600 text-gray-500"
          } block w-full rounded-md  pr-10 sm:text-sm placeholder:text-slate-400`}
          value={currentValue.amount}
          placeholder={placeholder && placeholder}
          onChange={(e) => {
            field.onChange({ ...field.value, amount: Number(e.target.value) });
            setCurrentValue({ ...field.value, amount: Number(e.target.value) });
          }}
          required
          disabled={disabled}
        />
        <div className="absolute top-0 right-0 flex gap-1 items-center pr-0">
          {fieldState.error && !field.value.amount && (
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          )}
          <select
            className=" rounded-md border-transparent bg-transparent py-2 pl-2 pr-7 text-gray-500 focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            disabled={disabled}
            onChange={(e) => {
              field.onChange({ ...field.value, codeCurrency: e.target.value });
              setCurrentValue({ ...field.value, codeCurrency: e.target.value });
            }}
            value={currentValue.amount}
          >
            {currencies?.map((item, idx) => (
              <option key={idx} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        {fieldState.error && !field.value.amount && (
          <p className="absolute text-xs text-red-600">
            {fieldState.error?.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AmountCurrencyInput;

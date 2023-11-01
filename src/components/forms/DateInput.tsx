import React, {useState} from "react";
import es from "date-fns/locale/es";
import subDays from "date-fns/subDays";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useController, UseControllerProps } from "react-hook-form";
import moment from "moment";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface DateInput {
  label: string;
  untilToday?:boolean;
  fromToday?:boolean
}

const DateInput = (props: UseControllerProps & DateInput) => {
  const { field, fieldState } = useController(props);
  const {label, fromToday, untilToday} = props
  
  const defaultValue = field.value ? moment(field.value).toDate() : null

  const [currentDate, setcurrentDate] = useState<Date | null>(defaultValue)
  
  return (
    <div className="py-2">
      <label
        htmlFor="label"
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="relative w-full">
          <DatePicker
            selected={currentDate}
            onChange={(e)=>{
              setcurrentDate(e);
              field.onChange(moment(e).format('YYYY-MM-DD'))
            }}
            className={`${
              fieldState.error
                ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                : "focus:ring-gray-500 border-gray-500 focus:border-gray-600 text-gray-500"
            } w-full rounded-md sm:text-sm placeholder:text-slate-400 cursor-pointer`}
            placeholderText="DD-MM-YYYY"
            locale={es}
            dateFormat="dd MMMM yyyy"
            minDate={fromToday ? subDays(new Date(), 0) : undefined}
            maxDate={untilToday ? subDays(new Date(), 0) : undefined}
            popperPlacement="bottom"           
          />
          <div className="absolute p-2 gap-1 right-0 top-0 flex items-center rounded-r-md px-2 focus:outline-none">
            {fieldState.error && (
              <>
                <ExclamationCircleIcon
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                /> 
              </>
            )}
          </div>

          {fieldState.error && (
            <span className="text-xs text-red-600">
              {fieldState.error.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateInput;

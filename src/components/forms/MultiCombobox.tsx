import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { useController, UseControllerProps } from "react-hook-form";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { SelectInterface } from "../../interfaces/InterfacesLocal";
import LoadingSpin from "../misc/LoadingSpin";
import { useEffect, useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface InputProps {
  label: string;
  disabled?: boolean;
  data: SelectInterface[];
  loading?: boolean;
  defaultValue?: any;
  changeState?: Function;
  byDefault?: (string|number)[];
}

export default function MultiCombobox(props: UseControllerProps & InputProps) {
  const { field, fieldState } = useController(props);
  const { label, disabled, loading, data, byDefault } = props;

  const [search, setSearch] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [filteredOptions, setFilteredOptions] = useState<SelectInterface[]>();

  const [selected, setSelected] = useState<SelectInterface[]>(
    data.filter((item) => field?.value?.includes(item.id)) ?? []
  );

  useEffect(() => {
    const selectedValues = selected.map((option) => option.id);
    const values = data.filter((option) => selectedValues.includes(option.id));
    setSelected(values);
    field.onChange(values.map((item: { id: any }) => item.id));

    setFilteredOptions(
      data.filter((option) => {
        if (option.name.toLowerCase().includes(search.toLowerCase())) {
          return option;
        }
      })
    );
  }, [data]);

  return (
    <div className='h-auto mt-2 mb-3'>
      <Combobox
        as='div'
        value={selected}
        onChange={(e: SelectInterface[]) => {
          setSelected(e);
          field.onChange(e.map((item) => item.id));
          props.changeState && props.changeState(e);
        }}
        disabled={disabled}
        by='id'
        multiple>
        <div className='flex gap-1'>
          <Combobox.Label
            className={`flex text-sm font-medium ${
              disabled ? "text-gray-400" : "text-gray-700"
            } first-letter:uppercase gap-1`}>
            <span className='inline-flex items-center'>
              <div className='flex items-center'>
                {label}
                {isSearching && <LoadingSpin color='gray-700 ml-4' />}
              </div>
              {disabled && <LockClosedIcon className='px-2 h-4' />}
            </span>
          </Combobox.Label>
          <Combobox.Label>
            {selected.length > 0 && (
              <div
                className={`flex flex-shrink overflow-y-auto scroll-smooth scrollbar-none scrollbar-thumb-slate-500 w-[${
                  60 - label.length
                }%]`}>
                {selected.map((item) => (
                  <span
                    key={item.id}
                    className='inline-flex items-center  gap-x-0.5 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500'>
                    {item.name}
                    <button
                      key={item.id}
                      onClick={() => {
                        const filtered = selected.filter(
                          (values) => item.id !== values.id
                        );
                        setSelected(filtered);
                        field.onChange(filtered.map((item) => item.id));
                      }}
                      type='button'
                      className='group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20'>
                      <span className='sr-only'>Remove</span>
                      <svg
                        viewBox='0 0 14 14'
                        className='h-3.5 w-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75'>
                        <path d='M4 4l6 6m0-6l-6 6' />
                      </svg>
                      <span className='absolute -inset-1' />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Combobox.Label>
        </div>
        <div className='relative mt-1'>
          <Combobox.Input
            className={`${
              fieldState.error
                ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                : `focus:ring-gray-500 ${
                    disabled ? "border-gray-300" : "border-gray-400"
                  } focus:border-gray-500 text-gray-500`
            } border relative w-full rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm sm:text-sm`}
            /* displayValue={(items: SelectInterface[]) => {
              return items.map((item) => item.name).join(",");
            }} */
            placeholder={selected.length ? "" : "Busque o seleccione"}
            //autoComplete='off'
            onSelect={() => {
              //alert("111");
            }}
            onChange={(event) => {
              //setQuery(event.target.value);
              props.changeState && props.changeState(event.target.value);
            }}
          />

          <div className='absolute p-2 gap-1 right-0 top-0 flex items-center rounded-r-md px-2 focus:outline-none'>
            {fieldState.error && (
              <ExclamationCircleIcon
                className='h-5 w-5 text-red-500'
                aria-hidden='true'
              />
            )}
            {loading && <LoadingSpin color='gray-700' />}
            <Combobox.Button>
              <ChevronUpDownIcon
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </Combobox.Button>
          </div>

          {filteredOptions?.length! > 0 && (
            <Combobox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {loading ? (
                <LoadingSpin color='gray-700' />
              ) : (
                filteredOptions?.map((item) => (
                  <Combobox.Option
                    key={item.id}
                    value={item}
                    className={({ active }) =>
                      classNames(
                        "relative cursor-default select-none py-2 pl-3 pr-9",
                        active ? "bg-slate-600 text-white" : "text-gray-900"
                      )
                    }>
                    {({ selected, active, disabled }) => (
                      <>
                        <span
                          className={classNames(
                            selected
                              ? "font-semibold"
                              : `${disabled ? "text-gray-300" : "font-normal"}`,
                            "block truncate"
                          )}>
                          {item.name}
                        </span>

                        {selected && (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-slate-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}>
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          )}

          {/* <div className='flex flex-wrap items-center'>
            {selected.length > 0 &&
              selected.map((item) => (
                <span
                  key={item.id}
                  className='inline-flex border border-gray rounded p-1 m-1 bg-gray-300 z-0 cursor-pointer'
                  onClick={() => {
                    const filtered = selected.filter(
                      (values) => item.id !== values.id
                    );
                    setSelected(filtered);
                    field.onChange(filtered.map((item) => item.id));
                  }}>
                  {item.name}
                </span>
              ))}
          </div> */}

          {fieldState.error && (
            <span className='text-xs text-red-600'>
              {fieldState.error.message}
            </span>
          )}
        </div>
      </Combobox>
    </div>
  );
}

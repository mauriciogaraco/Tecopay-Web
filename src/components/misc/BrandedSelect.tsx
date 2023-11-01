import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";



function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function BrandedSelect() {
  const publishingOptions = [
    {
      title: "Activo",
      description: "Esta acción habilita el Cliente",
      current: true,
      styles: {
        divider: "inline-flex divide-x divide-primary rounded-md shadow-sm",
        bgLabel:
          "inline-flex items-center rounded-l-md  bg-primary py-2 pl-3 pr-4 text-white shadow-sm",
        bgListbox:
          "inline-flex items-center rounded-l-none rounded-r-md bg-primary p-2 text-sm font-medium text-white hover:bg-secondary",
      },
      icon:<CheckIcon className="h-5 w-5" aria-hidden="true" />
    },
    {
      title: "Inactivo",
      description: "Esta acción deshabilita el Cliente.",
      current: false,
      styles: {
        divider: "inline-flex divide-x divide-gray-400 rounded-md shadow-sm",
        bgLabel:
          "inline-flex items-center rounded-l-md  bg-gray-400 py-2 pl-3 pr-4 text-white shadow-sm",
        bgListbox:
          "inline-flex items-center rounded-l-none rounded-r-md bg-gray-400 p-2 text-sm font-medium text-white hover:bg-gray-300",
      },
      icon:<XMarkIcon className="h-5 w-5" aria-hidden="true" />
    },
  ];
  const [selected, setSelected] = useState(publishingOptions[0]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">
            {" "}
            Change published status{" "}
          </Listbox.Label>
          <div className="relative">
            <div className={selected.styles.divider}>
              <div className={selected.styles.bgLabel}>
                {selected.icon}
                <p className="ml-2.5 text-sm font-medium">{selected.title}</p>
              </div>
              <Listbox.Button className={selected.styles.bgListbox}>
                <span className="sr-only">Change published status</span>
                <ChevronDownIcon
                  className="h-5 w-5 text-white"
                  aria-hidden="true"
                />
              </Listbox.Button>
            </div>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {publishingOptions.map((option) => (
                  <Listbox.Option
                    key={option.title}
                    className={({ active }) =>
                      classNames(
                        active ? (selected.title==="Activo"? "text-white bg-secondary":"text-white bg-gray-400") : "text-gray-800",
                        "cursor-default select-none p-4 text-sm"
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <p
                            className={
                              selected ? "font-bold" : "font-normal"
                            }
                          >
                            {option.title}
                          </p>
                          {selected ? (
                            <span
                              className={
                                active ? "text-white" : "text-gray"
                              }
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </div>
                        <p
                          className={classNames(
                            active ? "text-gray-200 font-semibold" : "text-gray-800",
                            "mt-2"
                          )}
                        >
                          {option.description}
                        </p>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}

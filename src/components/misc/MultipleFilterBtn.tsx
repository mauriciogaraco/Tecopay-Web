import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import Checkbox from '../forms/Checkbox';
import { BasicNomenclator } from '../../interfaces/ServerInterfaces';

interface MultiBtn {
  btnName?: string;
  data: BasicNomenclator[];
  selected: BasicNomenclator[];
  setSelected: Function;
  onClear?: Function;
}

export default function MultipleFilterBtn({
  btnName,
  data,
  selected,
  setSelected,
  onClear,
}: MultiBtn) {
  return (
    <div className='inline-flex shadow-sm flex-shrink-0'>
      <Menu as='div' className='relative -ml-px block'>
        <Menu.Button className='relative inline-flex items-center gap-2 rounded-md bg-white px-2 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 border-none'>
          <span className='inline-flex gap-2 justify-center items-center pl-2 divide-x'>
            <>
              {btnName ?? 'Filtros'}
              <ChevronDownIcon className='h-5 w-5' aria-hidden='true' />
            </>
            {onClear && (
              <button
                className='pl-2 pr-1'
                onClick={(e) => {
                  e.preventDefault();
                  onClear();
                }}
              >
                <XMarkIcon className='h-5 w-5' aria-hidden='true' />
              </button>
            )}
          </span>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute right-0 z-10 mt-2 -mr-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='p-1'>
              <Checkbox
                data={data}
                selected={selected}
                setSelected={setSelected}
                displayCol
              />
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

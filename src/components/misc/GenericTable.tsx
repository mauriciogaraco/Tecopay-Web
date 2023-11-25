/*
 * Los datos de la tabla (tablaData) debe contener como primer elemento el id del item para identificar el elemento cuando se de click sobre la fila
 *Los titles deben coincidir con los índices en los datos pasados para el body
 */

import { ChevronRight } from 'heroicons-react';
import {
  MagnifyingGlassIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import React, {
  useState,
  useEffect,
  BaseSyntheticEvent,
  Fragment,
} from 'react';
import SpinnerLoading from './SpinnerLoading';
import EmptyList from './EmptyList';
import MultipleActBtn, { TableActions } from './MultipleActBtn';
import MultiSelect from '../forms/Multiselect';
import {
  BasicType,
  FilterCodeDatePickerRange,
  SelectInterface,
} from '../../interfaces/InterfacesLocal';
import ComboBox from '../forms/Combobox';
import Button from './Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import MultipleFilterBtn from './MultipleFilterBtn';
import { BasicNomenclator } from '../../interfaces/ServerInterfaces';
import Input from '../forms/Input';
import DateInput from '../forms/DateInput';
import { AiOutlineSync } from 'react-icons/ai';
import AsyncComboBox from '../forms/AsyncCombobox';

export interface SearchingInterface {
  action: Function; //Callback Function to control Searching action
  placeholder?: string;
}

export interface DataTableInterface {
  rowId?: string | number;
  deletedRow?: boolean;
  boldRow?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;
  childRows?: {
    rowId?: string;
    payload: Record<string, string | number | React.ReactNode>;
  }[];
  payload: Record<string, string | number | React.ReactNode>;
}

export interface FilterOpts {
  name: string;
  format:
    | 'select'
    | 'multiselect'
    | 'input'
    | 'boolean'
    | 'datepicker'
    | 'datepicker-range';
  filterCode: string;
  data?: SelectInterface[];
  icon?: React.ReactNode;
  datepickerRange?: FilterCodeDatePickerRange[];
  isUnitlToday?: boolean;
  dependentOn?: string; //code del filtro del cual es dependiente esta entrada
  asyncData?: {
    url: string;
    defaultParams?: BasicType;
    idCode: string;
    dataCode: string|string[];
  };
}

interface FilterComponent {
  availableFilters: FilterOpts[];
  filterAction: Function;
}

interface GenericTableProps {
  tableTitles: string[];
  tableData: Array<DataTableInterface>;
  rowAction?: Function; //Callback function to control click on each row. It work with id param
  searching?: SearchingInterface;
  loading?: boolean;
  paginateComponent?: React.ReactNode;
  actions?: TableActions[];
  filterComponent?: FilterComponent;
  syncAction?: { action: Function; loading: boolean };
}

const GenericTable = ({
  tableTitles,
  tableData,
  rowAction,
  searching,
  loading,
  paginateComponent,
  actions,
  filterComponent,
  syncAction,
}: GenericTableProps) => {
  //Debounce for filter -----------------------------------------------------------------------------
  const [timeOutId, setTimeOutId] = useState<number | undefined>();
  const onKeyDown = () => {
    clearTimeout(timeOutId);
  };

  const onKeyUp = (e: BaseSyntheticEvent) => {
    const time = Number(
      setTimeout(() => {
        if (e.target.value !== '') {
          searching?.action(e.target.value);
        } else {
          searching?.action(null);
        }
      }, 800)
    );
    setTimeOutId(Number(time));
  };
  //----------------------------------------------------------------------------------------

  const [btnSearch, setBtnSearch] = useState(false);
  const [searchValue, setSearchValue] = useState<string | null>(null);

  useEffect(() => {
    if (searchValue === null && btnSearch) setBtnSearch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  //----------------------------------------------------------------------------------------------------

  //Manage Filter --------------------------------------------------------------------------------------
  const { control, handleSubmit, unregister, register, watch } = useForm();
  const [filterActived, setFilterActived] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<BasicNomenclator[]>([]);
  const activeIndex = selectedFilter.map((item) => item.id);

  useEffect(() => {
    const disabledFiltersCode = filterComponent?.availableFilters
      .filter((_, idx) => !activeIndex.includes(idx))
      .map((item) => item.filterCode);
    if (selectedFilter.length === 0 && filterActived) {
      filterComponent?.filterAction(null);
      setFilterActived(false);
    }
    unregister(disabledFiltersCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter]);

  const activatedFilters = filterComponent?.availableFilters?.filter((_, idx) =>
    activeIndex.includes(idx)
  );

  const onSubmit: SubmitHandler<BasicType> = (data) => {
    filterComponent?.filterAction(data);
  };

  const filterSelectorData: BasicNomenclator[] =
    filterComponent?.availableFilters?.map((item, idx) => ({
      id: idx,
      name: item.name,
    })) ?? [];

  //-----------------------------------------------------------------------------------------------------

  //Manage Child Rows------------------------------------------------------------------------------------
  const [currentParent, setCurrentParent] = useState<string | number | null>(
    null
  );

  useEffect(() => {
    if (currentParent) {
      const elements = document.querySelectorAll(`.parent-${currentParent}`);
      elements.forEach((elem) => {
        elem.removeAttribute('hidden');
      });
    }
  }, [currentParent, tableData]);

  const changeChildRow = (id: string | number) => {
    const elements = document.querySelectorAll(`.parent-${currentParent}`);
    elements.forEach((elem) => {
      elem.setAttribute('hidden', 'true');
    });
    currentParent === id ? setCurrentParent(null) : setCurrentParent(id);
  };

  //-----------------------------------------------------------------------------------------------------

  return (
    <div className='flex flex-col'>
      {filterComponent && selectedFilter.length !== 0 && (
        <div
          className={`flex border border-gray-200 bg-gray-50 rounded-lg my-2 shadow-md px-5 py-2 w-full`}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='lg:inline-flex gap-10 items-center w-full p-2'
          >
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-center w-full justify-center'>
              {activatedFilters?.map((item, idx) =>
                item.format === 'select' && item.asyncData ? (
                  <AsyncComboBox
                    key={idx}
                    name={item.filterCode}
                    control={control}
                    dataQuery={{
                      url: item.asyncData.url,
                      defaultParams: item.asyncData?.defaultParams,
                    }}
                    label={item.name}
                    normalizeData={{
                      id: item.asyncData.idCode,
                      name: item.asyncData.dataCode,
                    }}
                    dependendValue={
                      item.dependentOn
                        ? { [item.dependentOn]: watch(item.dependentOn) }
                        : undefined
                    }
                  />
                ) : item.format === 'select' ? (
                  <ComboBox
                    key={idx}
                    name={item.filterCode}
                    control={control}
                    data={item.data ?? []}
                    label={item.name}
                    rules={{ required: 'Seleccione' }}
                  />
                ) : item.format === 'multiselect' ? (
                  <MultiSelect
                    key={idx}
                    name={item.filterCode}
                    control={control}
                    data={item.data ?? []}
                    label={item.name}
                    rules={{ required: 'Seleccione' }}
                  />
                ) : item.format === 'input' ? (
                  <Input
                    key={idx}
                    name={item.filterCode}
                    control={control}
                    label={item.name}
                  />
                ) : item.format === 'boolean' ? (
                  <div
                    key={idx}
                    className='flex gap-2 font-normal items-center'
                  >
                    <input
                      className='h-4 w-4 rounded border-gray-400 focus:bg-transparent text-slate-400 focus:ring-transparent'
                      {...register(item.filterCode)}
                      type={'checkbox'}
                      value='true'
                    />
                    {item?.icon}
                    {item.name}
                  </div>
                ) : item.format === 'datepicker-range' ? (
                  <div
                    key={idx}
                    className='flex gap-1 font-normal items-center'
                  >
                    {item.datepickerRange?.map((rangeDatePicker, index) => (
                      <DateInput
                        key={index}
                        name={rangeDatePicker.filterCode}
                        label={rangeDatePicker.name}
                        control={control}
                        rules={{ required: 'Este campo es requerido' }}
                        untilToday={rangeDatePicker.isUnitlToday}
                      />
                    ))}
                  </div>
                ) : (
                  item.format === 'datepicker' && (
                    <div
                      key={idx}
                      className='flex gap-1 font-normal items-center'
                    >
                      <DateInput
                        name={item.filterCode}
                        label={item.name}
                        control={control}
                        rules={{ required: 'Este campo es requerido' }}
                      />
                    </div>
                  )
                )
              )}
            </div>
            <div className='pt-5 lg:p-0 flex justify-center items-center flex-shrink-0 gap-1'>
              <Button
                name='Aplicar'
                color='slate-500'
                type='submit'
                textColor='slate-500'
                outline
              />
              <Button
                name='Eliminar filtros'
                color='slate-500'
                action={() => setSelectedFilter([])}
                textColor='slate-500'
                outline
              />
            </div>
          </form>
        </div>
      )}
      <div className='w-full align-middle'>
        <div className='shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
          {(searching || actions || filterComponent || syncAction) && (
            <div
              className={`inline-flex w-full gap-3 items-center px-5 py-3 ${
                !searching ? 'justify-end' : ''
              }`}
            >
              {searching && (
                <>
                  <div
                    className={`flex w-full bg-inherit ${
                      !(filterComponent || actions) && 'm-auto'
                    }`}
                  >
                    <div className='relative w-full text-gray-400'>
                      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-0'>
                        <MagnifyingGlassIcon
                          className='h-5 w-5'
                          aria-hidden='true'
                        />
                      </div>
                      <input
                        id='search'
                        className='w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:border-transparent focus:bg-opacity-100 focus:text-gray-900 focus:placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-sm'
                        placeholder={searching?.placeholder}
                        type='search'
                        name='search'
                        onKeyUp={onKeyUp}
                        onKeyDown={onKeyDown}
                        onChange={(e) => {
                          if (e.target.value === '') searching?.action(null);
                        }}
                        onMouseOut={() =>
                          searchValue === '' && setSearchValue(null)
                        }
                      />
                    </div>
                  </div>
                </>
              )}
              
              {syncAction && (
                <AiOutlineSync
                  className={`cursor-pointer text-lg ${
                    syncAction.loading ? 'animate-spin' : ''
                  }`}
                  onClick={() => syncAction.action()}
                />
              )}              

              {filterComponent && (
                <MultipleFilterBtn
                  selected={selectedFilter}
                  data={filterSelectorData}
                  setSelected={(data: BasicNomenclator[]) => {
                    setSelectedFilter(data);
                    !filterActived && setFilterActived(true);
                  }}
                />
              )}

              {actions && <MultipleActBtn items={actions} />}
            </div>
          )}

          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th
                  scope='col'
                  className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 first-letter:uppercase'
                >
                  {tableTitles[0]}
                </th>
                {tableTitles.slice(1).map((title, index) => (
                  <th
                    key={index}
                    scope='col'
                    className='px-3 py-3.5 text-sm text-center font-semibold text-gray-900 first-letter:uppercase'
                  >
                    {title}
                  </th>
                ))}
                {rowAction && (
                  <th
                    scope='col'
                    className='relative py-3.5 pl-3 pr-4 sm:pr-6 first-letter:uppercase'
                  >
                    <span className='sr-only'>Edit</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className='bg-white'>
              {loading && loading === true ? (
                <tr>
                  <td
                    colSpan={tableTitles.length + 1}
                    className=' px-3 py-5 text-sm text-gray-500 text-center'
                  >
                    <SpinnerLoading />
                  </td>
                </tr>
              ) : tableData.length !== 0 ? (
                tableData.map((info, key) => (
                  <Fragment key={key}>
                    <tr
                      onClick={() => rowAction && rowAction(info.rowId)}
                      className={`even:bg-gray-100 ${
                        rowAction ? 'cursor-pointer' : ''
                      } ${info?.deletedRow ? 'line-through' : ''} ${
                        info.boldRow ? 'font-bold' : ''
                      } ${info.borderTop ? 'border-t border-gray-500' : ''} ${
                        info.borderBottom ? 'border-b border-gray-500' : ''
                      }`}
                    >
                      <td className='py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                        <div className='inline-flex gap-2 items-center'>
                          {info.payload[tableTitles[0]]}
                          {info.childRows && (
                            <span
                              className='border-2 border-gray-400 rounded-full  h-4 w-4 flex justify-center items-center cursor-pointer'
                              onClick={(e) => {
                                e.stopPropagation();
                                changeChildRow(info.rowId!);
                              }}
                            >
                              {currentParent === info.rowId ? (
                                <MinusIcon className='h-full font-bold' />
                              ) : (
                                <PlusIcon className='h-full font-bold' />
                              )}
                            </span>
                          )}
                        </div>
                      </td>
                      {tableTitles.slice(1).map((item, index) => (
                        <td
                          key={index}
                          className='px-3 py-4 text-sm text-gray-500 text-ellipsis text-center'
                        >
                          {info.payload[item]}
                        </td>
                      ))}
                      {rowAction && (
                        <td className='py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                          <span className='flex justify-end text-slate-600 hover:text-indigo-900'>
                            <ChevronRight className='h-5' />
                          </span>
                        </td>
                      )}
                    </tr>
                    {info.childRows &&
                      info.childRows.map((subItem, idx) => (
                        <tr
                          hidden
                          key={idx}
                          className={`parent-${info.rowId} ${
                            key % 2 === 0 ? '' : 'bg-gray-100'
                          } cursor-pointer`}
                        >
                          <td className=' py-2 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-10'>
                            {subItem.payload[tableTitles[0]]}
                          </td>
                          {tableTitles.slice(1).map((item, index) => (
                            <td
                              key={index}
                              className='px-3 py-2 text-sm text-gray-500 text-ellipsis text-center'
                            >
                              {subItem.payload[item]}
                            </td>
                          ))}
                          {rowAction && (
                            <td className='py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                              <span className='sr-only'></span>
                            </td>
                          )}
                        </tr>
                      ))}
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tableTitles.length + 1}
                    className=' px-3 py-5 text-sm text-gray-500 txt-center'
                  >
                    <EmptyList />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {paginateComponent && paginateComponent}
        </div>
      </div>
    </div>
  );
};

export default GenericTable;

import { FieldValues, useForm } from "react-hook-form";
import { BasicType, SelectInterface } from "../../interfaces/InterfacesLocal";
import Button from "./Button";
import MultipleFilterBtn from "./MultipleFilterBtn";
import { BasicNomenclator } from "../../interfaces/ServerInterfaces";
import { useCallback, useEffect, useState } from "react";
import AsyncComboBox from "../forms/AsyncCombobox";
import ComboBox from "../forms/Combobox";
import Input from "../forms/Input";
import DateInput from "../forms/DateInput";
import MultiCombobox from "../forms/MultiCombobox";

export interface BasicTypeFilter {
  type:
  | "input"
  | "boolean"
  | "datepicker"
  | "datepicker-range"
  | "datepicker-range-including-time"
  | "select"
  | "multiselect";
  label: string;
  icon?: React.ReactNode;
  dependentOn?: string; //name del filtro del cual es dependiente esta entrada
  name: string;
  isRequired?: boolean;
  onChange?: Function;
  defaultValue?: any;
}

export interface DateTypeFilter extends BasicTypeFilter {
  datepickerRange?: FilterCodeDatePickerRange[];
  isUnitlToday?: boolean;
}

export interface SelectTypeFilter extends BasicTypeFilter {
  data: SelectInterface[];
  asyncData?: {
    url: string;
    defaultParams?: BasicType;
    idCode: string;
    dataCode: string | string[];
  };
  isLoading?: boolean;
}

export interface FilterCodeDatePickerRange {
  isUnitlToday: boolean | undefined;
  name: string;
  label: string;
}

interface FilterProps {
  filters: (BasicTypeFilter | DateTypeFilter | SelectTypeFilter)[];
  filterAction: Function;
  isMultipleFilterBtnActive?: boolean;
  alternativeSearchTitle?: string;
  loading?: boolean;
}

const initialState = (filters: Record<string, any>[], isMultipleFilterBtnActive?: boolean) => {
  return filters
    .filter((filter) => (isMultipleFilterBtnActive ? filter.isRequired : filter))
    .map((filter) => ({
      id: filter.name,
      disabled: Boolean(filter.isRequired),
      ...filter,
    }));
};

const SearchCriteriaComponent = ({ filters, filterAction, isMultipleFilterBtnActive, alternativeSearchTitle, loading }: FilterProps) => {
  const {
    control,
    register,
    unregister,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty, errors },
    reset
  } = useForm();

  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>[]>(
    initialState(filters, isMultipleFilterBtnActive !== undefined ? isMultipleFilterBtnActive : true)
  );
  const [availableFilters, setAvailableFilters] = useState<
    (BasicTypeFilter | DateTypeFilter | SelectTypeFilter)[]
  >([]);

  const onSubmit = (data: FieldValues) => {
    filterAction(data);
  };

  useEffect(() => {
    const newAvailableFilters = filters.map((filter) => {
      return {
        id: filter.name,
        disabled: Boolean(filter.isRequired),
        ...filter,
      };
    });
    const newSelectedFilters = selectedFilters.map((filter) => {
      return newAvailableFilters.find(
        (availableFilter) => availableFilter.id === filter.id
      );
    });
    //@ts-ignore
    setSelectedFilters(newSelectedFilters);

    setAvailableFilters(newAvailableFilters);
  }, [filters]);

  const generateFilterComponent = (filter: Record<string, any>) => {
    switch (filter.type) {
      case "select":
        if (filter.asyncData) {
          return (
            <AsyncComboBox
              key={filter.name}
              control={control}
              dataQuery={{
                url: filter.asyncData.url,
                defaultParams: filter.asyncData?.defaultParams,
              }}
              label={`${filter.label} ${filter.isRequired ? "*" : ""}`}
              normalizeData={{
                id: filter.asyncData.idCode,
                name: filter.asyncData.dataCode,
              }}
              dependendValue={
                filter.dependentOn
                  ? {
                    [filter.dependentOn]: watch(filter.dependentOn),
                  }
                  : undefined
              }
              {...register(filter.name, {
                required: filter.isRequired,
              })}
              defaultValue={filter.defaultValue ? filter.defaultValue : ""}
            />
          );
        }
        return (
          <ComboBox
            {...register(filter.name, {
              required: filter.isRequired,
            })}
            key={filter.name}
            changeState={filter.onChange}
            control={control}
            data={filter.data || []}
            label={`${filter.label} ${filter.isRequired ? "*" : ""}`}
            defaultValue={filter.defaultValue || ""}
            loading={filter.isLoading}
          />
        );
      case "multiselect":
        return (
          <MultiCombobox
            {...register(filter.name, {
              required: filter.isRequired,
            })}
            key={filter.name}
            changeState={filter.onChange}
            control={control}
            data={filter.data || []}
            label={`${filter.label} ${filter.isRequired ? "*" : ""}`}
            defaultValue={filter.defaultValue || ""}
            loading={filter.isLoading}
          />
        );
      case "input":
        return (
          <Input
            key={filter.name}
            control={control}
            label={`${filter.label} ${filter.isRequired ? "*" : ""}`}
            {...register(filter.name, {
              required: filter.isRequired,
            })}
            defaultValue={""}
          />
        );
      case "boolean":
        return (
          <label
            key={filter.name}
            className={`flex gap-2 text-sm font-medium items-center ${errors[filter.name] ? "text-red-900" : "text-gray-700"
              }`}>
            <input
              className={`h-4 w-4 rounded bg-transparent  ${errors[filter.name]
                ? "focus:border-red-500 focus:ring-red-500 text-red-900 border-red-300"
                : "border-gray-400  focus:ring-transparent"
                }`}
              type={"checkbox"}
              defaultValue={""}
              {...register(filter.name, {
                required: filter.isRequired,
              })}
            />
            <span>
              {filter?.icon} {`${filter.label} ${filter.isRequired ? "*" : ""}`}
            </span>
          </label>
        );
      case "datepicker-range":
        return (
          <div
            key={filter.name}
            className='flex gap-1 font-normal items-center'>
            {filter.datepickerRange?.map(
              (rangeDatePicker: FilterCodeDatePickerRange, index: number) => (
                <DateInput
                  key={index}
                  label={`${rangeDatePicker.label} ${filter.isRequired ? "*" : ""
                    }`}
                  control={control}
                  untilToday={rangeDatePicker.isUnitlToday}
                  defaultValue={null}
                  {...register(rangeDatePicker.name, {
                    required: filter.isRequired,
                  })}
                />
              )
            )}
          </div>
        );
      case "datepicker-range-including-time":
        return (
          <div
            key={filter.name}
            className='flex col-span-2 gap-1 font-normal items-center'>
            {filter.datepickerRange?.map(
              (rangeDatePicker: FilterCodeDatePickerRange, index: number) => (
                <DateInput
                  includeTime={true}
                  key={index}
                  label={`${rangeDatePicker.label} ${filter.isRequired ? "*" : ""
                    }`}
                  control={control}
                  untilToday={rangeDatePicker.isUnitlToday}
                  defaultValue={null}
                  {...register(rangeDatePicker.name, {
                    required: filter.isRequired,
                  })}
                />
              )
            )}
          </div>
        );
      case "datepicker":
        return (
          <div
            key={filter.name}
            className='flex gap-1 font-normal items-center'>
            <DateInput
              label={`${filter.label} ${filter.isRequired ? "*" : ""}`}
              control={control}
              untilToday={filter.isUnitlToday}
              {...register(filter.name, {
                required: filter.isRequired,
              })}
              defaultValue={null}
            />
          </div>
        );
      default:
        return <></>;
    }
  };

  return (
    <form
      onSubmit={handleSubmit((data, event) => onSubmit(data))}
      className='p-3 border border-slate-300 rounded-md mb-5 x-1'>
      <div className='grid grid-cols-3 gap-4'>
        {selectedFilters.length > 0 &&
          selectedFilters.map((filter) =>
            generateFilterComponent(filter)
          )}
      </div>
      <div
        className={`flex ${selectedFilters.length ? "pt-5 justify-end" : "justify-between"
          }`}>
        {selectedFilters.length === 0 && (
          <div className='flex items-center text-sm font-medium text-slate-500'>
            <p className="cursor-default">Seleccione un criterio de búsqueda</p>
          </div>
        )}
        <div className='flex gap-4 justify-end'>
          {
            (isMultipleFilterBtnActive || isMultipleFilterBtnActive === undefined) && (
              <MultipleFilterBtn
                btnName='Criterios de búsqueda'
                //@ts-ignore
                selected={selectedFilters}
                //@ts-ignore
                data={availableFilters}
                setSelected={(data: BasicNomenclator[], unregistered?: string) => {
                  setSelectedFilters(data);
                  unregistered && unregister(unregistered)
                }
                }
                onClear={() => {
                  
                  if (selectedFilters.length > 0) {
                      reset();
                      setSelectedFilters(() => initialState(filters, isMultipleFilterBtnActive !== undefined ? isMultipleFilterBtnActive : true));
                      }
                }}
              />
            )
          }

          <Button
            color='slate-600'
            type='submit'
            name={`${alternativeSearchTitle ? alternativeSearchTitle : "Buscar"}`}
            loading={loading}
            disabled={isSubmitting || !isDirty || loading}
          />
        </div>
      </div>
    </form>
  );
};

export default SearchCriteriaComponent;

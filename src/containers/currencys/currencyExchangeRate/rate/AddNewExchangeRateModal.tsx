

import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import Input from '../../../../components/forms/Input';
import Button from '../../../../components/misc/Button';
import { deleteUndefinedAttr } from '../../../../utils/helpers';
import AsyncComboBox from '../../../../components/forms/AsyncCombobox';

interface propsDestructured {
  close: Function,
  registerNewExchangeRate: any
  isFetching: boolean
}

const AddNewExchangeRateModal = ({
  close,
  registerNewExchangeRate,
  isFetching }: propsDestructured) => {


  const { control, handleSubmit } = useForm();

  const onSubmit: SubmitHandler<Record<string, string | number | boolean>> = (
    data: any
  ) => {
    registerNewExchangeRate(deleteUndefinedAttr(data), close)
  };

  return (
    <>
      <p className='mb-4 font-semibold text-lg text-center'>Nueva tasa de cambio</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-stretch h-full"
      >
        <div className='my-1'>
          <AsyncComboBox
            label="Moneda base"
            name="baseCurrencyId"
            control={control}
            rules={{ required: "Este campo es requerido" }}
            normalizeData={{ id: 'id', name: 'name' }}
            dataQuery={{ url: '/currency' }}
          />
        </div>

        <div className='my-1'>
          <AsyncComboBox
            label="Moneda dependiente"
            name="dependentCurrencyId"
            control={control}
            rules={{ required: "Este campo es requerido" }}
            normalizeData={{ id: 'id', name: 'name' }}
            dataQuery={{ url: '/currency' }}
          />
        </div>

        <div className='my-1'>
          <Input
            label="Tasa de compra"
            name="buyRate"
            control={control}
            rules={{ required: "Este campo es requerido" }}
            type='number'
          />
        </div>

        <div className='my-1'>
          <Input
            label="Tasa de venta"
            name="sellRate"
            control={control}
            rules={{ required: "Este campo es requerido" }}
            type='number'
          />
        </div>


        <div className="flex justify-end pt-10 self-end">
          <Button name="Agregar" color="slate-600" type="submit" loading={isFetching} />
        </div>
      </form>
    </>
  )
}

export default AddNewExchangeRateModal

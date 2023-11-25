

import React, { useState } from 'react'
import { ExchangeRateInterface } from '../../../../interfaces/ServerInterfaces'
import { SubmitHandler, useForm } from 'react-hook-form';
import { deleteUndefinedAttr } from '../../../../utils/helpers';
import Input from '../../../../components/forms/Input';
import Button from '../../../../components/misc/Button';
import AsyncComboBox from '../../../../components/forms/AsyncCombobox';
import { TrashIcon } from '@heroicons/react/20/solid';
import Modal from '../../../../components/modals/GenericModal';
import AlertContainer from '../../../../components/misc/AlertContainer';

interface propsDestructured {
    id: number,
    close: Function,
    updateExchangeRate: any,
    deleteExchangeRate: any,
    isFetching: boolean,
    allExchangeRates: ExchangeRateInterface[]
}


const EditExchangeRateModal = ({
    id,
    close,
    updateExchangeRate,
    isFetching,
    allExchangeRates,
    deleteExchangeRate
}: propsDestructured) => {

    const [alert, setAlert] = useState(false);

    const { control, handleSubmit } = useForm();

    const onSubmit: SubmitHandler<Record<string, string | number | boolean>> = (
        data: any
    ) => {
        updateExchangeRate(id, deleteUndefinedAttr(data), close).then(() => close())
    };

    const currentExchangeRate = allExchangeRates.find(curr => curr.id === id)


    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-stretch h-full"
            >

                <div className='flex justify-between items-center'>
                    <p className='mb-4 font-semibold text-lg text-center'>Editar tasa</p>

                </div>



                <div className='my-1'>
                    <AsyncComboBox
                        label="Moneda base"
                        name="baseCurrencyId"
                        control={control}
                        rules={{ required: "Este campo es requerido" }}
                        normalizeData={{ id: 'id', name: 'name' }}
                        dataQuery={{ url: '/currency' }}
                        defaultValue={currentExchangeRate?.baseCurrency.name}
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
                        defaultValue={currentExchangeRate?.dependentCurrency.name}
                    />
                </div>

                <div className='my-1'>
                    <Input
                        label="Tasa de compra"
                        name="buyRate"
                        control={control}
                        rules={{ required: "Este campo es requerido" }}
                        type='number'
                        defaultValue={currentExchangeRate?.buyRate}
                    />
                </div>

                <div className='my-1'>
                    <Input
                        label="Tasa de venta"
                        name="sellRate"
                        control={control}
                        rules={{ required: "Este campo es requerido" }}
                        type='number'
                        defaultValue={currentExchangeRate?.sellRate}
                    />
                </div>

                <div className="flex justify-end pt-10 self-end">

                    <div className='mr-2'>
                        <Button
                            name="Eliminar"
                            icon={<TrashIcon className="h-5" />}
                            color="red-600"
                            type="button"
                            textColor="white"
                            loading={isFetching}
                            action={() => setAlert(true)}
                        />
                    </div>

                    <Button name="Actualizar" color="slate-600" type="submit" loading={isFetching} />
                </div>
            </form>

            {alert && (
                <Modal state={alert} close={setAlert}>
                    <AlertContainer
                        onAction={() =>
                            deleteExchangeRate && deleteExchangeRate(currentExchangeRate?.id ?? null, close).then(() => close())
                        }
                        onCancel={() => setAlert(false)}
                        title={`Eliminar`}
                        text="¿Seguro que desea eliminar esta tasa?"
                    />
                </Modal>
            )}
        </>
    )
}

export default EditExchangeRateModal

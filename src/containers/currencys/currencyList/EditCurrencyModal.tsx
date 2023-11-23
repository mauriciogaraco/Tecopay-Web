import React from 'react'
import Button from '../../../components/misc/Button'
import Input from '../../../components/forms/Input'
import { SubmitHandler, useForm } from 'react-hook-form';
import { CurrencyInterface } from '../../../interfaces/ServerInterfaces';
import { deleteUndefinedAttr } from '../../../utils/helpers';


interface propsDestructured {
    id: number,
    close: Function,
    updateCurrency: any,
    isFetching: boolean,
    allCurrencys: CurrencyInterface[]
}

const EditCurrencyModal = ({
    id,
    close,
    updateCurrency,
    isFetching,
    allCurrencys
}: propsDestructured) => {

    const { control, handleSubmit } = useForm();

    const onSubmit: SubmitHandler<Record<string, string | number | boolean>> = (
        data: any
    ) => {
        updateCurrency(id, deleteUndefinedAttr(data), close).then(() => close())
    };

    const currentCurrency = allCurrencys.find(curr => curr.id === id)

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-stretch h-full"
        >
            <div className="">
                <Input
                    label="Nombre"
                    name="name"
                    control={control}
                    // placeholder="Inserte el código del cupón"
                    rules={{ required: "Este campo es requerido" }}
                    defaultValue={currentCurrency?.name}
                />
            </div>

            <div className="">
                <Input
                    label="Código"
                    name="code"
                    control={control}
                    // placeholder="Inserte el código del cupón"
                    rules={{ required: "Este campo es requerido" }}
                    defaultValue={currentCurrency?.code}
                />
            </div>

            <div className="">
                <Input
                    label="Símbolo"
                    name="symbol"
                    control={control}
                    // placeholder="Inserte el código del cupón"
                    rules={{ required: "Este campo es requerido" }}
                    defaultValue={currentCurrency?.symbol}
                />
            </div>



            <div className="flex justify-end pt-10 self-end">
                <Button name="Actualizar" color="slate-600" type="submit" loading={isFetching} />
            </div>
        </form>
    )
}

export default EditCurrencyModal

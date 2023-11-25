

import { SubmitHandler, useForm } from 'react-hook-form';
import Input from '../../../components/forms/Input';
import Button from '../../../components/misc/Button';
import useServerCurrency from '../../../api/useServerCurrency';
import { deleteUndefinedAttr } from '../../../utils/helpers';

interface propsDestructured {
    close: Function,
    registerNewCurrency: any
    isFetching: boolean
}

const AddNewCurrencyModal = ({
    close,
    registerNewCurrency,
    isFetching }: propsDestructured) => {

    const { control, handleSubmit } = useForm();

    const onSubmit: SubmitHandler<Record<string, string | number | boolean>> = (
        data: any
    ) => {
        registerNewCurrency(deleteUndefinedAttr(data), close).then(() => close())
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-stretch h-full"
        >
            <p className='mb-4 font-semibold text-lg text-center'>Nueva moneda</p>

            <div className="my-1">
                <Input
                    label="Nombre"
                    name="name"
                    control={control}
                    rules={{ required: "Este campo es requerido" }}
                />
            </div>

            <div className="my-1">
                <Input
                    label="Código"
                    name="code"
                    control={control}
                    // placeholder="Inserte el código del cupón"
                    rules={{ required: "Este campo es requerido" }}
                />
            </div>

            <div className="my-1">
                <Input
                    label="Símbolo"
                    name="symbol"
                    control={control}
                    // placeholder="Inserte el código del cupón"
                    rules={{ required: "Este campo es requerido" }}
                />
            </div>



            <div className="flex justify-end pt-10 self-end">
                <Button name="Agregar" color="slate-600" type="submit" loading={isFetching} />
            </div>
        </form>
    )
}

export default AddNewCurrencyModal

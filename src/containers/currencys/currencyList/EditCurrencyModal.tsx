import React, { useState } from 'react';
import Button from '../../../components/misc/Button';
import Input from '../../../components/forms/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CurrencyInterface } from '../../../interfaces/ServerInterfaces';
import { deleteUndefinedAttr } from '../../../utils/helpers';
import { TrashIcon } from '@heroicons/react/20/solid';
import Modal from '../../../components/modals/GenericModal';
import AlertContainer from '../../../components/misc/AlertContainer';

interface propsDestructured {
	id: number;
	close: Function;
	updateCurrency: any;
	deleteCurrency: any;
	isFetching: boolean;
	allCurrencys: CurrencyInterface[];
}

const EditCurrencyModal = ({
	id,
	close,
	updateCurrency,
	isFetching,
	allCurrencys,
	deleteCurrency,
}: propsDestructured) => {
	const [alert, setAlert] = useState(false);

	const { control, handleSubmit } = useForm();

	const onSubmit: SubmitHandler<Record<string, string | number | boolean>> = (
		data: any,
	) => {
		updateCurrency(id, deleteUndefinedAttr(data), close).then(() => close());
	};

	const currentCurrency = allCurrencys.find((curr) => curr.id === id);

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col items-stretch h-full'
			>
				<div className='flex justify-between items-center'>
					<p className='mb-4 font-semibold text-lg'>Editar moneda</p>
				</div>
				<div className='my-1'>
					<Input
						label='Nombre'
						name='name'
						control={control}
						// placeholder="Inserte el código del cupón"
						rules={{ required: 'Este campo es requerido' }}
						defaultValue={currentCurrency?.name}
					/>
				</div>

				<div className='my-1'>
					<Input
						label='Código'
						name='code'
						control={control}
						// placeholder="Inserte el código del cupón"
						rules={{ required: 'Este campo es requerido' }}
						defaultValue={currentCurrency?.code}
					/>
				</div>

				<div className='my-1'>
					<Input
						label='Símbolo'
						name='symbol'
						control={control}
						// placeholder="Inserte el código del cupón"
						rules={{ required: 'Este campo es requerido' }}
						defaultValue={currentCurrency?.symbol}
					/>
				</div>

				<div className='flex justify-end pt-10 self-end'>
					<div className='mr-2'>
						<Button
							name='Eliminar'
							icon={<TrashIcon className='h-5' />}
							color='red-600'
							type='button'
							textColor='white'
							loading={isFetching}
							action={() => setAlert(true)}
						/>
					</div>

					<Button
						name='Actualizar'
						color='slate-600'
						type='submit'
						loading={isFetching}
					/>
				</div>
			</form>

			{alert && (
				<Modal state={alert} close={close}>
					<AlertContainer
						onAction={() =>
							deleteCurrency &&
							deleteCurrency(currentCurrency?.id ?? null, close).then(() =>
								close(),
							)
						}
						onCancel={() => setAlert(false)}
						title={`Eliminar ${currentCurrency?.name}`}
						text='¿Seguro que desea eliminar esta moneda?'
					/>
				</Modal>
			)}
		</>
	);
};

export default EditCurrencyModal;

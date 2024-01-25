import { SubmitHandler, useForm } from 'react-hook-form';
import Input from '../../../../components/forms/Input';
import Button from '../../../../components/misc/Button';
import { deleteUndefinedAttr } from '../../../../utils/helpers';
import { useAppSelector } from '../../../../store/hooks';

interface propsInterface {
	defaultAddress?: number;
	Charge: Function;
	isFetching: boolean;
	closeModal: Function;
}

const Charge = ({
	defaultAddress,
	Charge,
	isFetching,
	closeModal,
}: propsInterface) => {
	const { control, handleSubmit, reset } = useForm({
		mode: 'onChange',
	});

	const id = useAppSelector((state) => state.account.id);

	const onSubmit: SubmitHandler<Record<string, string | number>> = (data) => {
		let Str = data.address.toString();
		let noSpace = Str.replace(/\s+/g, '');
		let dataTosend = {
			...data,
			address: noSpace,
		};
		Charge(deleteUndefinedAttr(dataTosend), id, closeModal)
	};
	return (
		<form
			className='flex flex-col'
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className='flex flex-col gap-6 items-center w-full justify-center'>
				<p className='font-semibold text-lg text-center'>Recargar</p>
				<Input
					defaultValue={defaultAddress}
					name='address'
					label='Dirección a recargar'
					placeholder='xxxx xxxx xxxx'
					rules={{ required: 'Campo requerido' }}
					control={control}
				></Input>
				<Input

					name='amount'
					label='Cantidad'
					type='number'
					placeholder='0.00'
					rules={{
						required: 'Campo requerido',
						validate: (value) => {
							if (parseInt(value) === 0) {
								return 'El valor no puede ser cero';
							}
							return true;
						},
					}}
					control={control}
				></Input>
				<div className='flex self-end mt-4'>
					<Button
						name='Recargar'
						color='slate-600'
						loading={isFetching}
						type='submit'
					/>
				</div>
			</div>
		</form>
	);
};

export default Charge;

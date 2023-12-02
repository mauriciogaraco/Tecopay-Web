import { SubmitHandler, useForm } from 'react-hook-form';
import Input from '../../components/forms/Input';
import Button from '../../components/misc/Button';
import useServerAccounts from '../../api/userServerAccounts';
import { deleteUndefinedAttr } from '../../utils/helpers';
import { useRef } from 'react';

const Transfer = () => {
	const { Charge, isFetching } = useServerAccounts();
	const { control, handleSubmit, reset } = useForm({
		mode: 'onChange',
	});

	const changeState = useRef((newState: any) => {});
	const changeChildState = (newState: any) => {
		if (changeState.current) {
			changeState.current(newState);
		}
	};
	const onSubmit: SubmitHandler<Record<string, string | number>> = (data) => {
		let Str = data.address.toString();
		let noSpace = Str.replace(/\s+/g, '');
		let dataTosend = {
			...data,
			address: noSpace,
		};
		Charge(deleteUndefinedAttr(dataTosend)).then(() => changeChildState(''));
	};
	return (
		<div className='w-full h-full flex justify-center items-center'>
			<div className='w-1/2 bg-white shadow-lg rounded-lg h-1/2'>
				<form className='flex w-hull h-full' onSubmit={handleSubmit(onSubmit)}>
					<div className='gap-10 items-center w-full justify-center flex flex-col px-20'>
						<p className='font-semibold text-lg text-center'>Recargar</p>
						<Input
							changeState={changeState}
							name='address'
							label='Dirección a recargar'
							placeholder='xxxx xxxx xxxx'
							rules={{ required: 'Campo requerido' }}
							control={control}
						></Input>
						<Input
							changeState={changeState}
							name='amount'
							label='Cantidad'
							type='number'
							placeholder='0.00'
							rules={{ required: 'Campo requerido' }}
							control={control}
						></Input>
						<div className='flex self-end'>
							<Button
								name='Recargar'
								color='slate-600'
								loading={isFetching}
								type='submit'
							/>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Transfer;

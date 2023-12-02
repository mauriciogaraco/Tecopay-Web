import { SubmitHandler, useForm } from 'react-hook-form';
import Input from '../../components/forms/Input';
import Button from '../../components/misc/Button';
import useServerAccounts from '../../api/userServerAccounts';
import { deleteUndefinedAttr } from '../../utils/helpers';
import { useRef } from 'react';

const Transfer = () => {
	const { Transfer, isFetching } = useServerAccounts();
	const { control, handleSubmit, watch, reset } = useForm({
		mode: 'onChange',
	});

	const changeState = useRef((newState: any) => {});
	const changeChildState = (newState: any) => {
		if (changeState.current) {
			changeState.current(newState);
		}
	};
	const onSubmit: SubmitHandler<Record<string, string | number>> = (data) => {
		let StrSource = data.source.toString();
		let StrTarget = data.source.toString();
		let noSpaceSource = StrSource.replace(/\s+/g, '');
		let noSpaceTarget = StrTarget.replace(/\s+/g, '');
		let dataTosend = {
			...data,
			source: noSpaceSource,
			target: noSpaceTarget,
		};
		Transfer(deleteUndefinedAttr(dataTosend)).then(() => changeChildState(''));
	};
	return (
		<div className='w-full h-full flex justify-center items-center'>
			<div className='w-1/2 bg-white shadow-lg rounded-lg h-1/2'>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='gap-5 flex flex-col mt-8 px-20'>
						<p className='font-semibold text-lg text-center'>Transferir</p>
						<Input
							changeState={changeState}
							name='source'
							label='Dirección que envia'
							placeholder='xxxx xxxx xxxx'
							rules={{ required: 'Campo requerido' }}
							control={control}
						></Input>
						<Input
							changeState={changeState}
							name='target'
							label='Dirección que recibe'
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
								name='Transferir'
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

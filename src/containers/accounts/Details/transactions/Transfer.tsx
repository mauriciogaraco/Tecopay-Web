import { SubmitHandler, useForm } from 'react-hook-form';
import Input from '../../../../components/forms/Input';
import Button from '../../../../components/misc/Button';
import { deleteUndefinedAttr } from '../../../../utils/helpers';

interface propsInterface {
	defaultAddress?: number;
	Transfer: Function;
	isFetching: boolean;
	closeModal: Function;
}

const Transfer = ({
	defaultAddress,
	Transfer,
	isFetching,
	closeModal,
}: propsInterface) => {
	const { control, handleSubmit, watch, reset } = useForm({
		mode: 'onChange',
	});

	const onSubmit: SubmitHandler<Record<string, string | number>> = (data) => {
		let StrSource = data.source.toString();
		let StrTarget = data.target.toString();
		let noSpaceSource = StrSource.replace(/\s+/g, '');
		let noSpaceTarget = StrTarget.replace(/\s+/g, '');
		let dataTosend = {
			...data,
			source: noSpaceSource,
			target: noSpaceTarget,
		};
		Transfer(deleteUndefinedAttr(dataTosend), closeModal)
	};
	return (
		<form
			className='flex flex-col mt-2  gap-6'
			onSubmit={handleSubmit(onSubmit)}
		>
			<p className='font-semibold text-lg text-center'>Transferir</p>
			<Input
				defaultValue={defaultAddress}
				name='source'
				label='Dirección que envia'
				placeholder='xxxx xxxx xxxx'
				rules={{ required: 'Campo requerido' }}
				control={control}
			></Input>

			<Input
				name='target'
				label='Dirección que recibe'
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
			<Input
				name='securityPin'
				label='PIN'
				placeholder='xxxx xxxx xxxx'
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
		</form>
	);
};

export default Transfer;

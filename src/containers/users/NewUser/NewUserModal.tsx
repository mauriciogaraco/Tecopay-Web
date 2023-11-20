import useServerUser from '../../../api/userServerUsers';
import { type SubmitHandler, useForm } from 'react-hook-form';
import ComboBox from '../../../components/forms/Combobox';
import TextArea from '../../../components/forms/TextArea';
import { SelectInterface } from '../../../interfaces/LocalInterfaces';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { useEffect } from 'react';
import Modal from '../../../components/misc/GenericModal';
import { deleteUndefinedAttr } from '../../../utils/helpers';
import Input from '../../../components/forms/Input';
import Select from '../../../components/forms/Select';
import Toggle from '../../../components/forms/Toggle';
import AsyncComboBox from '../../../components/forms/AsyncCombobox';
import Button from '../../../components/misc/Button';

interface propsDestructured {
	close: Function;
	addUser: Function;
	isLoading: boolean;
}

const NewUserModalVariantOne = ({
	addUser,
	close,
	isLoading,
}: propsDestructured) => {
	const { control, handleSubmit } = useForm();

	const onSubmit: SubmitHandler<
		Record<string, string | number | boolean | string[]>
	> = (data) => {
		const sendData = Object.assign(data, {
			ownerId: 1,
		});
		console.log(sendData);
		try {
			addUser(deleteUndefinedAttr(sendData), close).then(() => close());
		} catch (error) {}
	};

	return (
		<main>
			<div>
				<h3 className='p-4 text-xl md:text-2xl'>Nuevo usuario</h3>
				<form
					className='flex flex-col gap-y-3'
					onSubmit={handleSubmit(onSubmit)}
				>
					<Input
						name='name'
						label='Nombre'
						placeholder='Nombre del usuario'
						control={control}
						rules={{ required: 'Campo requerido' }}
					></Input>

					<AsyncComboBox
						name='currencyId'
						control={control}
						rules={{ required: 'Campo requerido' }}
						label='Moneda'
						dataQuery={{ url: '/currency' }}
						normalizeData={{ id: 'id', name: 'symbol' }}
					></AsyncComboBox>

					<AsyncComboBox
						name='issueEntityId'
						control={control}
						rules={{ required: 'Campo requerido' }}
						label='Entidad'
						dataQuery={{ url: '/entity' }}
						normalizeData={{ id: 'id', name: 'name' }}
					></AsyncComboBox>

					<div className='h-full'>
						<TextArea
							name='description'
							rules={{ required: 'Campo requerido' }}
							control={control}
							paddingInput='py-0'
							label='Descripción'
						></TextArea>
					</div>
					<div className='flex self-end'>
						<Button
							name='Insertar'
							color='slate-600'
							type='submit'
							loading={isLoading}
						/>
					</div>
				</form>
			</div>
		</main>
	);
};

export default NewUserModalVariantOne;

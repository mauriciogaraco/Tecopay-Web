import CreateContactModal from '../../../components/modals/CreateContactModal';
import useServerUser from '../../../api/userServerAccounts';
import { SubmitHandler, useForm } from 'react-hook-form';
import ComboBox from '../../../components/forms/Combobox';
import TextArea from '../../../components/forms/TextArea';
import { SelectInterface } from '../../../interfaces/LocalInterfaces';
import { useAppSelector } from '../../../store/hooks';
import { useEffect } from 'react';
import Modal from '../../../components/misc/GenericModal';
import { useAppDispatch } from '../../../store/hooks';
import { deleteUndefinedAttr } from '../../../utils/helpers';
import Input from '../../../components/forms/Input';
import Select from '../../../components/forms/Select';
import Toggle from '../../../components/forms/Toggle';
import AsyncComboBox from '../../../components/forms/AsyncCombobox';
import Button from '../../../components/misc/Button';
import useServerEntity from '../../../api/userServerEntity';

interface propsDestructured {
	setContactModal: (contactModal: boolean) => void;
	contactModal: boolean;
	setNuevoTicketModal: (contactModal: boolean) => void;
	nuevoTicketModal: boolean;
	close: Function;
	addEntity: Function;
	isLoading: boolean;
}

const NewEntityModal = ({
	setContactModal,
	addEntity,
	close,
	isLoading,
}: propsDestructured) => {
	const { control, handleSubmit } = useForm();

	const onSubmit: SubmitHandler<
		Record<string, string | number | boolean | string[]>
	> = (data) => {
		const sendData = Object.assign(data, {
			ownerId: 1,
			businessId: 6,
		});

		try {
			addEntity(deleteUndefinedAttr(sendData), close).then(() => close());
		} catch (error) {}
	};

	return (
		<main>
			<div>
				<p className='mb-4 font-semibold text-lg text-center'>Nueva entidad</p>
				<form
					className='flex flex-col gap-y-3'
					onSubmit={handleSubmit(onSubmit)}
				>
					<Input
						name='name'
						label='Nombre'
						placeholder='Nombre de la Entidad'
						control={control}
						rules={{ required: 'Campo requerido' }}
					></Input>

					<div className='h-full'>
						<Input
							name='phone'
							label='Telefono'
							placeholder='Telefono'
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
							name='ownerId'
							control={control}
							rules={{ required: 'Campo requerido' }}
							label='Dueño'
							dataQuery={{ url: '/user' }}
							normalizeData={{ id: 'id', name: 'fullName' }}
						></AsyncComboBox>
						<AsyncComboBox
							name='businessId'
							control={control}
							rules={{ required: 'Campo requerido' }}
							label='Negocio'
							dataQuery={{ url: '/business' }}
							normalizeData={{ id: 'id', name: 'name' }}
						></AsyncComboBox>

						<TextArea
							name='address'
							rules={{ required: 'Campo requerido' }}
							control={control}
							label='Dirección'
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

export default NewEntityModal;

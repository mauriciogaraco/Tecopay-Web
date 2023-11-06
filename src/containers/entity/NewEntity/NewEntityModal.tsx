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
}

const NewEntityModal = ({ setContactModal, close }: propsDestructured) => {
	const { control, handleSubmit } = useForm();

	const onSubmit: SubmitHandler<
		Record<string, string | number | boolean | string[]>
	> = (data) => {
		const sendData = Object.assign(data, {
			status: 'ACTIVA',
			userId: 1,
		});
		console.log(sendData);
		try {
			addEntity(deleteUndefinedAttr(sendData), close).then(() => close());
		} catch (error) {}
	};

	const {
		paginate,
		isLoading,
		isFetching,
		waiting,
		modalWaiting,
		allUsers,
		entity,
		setAllTickets,
		allTickets,
		getAllEntity,
		addEntity,
		getEntity,
		editEntity,
		updateEntity,
		updateMyEntity,
		deleteEntity,
		setAllUsers,
		manageErrors,
		modalWaitingError,
	} = useServerEntity();

	return (
		<main>
			<div>
				<h3 className='p-4 text-xl md:text-2xl'>Nueva cuenta</h3>
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
						<TextArea
							name='address'
							rules={{ required: 'Campo requerido' }}
							control={control}
							label='Direccion'
						></TextArea>

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
							dataQuery={{ url: '/currency/all' }}
							normalizeData={{ id: 'id', name: 'symbol' }}
						></AsyncComboBox>
					</div>
					<div className='relative rounded-lg self-center lg:self-end w-[100%] lg:w-[30%] h-[40px] items-center justify-center flex mt-8 bg-indigo-600  text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
						<Button
							loading={isLoading}
							color='blue-500'
							name='Insertar'
							type='submit'
						></Button>
					</div>
				</form>
			</div>
		</main>
	);
};

export default NewEntityModal;

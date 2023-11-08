import { useState } from 'react';
import Input from '../../../components/forms/Input';
import Button from '../../../components/misc/Button';
import { deleteUndefinedAttr, validateEmail } from '../../../utils/helpers';
import Toggle from '../../../components/forms/Toggle';
import { type SubmitHandler, useForm } from 'react-hook-form';
import useServerUser from '../../../api/userServerAccounts';
import {
	AccountData,
	UserInterface,
} from '../../../interfaces/ServerInterfaces';
import { TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../../../components/modals/GenericModal';
import AlertContainer from '../../../components/misc/AlertContainer';
import {
	type BasicType,
	type SelectInterface,
} from '../../../interfaces/InterfacesLocal';
import TextArea from '../../../components/forms/TextArea';
import Select from '../../../components/forms/Select';
import ComboBox from '../../../components/forms/Combobox';
import AsyncComboBox from '../../../components/forms/AsyncCombobox';

interface EditInterface {
	Card: any;
	editCard: Function;
	deleteCard: Function;
	closeModal: Function;
	isFetching: boolean;
	id: number | null;
	allCards: any;
}
const selectData = [
	{ id: 1, name: true },
	{ id: 2, name: 'cerrado' },
];
const prioridad: SelectInterface[] = [
	{ id: '1', name: 'baja' },
	{ id: '2', name: 'media' },
	{ id: '3', name: 'alta' },
];

const clasificacion: SelectInterface[] = [
	{ id: '1', name: 'Conectividad' },
	{ id: '2', name: 'Plataforma Web' },
	{ id: '3', name: 'Aplicaciones Móviles' },
	{ id: '4', name: 'Servidores' },
];

const DetailCardEditComponent = ({
	editCard,
	deleteCard,
	Card,
	closeModal,
	isFetching,
	id,
	allCards,
}: EditInterface) => {
	const { control, handleSubmit, watch, reset, formState } = useForm<BasicType>(
		{
			mode: 'onChange',
		},
	);
	const [delAction, setDelAction] = useState(false);

	const onSubmit: SubmitHandler<BasicType> = (data) => {
		const date = Card?.data.expiratedAt;
		const WholeData = Object.assign(data, {
			holderId: 251,
			expiratedAt: date,
			code: Card?.data.code,
		});
		editCard(Card?.data.id, deleteUndefinedAttr(WholeData), reset()).then(() =>
			closeModal(),
		);
	};

	const desiredCurrencyCodeEntityObject: any = allCards.find(
		(item: any) => item.id === id,
	);

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='h-96 overflow-auto scrollbar-thin scrollbar-thumb-slate-100 pr-5 pl-2'>
					<div className='flex justify-end'>
						<div className='bg-red-200 hover:bg-red-300 transition-all duration-200 ease-in-out  rounded-lg'>
							<Button
								icon={<TrashIcon className='h-5 text-gray-700' />}
								color='gray-500'
								type='button'
								action={() => {
									setDelAction(true);
								}}
								outline
							/>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-5'>
						<Input
							name='securityPin'
							label='Pin'
							defaultValue={Card?.data.securityPin}
							placeholder='Telefono'
							control={control}
							rules={{ required: 'Campo requerido' }}
						></Input>
						<Input
							name='minAmountWithoutConfirmation'
							label='Cantidad sin confirmar'
							defaultValue={Card?.data.minAmountWithoutConfirmation}
							placeholder='Telefono'
							control={control}
							rules={{ required: 'Campo requerido' }}
						></Input>
						<AsyncComboBox
							name='currencyId'
							defaultItem={{
								id: Card?.data.currencyId,
								name: desiredCurrencyCodeEntityObject?.currency?.code,
							}}
							defaultValue={Card?.data.currencyId}
							control={control}
							rules={{ required: 'Campo requerido' }}
							label='Moneda'
							dataQuery={{ url: '/currency/all' }}
							normalizeData={{ id: 'id', name: 'code' }}
						></AsyncComboBox>
					</div>
					<div className='flex py-5 justify-around gap-5'></div>

					<TextArea
						defaultValue={Card?.data.address}
						name='address'
						control={control}
						label='Direccion'
					></TextArea>
					<TextArea
						defaultValue={Card?.data.description}
						name='description'
						control={control}
						label='description'
					></TextArea>
					<Toggle
						title='Tarjeta bloqueada'
						control={control}
						defaultValue={Card?.data.isBlocked}
						name='isBlocked'
					></Toggle>
					<div className='flex justify-end mt-5'>
						<Button
							name='Actualizar'
							color='slate-600'
							type='submit'
							loading={isFetching}
							disabled={isFetching}
						/>
					</div>
				</div>
			</form>

			{delAction && (
				<Modal state={delAction} close={setDelAction}>
					<AlertContainer
						onAction={() => deleteCard(Card?.data.id, closeModal)}
						onCancel={setDelAction}
						title={`Eliminar ${Card?.data.name}`}
						text='¿Seguro que desea eliminar este usuario del sistema?'
						loading={isFetching}
					/>
				</Modal>
			)}
		</>
	);
};

export default DetailCardEditComponent;

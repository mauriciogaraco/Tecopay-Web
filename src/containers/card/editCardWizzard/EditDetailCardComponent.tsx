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
import useServerCards from '../../../api/userServerCards';

interface EditInterface {
	Card: any;
	editCard: Function;
	deleteCard: Function;
	closeModal: Function;
	isFetching: boolean;
	id: number | null;
	allCards: any;
	setSelectedDataToParent: any;
}

const EditDetailCardComponent = ({
	editCard,
	deleteCard,
	Card,
	closeModal,
	isFetching,
	id,
	allCards,
	setSelectedDataToParent,
}: EditInterface) => {
	const { control, handleSubmit, watch, reset, formState } = useForm<BasicType>(
		{
			mode: 'onChange',
		},
	);
	const [delAction, setDelAction] = useState(false);

	const onSubmit: SubmitHandler<BasicType> = (data) => {
		editCard(Card?.data.id, deleteUndefinedAttr(data), reset()).then(() =>
			closeModal(),
		);
	};

	const desiredCurrencyCodeEntityObject: any = allCards.find(
		(item: any) => item.id === id,
	);

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='h-96 overflow-auto w-full scrollbar-thin scrollbar-thumb-slate-100 pr-5 pl-2'>
					<div className='flex justify-end'>
						<div className='bg-red-200 hover:bg-red-300 transition-all duration-200 ease-in-out  rounded-lg'>
							<Button
								icon={<TrashIcon className='h-5 text-red-500' />}
								color='gray-50'
								type='button'
								action={() => {
									setDelAction(true);
								}}
								outline
							/>
						</div>
					</div>
					<Input
						name='securityPin'
						label='Nombre'
						defaultValue={Card?.data.securityPin}
						placeholder='Nombre de la tarjeta'
						control={control}
						rules={{ required: 'Campo requerido' }}
					></Input>

					<div className='flex py-2 justify-around gap-5'></div>
					<TextArea
						defaultValue={Card?.data.description}
						name='description'
						control={control}
						label='description'
					></TextArea>
					<div className=' w-full mt-5 justify-between flex'>
						<Toggle
							title='Tarjeta bloqueada'
							control={control}
							defaultValue={Card?.data.isBlocked}
							name='isBlocked'
						></Toggle>

						<Button
							name='Resetear PIN'
							color='slate-600'
							type='submit'
							loading={isFetching}
							disabled={isFetching}
						/>
					</div>

					<div className='flex justify-end mt-16'>
						<Button
							name='Insertar'
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

export default EditDetailCardComponent;

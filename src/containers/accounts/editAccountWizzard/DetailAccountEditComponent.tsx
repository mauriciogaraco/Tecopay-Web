import { useState } from 'react';
import Input from '../../../components/forms/Input';
import Button from '../../../components/misc/Button';
import { deleteUndefinedAttr, validateEmail } from '../../../utils/helpers';
import Toggle from '../../../components/forms/Toggle';
import { type SubmitHandler, useForm } from 'react-hook-form';

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
import useServerAccounts from '../../../api/userServerAccounts';

interface EditInterface {
	account: any;
	editAccount: Function;
	deleteAccount: Function;
	closeModal: Function;
	isFetching: boolean;
	id: number | null;
	setSelectedDataToParent: Function;
	allAccounts: any;
	selectedDataToParent: any;
	setSelectedDataToParentTwo: any;
}

const DetailAccountEditComponent = ({
	editAccount,
	deleteAccount,
	account,
	closeModal,
	isFetching,
	id,
	setSelectedDataToParent,
	allAccounts,
	selectedDataToParent,
	setSelectedDataToParentTwo,
}: EditInterface) => {
	const { control, handleSubmit, watch, reset, formState } = useForm<BasicType>(
		{
			mode: 'onChange',
		},
	);
	const desiredCurrencyCodeEntityObject: any = allAccounts.find(
		(item: any) => item.id === id,
	);

	const [delAction, setDelAction] = useState(false);

	const onSubmit: SubmitHandler<BasicType> = (data) => {
		const WholeData = Object.assign(data, {
			code: '123456',
			ownerId: 251,
			id: account?.data.id,
		});
		editAccount(account?.data.id, deleteUndefinedAttr(WholeData), reset()).then(
			() => closeModal(),
		);
	};

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
							name='name'
							defaultValue={account?.data.name}
							label='Nombre'
							control={control}
							rules={{
								required: 'Campo requerido',
							}}
						/>

						<AsyncComboBox
							name='issueEntityId'
							defaultItem={{
								id: account?.data.issueEntityId,
								name: desiredCurrencyCodeEntityObject?.issueEntity?.name,
							}}
							defaultValue={account?.data.issueEntityId}
							control={control}
							rules={{ required: 'Campo requerido' }}
							label='Entidad'
							setSelectedDataToParentTwo={setSelectedDataToParentTwo}
							dataQuery={{ url: '/entity/all' }}
							normalizeData={{ id: 'id', name: 'name' }}
						></AsyncComboBox>
						<AsyncComboBox
							name='currencyId'
							defaultItem={{
								id: account?.data.currencyId,
								name: desiredCurrencyCodeEntityObject?.currency?.code,
							}}
							defaultValue={account?.data.currencyId}
							control={control}
							rules={{ required: 'Campo requerido' }}
							label='Moneda'
							dataQuery={{ url: '/currency/all' }}
							normalizeData={{ id: 'id', name: 'code' }}
							setSelectedDataToParent={setSelectedDataToParent}
							selectedDataToParent={selectedDataToParent}
						></AsyncComboBox>
					</div>
					<div className='flex py-5 justify-around gap-5'>
						<Toggle
							name='isPrivate'
							defaultValue={account?.data.isPrivate}
							title='Cuenta privada'
							control={control}
						></Toggle>
						<Toggle
							name='isActive'
							title='Cuenta activa'
							defaultValue={account?.data.isActive}
							control={control}
						></Toggle>
						<Toggle
							name='isBlocked'
							defaultValue={account?.data.isBlocked}
							title='Cuenta Bloqueada'
							control={control}
						></Toggle>
					</div>
					<TextArea
						defaultValue={account?.data.address}
						name='address'
						control={control}
						label='Direccion'
					></TextArea>
					<TextArea
						defaultValue={account?.data.description}
						name='description'
						control={control}
						label='Descripcion'
					></TextArea>

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
						onAction={() => deleteAccount(account?.data.id, closeModal)}
						onCancel={setDelAction}
						title={`Eliminar ${account?.data.name}`}
						text='¿Seguro que desea eliminar este usuario del sistema?'
						loading={isFetching}
					/>
				</Modal>
			)}
		</>
	);
};

export default DetailAccountEditComponent;

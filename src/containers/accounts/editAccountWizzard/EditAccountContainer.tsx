import { useState, createContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AsyncMultiSelect from '../../../components/forms/AsyncMultiselect';
import { useAppSelector } from '../../../store/hooks';
import TextArea from '../../../components/forms/TextArea';
import { type SubmitHandler, useForm } from 'react-hook-form';
import {
	type BasicType,
} from '../../../interfaces/InterfacesLocal';
import { deleteUndefinedAttr } from '../../../utils/helpers';
import { TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../../../components/modals/GenericModal';
import AlertContainer from '../../../components/misc/AlertContainer';
import Input from '../../../components/forms/Input';
import Button from '../../../components/misc/Button';
import Toggle from '../../../components/forms/Toggle';
import useServerCategories from '../../../api/userServerCategories';
import userServerAccounts from '../../../api/userServerAccounts';
import Select from "../../../components/forms/Select";

interface UserWizzardInterface {
	editAccount: Function;
	deleteAccount: Function;
	isFetching: boolean;
	closeModal: Function;
	account: any;
}
interface EditInterface {
	account: any;
	editAccount: Function;
	deleteAccount: Function;
	closeModal: Function;
	isFetching: boolean;
}

const EditAccountContainer = ({
	editAccount,
	isFetching,
	closeModal,
	deleteAccount,
	account,
}: UserWizzardInterface) => {

	const [delAction, setDelAction] = useState(false);

	const navigate = useNavigate();

	const id = useAppSelector((state) => state.account.id);

	const { control, handleSubmit } = useForm<BasicType>(
		{
			mode: 'onChange',
		},
	);

	const {
		getCategory,
		category,
	} = useServerCategories();

	const {
		registerAccountCategory,
	} = userServerAccounts();

	useEffect(() => {
		if (account?.issueEntity?.id) {
			getCategory(account?.issueEntity?.id);
		}
	}, [account?.issueEntity?.id]);

	const onSubmit: SubmitHandler<any> = (data) => {
		let registerCategory = {
			"categoryName": data.categoryName,
			"accountAddress": account.address
		}

		registerAccountCategory(registerCategory);

		if (!data.allowedUsersId) data.allowedUsersId = [];
		editAccount(account?.id, deleteUndefinedAttr(data), closeModal)

	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='overflow-auto scrollbar-thin scrollbar-thumb-slate-100 pr-5 pl-2'>

					<div className='flex flex-col gap-5 mt-5'>
						<Input
							name='name'
							defaultValue={account?.name}
							label='Nombre'
							control={control}
							rules={{
								required: 'Campo requerido',
							}}
						/>

						{Array.isArray(category) && category.length > 0 && (
							<Select
								label='Categoría'
								data={category ? category : []}
								name='categoryName'
								control={control}
								rules={{ required: 'Campo requerido' }}
								defaultValue={account?.category?.name}
							/>
						)}

						<AsyncMultiSelect
							name='allowedUsersId'
							normalizeData={{ id: 'id', name: 'fullName' }}
							defaultItem={{
								id: account?.id,
								name: account?.allowedUsers,
							}}
							control={control}
							label='Usuarios permitidos'
							dataQuery={{ url: '/user' }}
						/>

						<div className='flex justify-around gap-5'>
							<Toggle
								name='isPrivate'
								defaultValue={account?.isPrivate}
								title='Cuenta privada'
								control={control}
							></Toggle>

							<Toggle
								name='isBlocked'
								defaultValue={account?.isBlocked}
								title='Cuenta bloqueada'
								control={control}
							></Toggle>
							<Toggle
								name='isActive'
								title='Cuenta activa'
								defaultValue={account?.isActive}
								control={control}
							></Toggle>
						</div>
						<TextArea
							defaultValue={account?.description}
							name='description'
							control={control}
							label='Descripción'
						></TextArea>

						<Input
							name='securityPin'
							label='PIN de Seguridad'
							control={control}
							rules={{
								required: 'Campo requerido',
							}}
						/>

						<div className='flex justify-between mt-5'>
							<Button
								color="slate-500"
								action={() => {
									setDelAction(true);
								}}
								name="Eliminar cuenta"
								outline
								textColor="text-red-500"
								iconAfter={<TrashIcon className='text-red-500  w-4 h-4' />}
								type={'button'}
							/>
							<Button
								name='Insertar'
								color='slate-600'
								type='submit'
								loading={isFetching}
								disabled={isFetching}
							/>
						</div>
					</div>
				</div>
			</form>

			{delAction && (
				<Modal state={delAction} close={setDelAction}>
					<AlertContainer
						onAction={() => deleteAccount(id, navigate('/accounts'))}
						onCancel={setDelAction}
						title={`Eliminar ${account?.name}`}
						text='¿Seguro que desea eliminar este usuario del sistema?'
						loading={isFetching}
					/>
				</Modal>
			)}



		</>
	);
};

export default EditAccountContainer;

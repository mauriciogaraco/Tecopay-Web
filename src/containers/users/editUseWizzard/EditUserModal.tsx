import useServerUser from '../../../api/userServerUsers';
import { type SubmitHandler, useForm } from 'react-hook-form';
import ComboBox from '../../../components/forms/Combobox';
import TextArea from '../../../components/forms/TextArea';
import { SelectInterface } from '../../../interfaces/LocalInterfaces';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { useEffect, useState } from 'react';
import Modal from '../../../components/misc/GenericModal';
import { deleteUndefinedAttr } from '../../../utils/helpers';
import Input from '../../../components/forms/Input';
import Select from '../../../components/forms/Select';
import Toggle from '../../../components/forms/Toggle';
import AsyncComboBox from '../../../components/forms/AsyncCombobox';
import Button from '../../../components/misc/Button';
import MultiSelect from '../../../components/forms/Multiselect';
import AsyncMultiSelect from '../../../components/forms/AsyncMultiselect';
import { Item, Items } from '../../../interfaces/UsersInterfaces';

interface propsDestructured {
	close: Function;
	editUser: Function;
	isLoading: boolean;
	id: number | null;
	getUser: Function;
	user: any;
	allUsers: Items;
}

const EditUserModal = ({
	editUser,
	close,
	id,
	getUser,
	isLoading,
	user,
	allUsers,
}: propsDestructured) => {
	const { control, handleSubmit } = useForm();

	const onSubmit: SubmitHandler<
		Record<string, string | number | boolean | string[]>
	> = (data) => {
		try {
			editUser(id, deleteUndefinedAttr(data), close).then(() => close());
		} catch (error) {

		}
	};

	const userData: any = allUsers.find((item: Item) => item.id === id);

	return (
		<main>
			<div>
				<form
					className='flex flex-col gap-y-3'
					onSubmit={handleSubmit(onSubmit)}
				>
					<AsyncComboBox
						defaultItem={{ id: userData?.id, name: userData?.fullName }}
						defaultValue={userData?.fullName}
						name='fullName'
						control={control}
						rules={{ required: 'Campo requerido' }}
						label='Nombre'
						dataQuery={{ url: '/user' }}
						normalizeData={{ id: 'id', name: 'fullName' }}
						string={true}
					></AsyncComboBox>

					<AsyncComboBox
						defaultItem={{
							id: userData?.id ?? '-',
							name: userData?.issueEntity?.name ?? '-',
						}}
						defaultValue={userData?.issueEntity?.id ?? '-'}
						rules={{ required: 'Campo requerido' }}
						name='issueEntityId'
						normalizeData={{ id: 'id', name: 'name' }}
						control={control}
						label='Entidad'
						dataQuery={{ url: '/entity' }}
					></AsyncComboBox>
					{/*<AsyncMultiSelect
						name='issueEntityId'
						normalizeData={{ id: 'id', name: 'name' }}
						control={control}
						label='Entidad'
						dataQuery={{ url: '/entity' }}
	/>*/}

					<MultiSelect
						data={[
							{ id: 1, name: 'Administrador' },
							{ id: 2, name: 'Cliente' },
							{ id: 3, name: 'Encargado de entidad' },
							{ id: 4, name: 'Supervisor' },
							{ id: 5, name: 'Operador de tarjetas' },
							{ id: 6, name: 'Gestor de cuentas' },
						]}
						defaultValue={[
							{ id: userData?.roles.id, name: userData?.roles.name },
						]}
						control={control}
						label='Roles'
						name='rolesId'
					/>

					<div className='flex self-end'>
						<Button
							name='Actualizar'
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

export default EditUserModal;

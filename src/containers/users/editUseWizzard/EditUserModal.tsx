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
import MultiSelect from '../../../components/forms/Multiselect';
import AsyncMultiSelect from '../../../components/forms/AsyncMultiselect';
import { Item } from '../../../interfaces/UsersInterfaces';

interface propsDestructured {
	close: Function;
	editUser: Function;
	isLoading: boolean;
	id: number | null;
	getUser: Function;
	user: any;
}

const EditUserModal = ({
	editUser,
	close,
	id,
	getUser,
	isLoading,
	user,
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
			editUser(deleteUndefinedAttr(sendData), close).then(() => close());
		} catch (error) {}
	};
	useEffect(() => {
		getUser(id);
	}, []);

	return (
		<main>
			<div>
				<form
					className='flex flex-col gap-y-3'
					onSubmit={handleSubmit(onSubmit)}
				>
					<AsyncComboBox
						defaultItem={{ id: user?.id, name: user?.fullName }}
						defaultValue={{ name: user?.fullName }}
						name='name'
						control={control}
						rules={{ required: 'Campo requerido' }}
						label='Nombre'
						dataQuery={{ url: '/user' }}
						normalizeData={{ id: 'id', name: 'fullName' }}
					></AsyncComboBox>

					<AsyncMultiSelect
						name='entity'
						normalizeData={{ id: 'id', name: 'address' }}
						control={control}
						label='Entidad'
						dataQuery={{ url: '/entity' }}
					/>

					<MultiSelect
						data={[
							{ id: 1, name: 'Admin' },
							{ id: 2, name: 'Cliente' },
							{ id: 3, name: 'Creator' },
						]}
						control={control}
						defaultValue={user.roles.map((stage: any) => stage?.name)}
						byDefault={user.roles.map((stage: any) => stage?.name)}
						label='Roles'
						name='role'
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

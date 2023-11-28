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

interface propsDestructured {
	close: Function;
	addFromTecopos: Function;
	isLoading: boolean;
}

const NewUserModalVariantTwo = ({
	addFromTecopos,
	close,
	isLoading,
}: propsDestructured) => {
	const { control, handleSubmit } = useForm();

	const onSubmit: SubmitHandler<
		Record<string, string | number | boolean | string[]>
	> = (data) => {

		try {
			addFromTecopos(deleteUndefinedAttr(data), close).then(() => close());
		} catch (error) {}
	};

	return (
		<main>
			<div>
				<form
					className='flex flex-col gap-y-3'
					onSubmit={handleSubmit(onSubmit)}
				>
					<AsyncComboBox
						name='userId'
						control={control}
						rules={{ required: 'Campo requerido' }}
						label='Nombre'
						dataQuery={{ url: '/user/external' }}
						normalizeData={{ id: 'id', name: 'displayName' }}
					></AsyncComboBox>

					<AsyncComboBox
						name='issueEntityId'
						control={control}
						rules={{ required: 'Campo requerido' }}
						label='Entidad'
						dataQuery={{ url: '/entity' }}
						normalizeData={{ id: 'id', name: 'name' }}
					></AsyncComboBox>

					<MultiSelect
						data={[
							{ id: 1, name: 'Administrador' },
							{ id: 2, name: 'Cliente' },
							{ id: 3, name: 'Encargado de entidad' },
							{ id: 4, name: 'Supervisor' },
							{ id: 5, name: 'Operador de tarjetas' },
							{ id: 6, name: 'Gestor de cuentas' },
						]}
						control={control}
						label='Roles'
						name='rolesId'
					/>

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

export default NewUserModalVariantTwo;

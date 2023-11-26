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
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';

interface propsDestructured {
	close: Function;
	registerUser: Function;
	isLoading: boolean;
}

const NewUserModalVariantOne = ({
	registerUser,
	close,
	isLoading,
}: propsDestructured) => {
	const { control, handleSubmit } = useForm();

	const onSubmit: SubmitHandler<
		Record<string, string | number | boolean | string[]>
	> = (data) => {
		console.log(data);
		try {
			registerUser(deleteUndefinedAttr(data), close).then(() => close());
		} catch (error) {}
	};

	const [showPsw, setShowPsw] = useState(false);

	return (
		<main>
			<div>
				<form
					className='flex flex-col gap-y-3'
					onSubmit={handleSubmit(onSubmit)}
				>
					<Input
						name='fullName'
						label='Nombre'
						placeholder='Nombre del usuario'
						control={control}
						rules={{ required: 'Campo requerido' }}
					></Input>

					<Input
						name='email'
						label='Correo Eletrónico'
						placeholder='@email.com'
						control={control}
						rules={{ required: 'Campo requerido' }}
					></Input>

					<div className='relative'>
						{showPsw ? (
							<EyeIcon
								className='h-5 text-gray-500 absolute top-[34px] right-2 z-10 hover:text-gray-600 hover:cursor-pointer'
								onClick={() => setShowPsw(!showPsw)}
							/>
						) : (
							<EyeSlashIcon
								className='h-5 text-gray-500 absolute top-[34px] right-2 z-10 hover:text-gray-600 hover:cursor-pointer'
								onClick={() => setShowPsw(!showPsw)}
							/>
						)}

						<Input
							name='password'
							label='Contraseña'
							control={control}
							type={showPsw ? 'text' : 'password'}
							placeholder={showPsw ? '' : '******'}
						/>
					</div>

					<AsyncMultiSelect
						name='entity'
						normalizeData={{ id: 'id', name: 'name' }}
						control={control}
						label='Entidad'
						dataQuery={{ url: '/entity' }}
					/>

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

export default NewUserModalVariantOne;

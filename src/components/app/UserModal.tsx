import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import Input from '../forms/Input';
import Button from '../misc/Button';
import { useAppSelector } from '../../store/hooks';
import { validateEmail } from '../../utils/helpers';
import useServer from '../../api/useServer';

interface UserModal {
	closeModal: Function;
}

const UserModal = ({ closeModal }: UserModal) => {
	const { isFetching } = useServer();
	const { user } = useAppSelector((state) => state.init);
	const { control, handleSubmit } = useForm<Record<string, string | number>>();
	const onSubmit: SubmitHandler<Record<string, string | number>> = (data) => {
		/*editUser(data, closeModal);*/
	};

	return (
		<div>
			<h2 className='text-slate-600 font-semibold text-xl underline text-center'>
				Configurar mi usuario
			</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='flex-col mt-3'>
					<Input
						name='username'
						label='Usuario en el sistema'
						control={control}
						defaultValue={user?.username}
						rules={{ required: 'Campo requerido' }}
					/>
					<Input
						name='displayName'
						label='Nombre público'
						control={control}
						defaultValue={user?.displayName}
						rules={{ required: 'Campo requerido' }}
					/>
					<Input
						name='email'
						label='Correo electrónico'
						control={control}
						defaultValue={user?.email}
						rules={{
							validate: {
								match: (value) =>
									validateEmail(value) ||
									'Inserte una dirección de correo válida',
							},
						}}
					/>
				</div>
				{/*<FileInput
          name="avatarId"
          control={control}
          label="Foto de perfil"
          defaultImg={user?.avatarId ? { id: user?.avatarId, src: user?.avatar?.src } : undefined}
  />*/}

				<div className='mt-3'>
					<Button
						color='slate-600'
						type='submit'
						name='Actualizar'
						loading={isFetching}
						disabled={isFetching}
						full
					/>
				</div>
			</form>
		</div>
	);
};

export default UserModal;

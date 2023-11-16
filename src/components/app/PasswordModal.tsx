import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Input from '../forms/Input';
import Button from '../misc/Button';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deleteUndefinedAttr } from '../../utils/helpers';
import useServer from '../../api/useServer';

interface PasswordModal {
	closeModal: Function;
}

const PasswordModal = ({ closeModal }: PasswordModal) => {
	const { isFetching } = useServer();
	const { control, handleSubmit, watch } = useForm({
		mode: 'onChange',
	});
	const onSubmit: SubmitHandler<Record<string, string | number>> = (data) => {
		delete data.probePassword;
		//editUser(deleteUndefinedAttr(data), closeModal);
	};

	const passw = watch('password');
	const [showPsw, setShowPsw] = useState(false);
	const [showPin, setShowPin] = useState(false);
	const pinUnicode = '\u{25CF}\u{25CF}\u{25CF}\u{25CF}\u{25CF}\u{25CF}';

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h2 className='text-slate-600 font-semibold text-lg underline text-center'>
				Cambiar Contraseña
			</h2>
			<div className='grid grid-cols-2 gap-3 my-3'>
				<div className='relative'>
					<EyeIcon
						className='h-5 text-gray-500 absolute top-10 right-2 z-10 hover:text-gray-600 hover:cursor-pointer'
						onClick={() => setShowPsw(!showPsw)}
					/>

					<Input
						name='password'
						label='Nueva Contraseña'
						control={control}
						type={showPsw ? 'text' : 'password'}
						placeholder={showPsw ? 'Nueva contraseña' : '******'}
					/>
				</div>

				<div className='relative'>
					<EyeIcon
						className='h-5 text-gray-500 absolute top-10 right-2 z-10 hover:text-gray-600 hover:cursor-pointer'
						onClick={() => setShowPsw(!showPsw)}
					/>
					<Input
						name='probePassword'
						label='Confirmar contraseña'
						control={control}
						type={showPsw ? 'text' : 'password'}
						placeholder={showPsw ? 'Repetir contraseña' : '******'}
						rules={{
							validate: {
								match: (value) =>
									(value ?? '') === (passw ?? '') ||
									'Las contraseñas deben coincidir',
							},
						}}
					/>
				</div>
				<div className='col-span-2 relative'>
					<EyeIcon
						className='h-5 text-gray-500 absolute top-10 right-2 z-10 hover:text-gray-600 hover:cursor-pointer'
						onClick={() => setShowPin(!showPin)}
					/>
					<Input
						name='pinPassword'
						label='Nuevo PIN'
						control={control}
						placeholder={showPin ? 'PIN' : pinUnicode}
						type={showPin ? 'text' : 'password'}
						rules={{
							maxLength: {
								value: 6,
								message: 'No puede exceder los 6 caracteres',
							},
						}}
						textAsNumber
					/>
				</div>
			</div>
			<Button
				color='slate-600'
				type='submit'
				name='Insertar'
				loading={isFetching}
				disabled={isFetching}
				full
			/>
		</form>
	);
};

export default PasswordModal;

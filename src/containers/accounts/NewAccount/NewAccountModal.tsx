import { type SubmitHandler, useForm } from 'react-hook-form';
import { deleteUndefinedAttr } from '../../../utils/helpers';
import Input from '../../../components/forms/Input';
import Toggle from '../../../components/forms/Toggle';
import AsyncComboBox from '../../../components/forms/AsyncCombobox';
import Button from '../../../components/misc/Button';

interface propsDestructured {
	close: Function;
	addAccount: Function;
	isLoading: boolean;
}

const NewAccountModal = ({
	addAccount,
	close,
	isLoading,
}: propsDestructured) => {
	const { control, handleSubmit } = useForm();

	const onSubmit: SubmitHandler<
		Record<string, string | number | boolean | string[]>
	> = (data) => {
		addAccount(deleteUndefinedAttr(data), close).then(() => close());
	};

	return (
		<main>
			<div>
				<p className='mb-4 font-semibold text-lg text-center'>Nueva cuenta</p>
				<form
					className='flex flex-col gap-5'
					onSubmit={handleSubmit(onSubmit)}
				>
					<Input
						name='name'
						label='Nombre'
						placeholder='Nombre de la cuenta'
						control={control}
						rules={{ required: 'Campo requerido' }}
					></Input>

					<AsyncComboBox
						name='issueEntityId'
						control={control}
						rules={{ required: 'Campo requerido' }}
						label='Entidad'
						dataQuery={{ url: '/entity' }}
						normalizeData={{ id: 'id', name: 'name' }}
					></AsyncComboBox>

					<Toggle
						name="printCard"
						control={control}
						title="Imprimir Tarjeta"
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

export default NewAccountModal;

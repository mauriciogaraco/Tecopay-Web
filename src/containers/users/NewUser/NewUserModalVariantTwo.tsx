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
	addUser: Function;
	isLoading: boolean;
}

const NewUserModalVariantTwo = ({
	addUser,
	close,
	isLoading,
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
			addUser(deleteUndefinedAttr(sendData), close).then(() => close());
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
						name='currencyId'
						control={control}
						rules={{ required: 'Campo requerido' }}
						label='Moneda'
						dataQuery={{ url: '/currency' }}
						normalizeData={{ id: 'id', name: 'symbol' }}
					></AsyncComboBox>

					<AsyncMultiSelect
						name='entity'
						normalizeData={{ id: 'id', name: 'name' }}
						control={control}
						label='entidad'
						dataQuery={{ url: '/user' }}
					/>

					<MultiSelect
						data={[
							{ id: 1, name: 'Admin' },
							{ id: 2, name: 'Cliente' },
							{ id: 3, name: 'Creator' },
						]}
						control={control}
						label='Roles'
						name='role'
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

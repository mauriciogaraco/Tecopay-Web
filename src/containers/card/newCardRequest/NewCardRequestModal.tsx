import useServerUser from '../../../api/userServerAccounts';
import { type SubmitHandler, useForm } from 'react-hook-form';

import TextArea from '../../../components/forms/TextArea';

import { deleteUndefinedAttr } from '../../../utils/helpers';
import Input from '../../../components/forms/Input';
import Toggle from '../../../components/forms/Toggle';

import Button from '../../../components/misc/Button';
import Select from '../../../components/forms/Select';
import { useState } from 'react';
import useServerCardsRequests from '../../../api/userServerCardsRequests';

interface propsDestructured {
	setContactModal: (contactModal: boolean) => void;
	contactModal: boolean;
	setNuevoTicketModal: (contactModal: boolean) => void;
	nuevoTicketModal: boolean;
	close: Function;
}

const NewCardRequestModal = ({ setContactModal, close }: propsDestructured) => {
	const { control, handleSubmit } = useForm();

	const onSubmit: SubmitHandler<
		Record<string, string | number | boolean | string[]>
	> = (data) => {
		const sendData = Object.assign(data, {
			isBlocked: false,
			code: '123456',
			ownerId: 251,
		});
		console.log(sendData);
		try {
			addCardRequest(deleteUndefinedAttr(sendData), close).then(() => close());
		} catch (error) {}
	};

	const { isFetching, addCardRequest } = useServerCardsRequests();
	const [createManyState, setCreateManyState] = useState(false);

	return (
		<main>
			<div>
				<h3 className='p-4 text-xl md:text-2xl'>Nueva solicitud</h3>
				<form
					className='flex flex-col gap-y-3'
					onSubmit={handleSubmit(onSubmit)}
				>
					<Toggle
						name='CreateMany'
						title='Crear por bulto'
						control={control}
						changeState={setCreateManyState}
					></Toggle>
					{createManyState == false ? (
						<Input
							name='name'
							label='Propietario'
							placeholder='Nombre del Propietario'
							control={control}
							rules={{ required: 'Campo requerido' }}
						></Input>
					) : (
						<Input
							name='quantity'
							label='Cantidad'
							placeholder='Cantidad'
							control={control}
							rules={{ required: 'Campo requerido' }}
						></Input>
					)}

					<Select
						control={control}
						name='prioridad'
						label='Prioridad'
						data={[
							{ id: 1, name: 'Normal' },
							{ id: 2, name: 'Express' },
						]}
					></Select>

					<div className='h-full'>
						<TextArea
							name='observation'
							control={control}
							paddingInput='py-0'
							label='Observaciones'
						></TextArea>
					</div>

					<div className='flex self-end'>
						<Button
							name='Insertar'
							color='slate-600'
							type='submit'
							loading={isFetching}
							disabled={isFetching}
						/>
					</div>
				</form>
			</div>
		</main>
	);
};

export default NewCardRequestModal;

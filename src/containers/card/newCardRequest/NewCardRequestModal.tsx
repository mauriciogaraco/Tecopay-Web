import { type SubmitHandler, useForm } from 'react-hook-form';
import TextArea from '../../../components/forms/TextArea';
import { deleteUndefinedAttr } from '../../../utils/helpers';
import Input from '../../../components/forms/Input';
import Toggle from '../../../components/forms/Toggle';
import Button from '../../../components/misc/Button';
import Select from '../../../components/forms/Select';
import { useState } from 'react';
import AsyncComboBox from '../../../components/forms/AsyncCombobox';

interface propsDestructured {
	contactModal: boolean;
	close: Function;
	addSimpleCardRequest: Function;
	addBulkCardRequest: Function;
	isFetching: boolean;
}

const NewCardRequestModal = ({
	addSimpleCardRequest,
	close,
	addBulkCardRequest,
	isFetching,
}: propsDestructured) => {
	const { control, handleSubmit } = useForm();
	const [createManyState, setCreateManyState] = useState(false);
	let dataTosend: any;

	const onSubmit: SubmitHandler<
		Record<string, string | number | boolean | string[]>
	> = (data) => {

		if (!createManyState) {
			if (data.priority === 'Normal')
				dataTosend = {
					...data,
					priority: 'NORMAL',
				};
			else
				dataTosend = {
					...data,
					priority: 'EXPRESS',
				};
			addSimpleCardRequest(deleteUndefinedAttr(dataTosend), close).then(() =>
				close(),
			);
		} else {
			addBulkCardRequest(deleteUndefinedAttr(dataTosend), close).then(() =>
				close(),
			);
		}
	};

	return (
		<main>
			<div>
				<p className='mb-4 font-semibold text-lg text-center'>
					Nueva solicitud
				</p>
				<Toggle
					name=''
					title='Crear por bulto'
					control={control}
					changeState={setCreateManyState}
				></Toggle>

				<form
					className='flex flex-col gap-y-3'
					onSubmit={handleSubmit(onSubmit)}
				>
					{createManyState == false ? (
						<Input
							name='holderName'
							label='Nombre'
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
						name='priority'
						label='Prioridad'
						data={[
							{ id: 1, name: 'Normal' },
							{ id: 2, name: 'Exprés' },
						]}
					></Select>
					{createManyState == false && (
						<AsyncComboBox
							name='ownerId'
							normalizeData={{ id: 'id', name: 'fullName' }}
							control={control}
							label='Dueño'
							dataQuery={{ url: '/user' }}
						/>
					)}

					<AsyncComboBox
						rules={{ required: 'Campo requerido' }}
						name='issueEntityId'
						normalizeData={{ id: 'id', name: 'name' }}
						control={control}
						label='Entidad'
						dataQuery={{ url: '/entity' }}
					></AsyncComboBox>

					<div className='h-full'>
						<TextArea
							name='observations'
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

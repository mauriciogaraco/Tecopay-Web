import { useState } from 'react';
import Input from '../../../components/forms/Input';
import Button from '../../../components/misc/Button';
import { deleteUndefinedAttr, validateEmail } from '../../../utils/helpers';
import Toggle from '../../../components/forms/Toggle';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
	AccountData,
	UserInterface,
} from '../../../interfaces/ServerInterfaces';
import { TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../../../components/modals/GenericModal';
import AlertContainer from '../../../components/misc/AlertContainer';
import {
	BasicType,
	SelectInterface,
} from '../../../interfaces/InterfacesLocal';
import TextArea from '../../../components/forms/TextArea';
import Select from '../../../components/forms/Select';
import ComboBox from '../../../components/forms/Combobox';
import AsyncComboBox from '../../../components/forms/AsyncCombobox';
import useServerEntity from '../../../api/userServerEntity';
import { useAppSelector } from '../../../store/hooks';

interface EditInterface {
	entity: any;
	editEntity: Function;
	deleteEntity: Function;
	closeModal: Function;
	isFetching: boolean;
	id: number | null;
	setAllEntity: Function;
	allEntity: any;
}

const statusData = [
	{ id: 1, name: 'Inactiva' },
	{ id: 2, name: 'Activa' },
];
const DetailEntityEditComponent = ({
	editEntity,
	deleteEntity,
	entity,
	closeModal,
	isFetching,
	id,
	setAllEntity,
	allEntity,
}: EditInterface) => {
	const { control, handleSubmit, watch, reset, formState } = useForm<BasicType>(
		{
			mode: 'onChange',
		},
	);
	const [delAction, setDelAction] = useState(false);

	//const items = useAppSelector((state) => state.Entity.Entity);

	const desiredCurrencyCodeEntityObject: any = allEntity.find(
		(item: any) => item.id === id,
	);

	const onSubmit: SubmitHandler<BasicType> = (data) => {
		const WholeData = Object.assign(data, {
			userId: 1,
		});
		editEntity(entity?.id, deleteUndefinedAttr(WholeData), reset()).then(() =>
			closeModal(),
		);
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='h-96 overflow-auto scrollbar-thin scrollbar-thumb-slate-100 pr-5 pl-2'>
					<div className='flex justify-end'>
						<div className='bg-red-200 hover:bg-red-300 transition-all duration-200 ease-in-out  rounded-lg'>
							<Button
								icon={<TrashIcon className='h-5 text-red-500' />}
								color='gray-50'
								type='button'
								action={() => {
									setDelAction(true);
								}}
								outline
							/>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-5'>
						<Input
							name='name'
							defaultValue={entity?.name}
							label='Nombre'
							control={control}
							rules={{
								required: 'Campo requerido',
							}}
						/>
						<Input
							name='phone'
							defaultValue={entity?.phone}
							label='Telefono'
							control={control}
							rules={{
								required: 'Campo requerido',
							}}
						/>

						{/*<AsyncComboBox
							name='currencyId'
							defaultItem={{
								id: entity?.currencyId,
								name: desiredCurrencyCodeEntityObject?.currency?.code,
							}}
							defaultValue={entity?.id}
							control={control}
							rules={{ required: 'Campo requerido' }}
							label='Moneda'
							dataQuery={{ url: '/currency' }}
							normalizeData={{ id: 'id', name: 'code' }}
						></AsyncComboBox>*/}
					</div>
					<Select
						name='status'
						default={desiredCurrencyCodeEntityObject?.status}
						defaultValue={desiredCurrencyCodeEntityObject?.status}
						label='Estado de la entidad'
						control={control}
						data={statusData}
					></Select>

					<TextArea
						defaultValue={entity?.address}
						name='address'
						control={control}
						label='Dirección'
					></TextArea>

					<div className='flex justify-end mt-5'>
						<Button
							name='Insertar'
							color='slate-600'
							type='submit'
							loading={isFetching}
							disabled={isFetching}
						/>
					</div>
				</div>
			</form>

			{delAction && (
				<Modal state={delAction} close={setDelAction}>
					<AlertContainer
						onAction={() => deleteEntity(entity?.id, closeModal)}
						onCancel={setDelAction}
						title={`Eliminar ${entity?.name}`}
						text='¿Seguro que desea eliminar este usuario del sistema?'
						loading={isFetching}
					/>
				</Modal>
			)}
		</>
	);
};

export default DetailEntityEditComponent;

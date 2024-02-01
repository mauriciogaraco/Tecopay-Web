import { useContext, useState, useEffect } from "react";
import { ProductContext } from "./EditEntityModal";
import Input from '../../../components/forms/Input';
import Button from '../../../components/misc/Button';
import Toggle from "../../../components/forms/Toggle";
import Select from "../../../components/forms/Select";
import GenericImageDrop from "../../../components/misc/Images/GenericImageDrop";
import AlertContainer from '../../../components/misc/AlertContainer';
import Modal from '../../../components/modals/GenericModal';
import { TrashIcon } from '@heroicons/react/24/outline';
import AsyncComboBox from '../../../components/forms/AsyncCombobox';
import { useAppDispatch } from '../../../store/hooks';
import { fetchEntities } from '../../../store/slices/EntitySlice';

const EditEntityGeneralInfo = () => {
	const { entity, control, close, business, id, isFetching, deleteEntity } = useContext(ProductContext);
	const [delAction, setDelAction] = useState(false);

	const dispatch = useAppDispatch();

	function deleteEntityModal() {
		setDelAction(true);
	}

	function deleteEntityAction() {
		if (id) {
			deleteEntity && deleteEntity(id, close).then(
				() => dispatch(fetchEntities()));
		}
	}

	return (
		<div className="h-auto border border-slate-300 rounded p-2 overflow-y-visible">
			<div className="max-h-96 h-96 overflow-y-auto z-20">
				<div>
					<p className='mb-4 font-semibold text-lg text-center'>{entity?.name}</p>
					<div className="mt-2">
						<GenericImageDrop
							className="h-40 w-40 rounded-full border border-gray-400 m-auto overflow-hidden"
							control={control}
							name='profileImageId'
							text='Logo de la Entidad'
							defaultValue={entity?.profileImage?.id ? entity?.profileImage?.id : undefined}
							previewDefault={entity?.profileImage?.url ? `https://apidevpay.tecopos.com${entity?.profileImage?.url}` : undefined}
							previewHash={entity?.profileImage?.hash ? entity?.profileImage?.hash : undefined}
						/>
					</div>

					<div className="grid grid-cols-2 gap-5 grid-flow-row auto-rows-max mx-2 mt-4">
						<div className="mt-2">
							<Select
								label='Negocio'
								data={business ? business : []}
								name='businessId'
								control={control}
								rules={{ required: 'Campo requerido' }}
								defaultValue={entity?.business?.name}
								disabled={true}
							/>
						</div><div className="mt-2">
							<Input
								name='name'
								label='Nombre de la entidad'
								placeholder={entity?.name}
								control={control}
								defaultValue={entity?.name}
								rules={{
									required: 'Campo requerido',
									maxLength: {
										value: 50,
										message: 'El nombre de entidad debe tener como máximo 50 carácteres'
									}
								}}
							></Input>
						</div><div className="mt-2">
							<AsyncComboBox
								rules={{ required: 'Campo requerido' }}
								name='ownerId'
								normalizeData={{ id: 'id', name: 'email' }}
								control={control}
								label='Responsable'
								dataQuery={{ url: '/user' }}
								defaultItem={{ id: 1, name: entity?.owner?.email }}
							></AsyncComboBox>
						</div><div className="mt-2">
							<Input
								name='phone'
								label='Teléfono'
								placeholder={entity?.phone}
								control={control}
								rules={{
									required: 'Campo requerido',
									maxLength: {
										value: 15,
										message: 'Inserte número de teléfono válido'
									},
									validate: (value) => {
										const isValidPhoneNumber = /^\+?[0-9]{8,}$/.test(value);
										return isValidPhoneNumber || 'Inserte número de teléfono válido';
									},
								}}
								defaultValue={entity?.phone}
							></Input>
						</div><div className="mt-2">
							<Input
								name='address'
								label='Dirección'
								placeholder={entity?.address}
								control={control}
								rules={{
									required: 'Campo requerido',
									maxLength: {
										value: 150,
										message: 'La dirección debe tener como máximo 150 carácteres'
									},
								}}
								defaultValue={entity?.address}
							></Input>
						</div><div className="mt-7 flex items-center justify-center m-auto">

							<Toggle
								name="allowCreateAccount"
								control={control}
								defaultValue={entity?.allowCreateAccount}
								title="Permitir solicitar tarjetas desde la APK"
							/>
						</div>
					</div>

				</div>
			</div>
			<div className="grid grid-cols-2 gap-3 py-2 mt-9 mx-2">
				<div>
					<Button
						color="slate-500"
						action={deleteEntityModal}
						name="Eliminar entidad"
						key={1}
						full
						outline
						textColor="text-red-500"
						iconAfter={<TrashIcon className='text-red-500  w-4 h-4' />}
						type={'button'}
					/>
				</div>
				<div>
					<Button
						color="indigo-700"
						name="Actualizar entidad"
						key={2}
						full
						outline
						type="submit"

					/>
				</div>

			</div>
			{delAction && (
				<Modal state={delAction} close={setDelAction}>
					<AlertContainer
						onAction={() => deleteEntityAction()}
						onCancel={setDelAction}
						title={`Eliminar ${entity?.name}`}
						text='¿Seguro que desea eliminar esta entidad del sistema?'
						loading={isFetching}
					/>
				</Modal>
			)}
		</div>
	);
};


export default EditEntityGeneralInfo;
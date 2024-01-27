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


const EditEntityGeneralInfo = () => {
	const { control, close, business, allEntity, id, getCategory, isFetching, deleteEntity } = useContext(ProductContext);
	const [delAction, setDelAction] = useState(false);

	let filteredArray = allEntity.filter((obj: any) => obj.id === id) ?? [];

	useEffect(() => {
		getCategory && getCategory(id)
	}, [id]);

	function deleteEntityModal() {
		setDelAction(true);
	}
	console.log(id)
	function deleteEntityAction() {
		if (id) {
			deleteEntity && deleteEntity(id, close);
		}
	}

	return (
		<div className="h-auto border border-slate-300 rounded p-2 overflow-y-visible">
			<div className="max-h-96 h-96 overflow-y-auto z-20">
				<div>
					<p className='mb-4 font-semibold text-lg text-center'>{filteredArray[0]?.name}</p>
					<div className="mt-2">
						<GenericImageDrop
							className="h-40 w-40 rounded-full border border-gray-400 m-auto overflow-hidden"
							control={control}
							name='imageId'
							text='Logo de la Entidad'
							defaultValue={filteredArray[0]?.profileImage?.id ? filteredArray[0]?.profileImage?.id : undefined}
							previewDefault={filteredArray[0]?.profileImage?.url ? `https://apidevpay.tecopos.com${filteredArray[0]?.profileImage?.url}` : undefined}
							previewHash={filteredArray[0]?.profileImage?.hash ? filteredArray[0]?.profileImage?.hash : undefined}
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
							/>
						</div><div className="mt-2">
							<Input
								name='name'
								label='Nombre de la entidad'
								placeholder={filteredArray[0]?.name}
								control={control}
								rules={{ required: 'Campo requerido' }}
								defaultValue={filteredArray[0]?.name}
							></Input>
						</div><div className="mt-2">
							<AsyncComboBox
								//rules={{ required: 'Campo requerido' }}
								name='ownerId'
								normalizeData={{ id: 'id', name: 'name' }}
								control={control}
								label='Responsable'
								dataQuery={{ url: '/user/findAll' }}
							></AsyncComboBox>
						</div><div className="mt-2">
							<Input
								name='phone'
								label='Telefono'
								placeholder={filteredArray[0]?.phone}
								control={control}
								rules={{
									validate: (value) => {
										const isValidPhoneNumber = /^\+?[0-9]{8,}$/.test(value);
										return isValidPhoneNumber || 'Inserte número de teléfono válido';
									},
								}}
								defaultValue={filteredArray[0]?.phone}
							></Input>
						</div><div className="mt-2">
							<Input
								name='address'
								label='Direccion'
								placeholder={filteredArray[0]?.address}
								control={control}
								rules={{ required: 'Campo requerido' }}
								defaultValue={filteredArray[0]?.address}
							></Input>
						</div><div className="mt-7 flex items-center justify-center m-auto">

							<Toggle
								name="allowCreateAccount"
								control={control}
								defaultValue={filteredArray[0]?.allowCreateAccount}
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
						color="slate-500"
						name="Siguiente"
						key={2}
						full
						outline
						textColor="slate-600"
						type="submit"
					/>
				</div>

			</div>
			{delAction && (
				<Modal state={delAction} close={setDelAction}>
					<AlertContainer
						onAction={() => deleteEntityAction()}
						onCancel={setDelAction}
						title={`Eliminar ${filteredArray[0]?.name}`}
						text='¿Seguro que desea eliminar esta entidad del sistema?'
						loading={isFetching}
					/>
				</Modal>
			)}
		</div>
	);
};


export default EditEntityGeneralInfo;
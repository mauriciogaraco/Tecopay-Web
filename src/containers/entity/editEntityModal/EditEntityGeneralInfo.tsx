import { useContext, useState, useEffect } from "react";
import { ProductContext } from "./EditEntityModal";
import Input from '../../../components/forms/Input';
import Button from '../../../components/misc/Button';
import Toggle from "../../../components/forms/Toggle";
import Select from "../../../components/forms/Select";
import GenericImageDrop from "../../../components/misc/Images/GenericImageDrop";
import Fetching from "../../../components/misc/Fetching";
import AlertContainer from '../../../components/misc/AlertContainer';
import Modal from '../../../components/modals/GenericModal';
import useServerEntity, {Entidad} from '../../../api/userServerEntity';
import useServerCategories from "../../../api/userServerCategories";
import SpinnerLoading from '../../../components/misc/SpinnerLoading';


const EditEntityGeneralInfo = () => {
	const { control, stepUp, entity, close } = useContext(ProductContext);
	const [delAction, setDelAction] = useState(false);

	const {
		isLoading: loading,
		business,
		isFetching,
		deleteEntity,
	} = useServerEntity();


	const {
		getCategory,
		category,
	} = useServerCategories();


	function deleteEntityModal ():any {
		setDelAction(true);
	}

	function deleteEntityAction ():any {
		deleteEntity(entity?.entity?.id, close);
	}

	return (
		<div className="h-auto border border-slate-300 rounded p-2 overflow-y-visible">
			<div className="max-h-96 h-96 overflow-y-auto z-20">
				<div>
					<p className='mb-4 font-semibold text-lg text-center'>{entity?.entity?.name}</p>
					<div className="mt-2">
						<GenericImageDrop
							className="h-40 w-40 rounded-full border border-gray-400 m-auto overflow-hidden"
							control={control}
							name='imageId'
							text='Logo de la Entidad'
							defaultValue={entity?.profileImage?.id}
							previewDefault={`https://apidevpay.tecopos.com${entity?.profileImage?.url}`}
							previewHash={entity?.profileImage?.hash}
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
								placeholder={entity?.entity?.name}
								control={control}
								rules={{ required: 'Campo requerido' }}
								defaultValue={entity?.entity?.name}
							></Input>
						</div><div className="mt-2">
							<Input
								name='address'
								label='Direccion'
								placeholder={entity?.entity?.address}
								control={control}
								rules={{ required: 'Campo requerido' }}
								defaultValue={entity?.entity?.address}
							></Input>
						</div><div className="mt-2">
							<Input
								name='responsable'
								label='Responsable'
								placeholder='Responsable'
								control={control}
								rules={{ required: 'Campo requerido' }}
								defaultValue={'responsable'}
							></Input>
						</div><div className="mt-2">
							<Input
								name='phone'
								label='Telefono'
								placeholder={entity?.entity?.phone}
								control={control}
								rules={{ required: 'Campo requerido' }}
								defaultValue={entity?.entity?.phone}
							></Input>
						</div><div className="mt-7 flex items-center justify-center m-auto">

							<Toggle
								name="allowCreateAccount"
								control={control}
								defaultValue={entity?.entity?.allowCreateAccount}
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
						full
						outline
						textColor="text-rose-500"
					/>
				</div>
				<Button
					color="slate-500"
					action={stepUp}
					name="Siguiente"
					full
					outline
					textColor="slate-600"
				/>
			</div>
			{delAction && (
				<Modal state={delAction} close={setDelAction}>
					<AlertContainer
						onAction={() => deleteEntityAction()}
						onCancel={setDelAction}
						title={`Eliminar ${entity?.entity?.name}`}
						text='¿Seguro que desea eliminar esta entidad del sistema?'
						loading={isFetching}
					/>
				</Modal>
			)}
		</div>
	);
};


export default EditEntityGeneralInfo;
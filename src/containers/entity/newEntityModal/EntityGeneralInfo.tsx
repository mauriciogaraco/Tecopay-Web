import { useContext } from "react";
import { ProductContext } from "./NewEntityModal";
import Input from '../../../components/forms/Input';
import Button from '../../../components/misc/Button';
import Toggle from "../../../components/forms/Toggle";
import Select from "../../../components/forms/Select";
import GenericImageDrop from "../../../components/misc/Images/GenericImageDrop";
import AsyncComboBox from '../../../components/forms/AsyncCombobox';


const EntityGeneralInfo = () => {
	const { control, business, setProfileImageId } = useContext(ProductContext);

	return (
		<div className="h-auto border border-slate-300 rounded p-2">
			<div>
				<div className="max-h-96 h-96 overflow-y-auto">
					<div>
						<p className='mb-4 font-semibold text-lg text-center'>Crear entidad emisora</p>
						<div className="mt-2">
							<GenericImageDrop
								className="h-40 w-40 rounded-full border border-gray-400 m-auto overflow-hidden"
								control={control}
								name='profileImageId'
								text='Logo de la Entidad'
								dataUp={setProfileImageId}
								dataIndex={'profileImageId'}
							/>
						</div>
						<div className="grid grid-cols-2 gap-5 grid-flow-row auto-rows-max mx-2 mt-4">
							<div className="mt-2 z-50">
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
									placeholder='Nombre de la Entidad'
									control={control}
									rules={{ required: 'Campo requerido' }}
								/>
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
									label='Teléfono '
									placeholder='Teléfono'
									control={control}
									rules={{
										validate: (value) => {
											const isValidPhoneNumber = /^\+?[0-9]{8,}$/.test(value);
											return isValidPhoneNumber || 'Inserte número de teléfono válido';
										},
									}}
								/>
							</div><div className="mt-2">
								<Input
									name='address'
									label='Dirección'
									placeholder='Dirección de la Entidad'
									control={control}
									rules={{ required: 'Campo requerido' }}
								/>
							</div><div className="mt-7 flex items-center justify-center m-auto">

								<Toggle
									name="allowCreateAccount"
									control={control}
									defaultValue={false}
									title="Permitir solicitar tarjetas desde la APK"
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-3 py-2 mt-9 mx-2">
					<div>
						{/*Empty space for button*/}
					</div>
					<Button
						color="indigo-700"
						name="Siguiente"
						full
						outline
						type="submit"
					/>
				</div>

			</div>
		</div>
	);
};

export default EntityGeneralInfo;
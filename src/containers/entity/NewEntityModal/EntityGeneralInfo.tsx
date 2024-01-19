import { useContext } from "react";
import { ProductContext } from "./NewEntityModal";
import Input from '../../../components/forms/Input';
import Button from '../../../components/misc/Button';
import Toggle from "../../../components/forms/Toggle";
import Select from "../../../components/forms/Select";
import GenericImageDrop from "../../../components/misc/Images/GenericImageDrop";


const EntityGeneralInfo = () => {
	const { control, stepUp, business } = useContext(ProductContext);


	return (
		<div className="h-auto border border-slate-300 rounded p-2 overflow-y-visible">
			<div>
				<div className="max-h-96 h-96 overflow-y-auto z-20">
					<p className='mb-4 font-semibold text-lg text-center'>Nueva entidad</p>
					<div className="mt-2">
						<GenericImageDrop
							className="h-20 w-20 rounded-full border border-gray-400 m-auto overflow-hidden"
							control={control}
							name='imageId'
							text='Logo de la Entidad'
						/>
					</div><div className="mt-2">
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
						></Input>
					</div><div className="mt-2">
						<Input
							name='address'
							label='Direccion'
							placeholder='Direccion de la Entidad'
							control={control}
							rules={{ required: 'Campo requerido' }}
						></Input>
					</div><div className="mt-2">
						<Input
							name='responsable'
							label='Responsable'
							placeholder='Responsable'
							control={control}
							rules={{ required: 'Campo requerido' }}
						></Input>
					</div><div className="mt-2">
						<Input
							name='phone'
							label='Telefono'
							placeholder='Telefono'
							control={control}
							rules={{ required: 'Campo requerido' }}
						></Input>
					</div><div className="mt-2">

						<Toggle
							name="allowCreateAccount"
							control={control}
							defaultValue={false}
							title="Permitir solicitar tarjetas desde la APK"
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3 py-2">
					<div>
						{/*Empty space for button*/}
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
			</div>
		</div>
	);
};

export default EntityGeneralInfo;
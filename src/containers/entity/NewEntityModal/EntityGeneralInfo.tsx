import { useContext} from "react";
import { ProductContext } from "./NewEntityModal";
import { useAppSelector } from "../../../store/hooks";
import Input from '../../../components/forms/Input';
import AsyncComboBox from '../../../components/forms/AsyncCombobox';
import Button from '../../../components/misc/Button';
import Fetching from "../../../components/misc/Fetching";
import Toggle from "../../../components/forms/Toggle";


const EntityGeneralInfo = () => {
	const { control, stepUp } = useContext(ProductContext);

	return (
		<div className="h-auto border border-slate-300 rounded p-2 overflow-y-visible">
			<div>
				<p className='mb-4 font-semibold text-lg text-center'>Nueva entidad</p>
				<Input
					name='name'
					label='Nombre de la entidad'
					placeholder='Nombre de la Entidad'
					control={control}
					rules={{ required: 'Campo requerido' }}
				></Input>

				<Input
					name='address'
					label='Direccion'
					placeholder='Direccion de la Entidad'
					control={control}
					rules={{ required: 'Campo requerido' }}
				></Input>

				<Input
					name='responsable'
					label='Responsable'
					placeholder='Responsable'
					control={control}
					rules={{ required: 'Campo requerido' }}
				></Input>

				<Input
					name='phone'
					label='Telefono'
					placeholder='Telefono'
					control={control}
					rules={{ required: 'Campo requerido' }}
				></Input>

				<Input
					name='businessId'
					label='Negocio'
					placeholder='negocio'
					control={control}
					rules={{ required: 'Campo requerido' }}
				></Input>

				<Toggle
					name="allowCreateAccount"
					control={control}
					defaultValue={false}
					title="Permitir solicitar tarjetas desde la APK"
				/>

				<div className='h-full'>


				</div>
				<div className="grid grid-cols-2 gap-3 py-2">
					<div></div>
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









/*

<div className="h-96 border border-slate-300 rounded p-2 pr-4 overflow-auto scrollbar-thin scrollbar-thumb-gray-200">
<RadioGroupForm
  data={productTypes}
  name="type"
  control={control}
  action={stepUp}
/>
</div>


const onSubmit: SubmitHandler<
	Record<string, string | number | boolean | string[]>
> = (data) => {
	const sendData = Object.assign(data, {
		ownerId: 1,
		businessId: 6,
	});

	try {
		addEntity(deleteUndefinedAttr(sendData), close).then(() => close());
	} catch (error) { }
};


return (
	<main>
		<
	</main>
);








<AsyncComboBox
						name='currencyId'
						control={control}
						rules={{ required: 'Campo requerido' }}
						label='Moneda'
						dataQuery={{ url: '/currency' }}
						normalizeData={{ id: 'id', name: 'symbol' }}
					></AsyncComboBox>
					<AsyncComboBox
						name='ownerId'
						control={control}
						rules={{ required: 'Campo requerido' }}
						label='Dueño'
						dataQuery={{ url: '/user' }}
						normalizeData={{ id: 'id', name: 'fullName' }}
					></AsyncComboBox>
					<AsyncComboBox
						name='businessId'
						control={control}
						rules={{ required: 'Campo requerido' }}
						label='Negocio'
						dataQuery={{ url: '/business' }}
						normalizeData={{ id: 'id', name: 'name' }}
					></AsyncComboBox>

					<TextArea
						name='address'
						rules={{ required: 'Campo requerido' }}
						control={control}
						label='Dirección'
					></TextArea>
*/
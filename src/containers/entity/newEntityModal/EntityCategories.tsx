import { useContext, useState } from "react";
import { ProductContext } from "./NewEntityModal";
import Input from '../../../components/forms/Input';
import Button from '../../../components/misc/Button';
import GenericTable, {
	DataTableInterface,
} from '../../../components/misc/GenericTable';
import {
	PlusIcon,
} from '@heroicons/react/24/outline';
import { useForm, SubmitHandler } from "react-hook-form";
import Modal from '../../../components/modals/GenericModal';
import { Wheel } from '@uiw/react-color';
import { TrashIcon } from '@heroicons/react/24/outline';
import Checkbox from '../../../components/forms/CheckboxCat';
import { ExportModalContainer, ModifyModal } from "../entitiesInterfaces";
import { reFormat } from "../entityUtilityFunctions";
import { toast } from "react-toastify";


const EntityCategories = () => {

	const { stepUp, stepDown, data, setData, selected, setSelected } = useContext(ProductContext);
	const [isLoading] = useState(false);
	const [addEntityCategory, setaddEntityCategory] = useState(false);
	const [modifyEntityCategory, setmodifyEntityCategory] = useState(false);
	const [modifyIndex, setmodifyIndex] = useState(0);

	function basicCategory(params: any) {
		setSelected && setSelected(params);
	}

	//Table ------------------------------------------------------------------------
	const tableTitles =
		['Nombre', 'Color', 'Puntos', 'Básica', ''];

	const tableData: DataTableInterface[] = [];

	data?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'Nombre': item?.name,
				'Color': <div style={{ backgroundColor: item.color, width: '20px', height: '20px', margin: 'auto' }}></div>,
				'Puntos': item.points,
				'Básica': <Checkbox
					data={[{ id: item.id, name: '' }]}
					selected={selected}
					setSelected={basicCategory}
					displayCol={true}
				/>,
				'': <div className="flex justify-end mr-3"><Button name='Editar' action={() => rowAction(item.id)} color="slate-500"
					outline
					textColor="slate-600" /></div>
			},
		});
	});

	const rowAction = (id: number) => {
		setmodifyIndex(id);
		setmodifyEntityCategory(true);
	};

	const actions = [
		{
			icon: <PlusIcon className='h-5' />,
			title: 'Agregar categoría',
			action: () => setaddEntityCategory(true),
		},
	];

	function stepUpVerify() {
		if (selected.length === 0 || (data && data.length === 0)) {
			toast.error("Debe crear una categoría básica");
			return;
		}
		stepUp && stepUp();
	}


	return (
		<div className="h-auto border border-slate-300 rounded p-2">
			<div>
				<div className="max-h-96 h-96 overflow-y-auto">
					<p className='mb-4 font-semibold text-lg text-center'>Defina las categorías para su negocio</p>

					<GenericTable
						tableData={tableData}
						tableTitles={tableTitles}
						loading={isLoading}
						actions={actions}
					/>
				</div>
				<div className="grid grid-cols-2 gap-3 py-2 mt-9 mx-2">
					<Button
						color="slate-500"
						action={stepDown}
						name="Atrás"
						full
						outline
						textColor="slate-600"
					/>
					<Button
						color="indigo-700"
						name="Siguiente"
						full
						outline
						action={stepUpVerify}
					/>

				</div>
			</div>
			{addEntityCategory && (
				<Modal state={addEntityCategory} close={setaddEntityCategory} size={'b'} >
					<AddModalContainer
						action={setData}
						categories={data ? data : []}
						close={setaddEntityCategory}
					/>
				</Modal>
			)}

			{modifyEntityCategory && (
				<Modal state={modifyEntityCategory} close={setmodifyEntityCategory} size={'b'} >
					<ModifyModalContainer
						action={setData}
						categories={data ? data : []}
						close={setmodifyEntityCategory}
						indexModify={modifyIndex}
					/>
				</Modal>
			)}

		</div>
	);
};

export default EntityCategories;



const AddModalContainer = ({ action, categories, close }: ExportModalContainer) => {
	const [hex, setHex] = useState('#fff');
	const { control: controlForm, handleSubmit: handleSubmitAdd, watch } = useForm<Record<string, string | number>>();


	const submit: SubmitHandler<Record<string, string | number>> = (data: any) => {
		if (data) {
			data.color = hex;
			data.id = categories.length;
			action && action([...categories, data]);
			close && close();
		}
	};
	return (
		<form onSubmit={handleSubmitAdd(submit)}>
			<div className="flex flex-col">
				<div className="flex justify-center items-center flex-col xl:flex-row">
					<div className="w-3/4 xl:w-1/2 flex flex-col justify-evenly items-start">
						<div className="mt-2 w-full">
							<Input
								name="name"
								control={controlForm}
								label="Nombre de la categoría"
								rules={{
									required: 'Campo requerido',
									maxLength: {
										value: 20,
										message: 'El nombre de categoría debe tener como máximo 20 carácteres'
									}
								}}
							/>
						</div>
						<div className="mt-6 w-full">
							<Input
								name="points"
								control={controlForm}
								label="Puntos"
								type='number'
								rules={{ required: "Requerido *" }}
							/>
						</div>
						<h1 className="mt-6">Nota: Debe utilizar selector de colores para definir color de categoría</h1>
					</div>
					<div className="flex w-3/4 xl:w-1/2 items-center justify-stretch mt-5 xl:mt-1">
						<ColorSelect ExternsetHex={setHex} />
					</div>
				</div>

				<div className="flex justify-end py-2">
					<Button color="slate-600" name="Aceptar" action={submit} />
				</div>
			</div>
		</form>
	);
};

const ModifyModalContainer = ({ action, categories, close, indexModify }: ModifyModal) => {
	const [hex, setHex] = useState('#fff');
	const { control: controlForm, handleSubmit: handleSubmitAdd } = useForm<Record<string, string | number>>();

	const renderInfo = categories.find(objeto => objeto.id === indexModify);
	const submitCategories: SubmitHandler<Record<string, string | number>> = (data: any) => {

		if (indexModify !== undefined) {

			let finalCategories = [...categories];
			data.color = hex != '#fff' ? hex : renderInfo?.color;
			data.id = indexModify;
			finalCategories[indexModify] = data
			action && action(finalCategories);
			close && close();
		}
	};
	return (
		<form onSubmit={handleSubmitAdd(submitCategories)}>
			<div className="flex flex-col">
				<div className="flex justify-center items-center flex-col xl:flex-row">
					<div className="w-3/4 xl:w-1/2 flex flex-col justify-evenly items-start">
						<div className="mt-2 w-full">
							<Input
								name="name"
								control={controlForm}
								label="Nombre de la categoría"
								rules={{
									required: 'Campo requerido',
									maxLength: {
										value: 20,
										message: 'El nombre de categoría debe tener como máximo 20 carácteres'
									}
								}}
								defaultValue={renderInfo?.name}
							/>
						</div>
						<div className="mt-6 w-full">
							<Input
								name="points"
								control={controlForm}
								label="Puntos"
								type='number'
								rules={{ required: "Requerido *" }}
								defaultValue={renderInfo?.points}
							/>
						</div>
						<h1 className="mt-6">Nota: Debe utilizar selector de colores para definir color de categoría</h1>
					</div>
					<div className="flex w-3/4 xl:w-1/2 items-center justify-stretch mt-5 xl:mt-1">
						<ColorSelect ExternsetHex={setHex} color={renderInfo?.color} />
					</div>
				</div>

				<div className="flex justify-between py-2 mt-2">
					<div>
						<Button
							color="slate-500"
							action={() => {
								let finalCategories = [...categories];
								const nuevoArray = reFormat(finalCategories, indexModify);
								action && action(nuevoArray);
								close && close();
							}}
							name="Eliminar categoría"
							full
							outline
							textColor="text-red-500"
							iconAfter={<TrashIcon className='text-red-500  w-4 h-4' />}
						/>

					</div>
					<div>
						<Button color="slate-600" name="Aceptar" type="submit" />
					</div>
				</div>
			</div>
		</form>
	);
};

function ColorSelect({ ExternsetHex, color = "#ffffff" }: { ExternsetHex: Function, color?: string }) {
	const [hex, setHex] = useState(color);
	return (
		<Wheel
			style={{ marginLeft: 20, margin: 'auto' }}
			color={hex}
			onChange={(color) => {
				setHex(color.hex);
				ExternsetHex(color.hex);
			}}
		/>
	);
}



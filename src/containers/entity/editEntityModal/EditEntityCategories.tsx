import { useContext, useState } from "react";
import { ProductContext } from "./EditEntityModal";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { TrashIcon } from '@heroicons/react/24/outline';
import AlertContainer from '../../../components/misc/AlertContainer';



const EditEntityCategories = () => {

	const { stepUp, stepDown, data, setData } = useContext(ProductContext);
	const [isLoading, setIsLoading] = useState(false);
	const [addEntityCategory, setaddEntityCategory] = useState(false);
	const [modifyEntityCategory, setmodifyEntityCategory] = useState(false);
	const [modifyIndex, setmodifyIndex] = useState(0);
	const [delAction, setDelAction] = useState(false);


	//Table ------------------------------------------------------------------------
	const tableTitles =
		['Nombre', 'Color', 'Puntos'];


	const tableData: DataTableInterface[] = [];

	data?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				Nombre: item?.name,
				Color: <div style={{ backgroundColor: item.color, width: '20px', height: '20px', margin: 'auto' }}></div>,
				Puntos: item.points,
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
			title: 'Agregar categoria',
			action: () => setaddEntityCategory(true),
		},
	];


	return (
		<div className="h-auto border border-slate-300 rounded p-2">
			<div>
				<div className="max-h-96 h-96 overflow-y-auto">
					<p className='mb-4 font-semibold text-lg text-center'>Defina las categorias para su negocio</p>

					<GenericTable
						tableData={tableData}
						tableTitles={tableTitles}
						loading={isLoading}
						actions={actions}
						rowAction={rowAction}
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
						color="slate-500"
						action={stepUp}
						name="Siguiente"
						full
						outline
						textColor="slate-600"
					/>

				</div>
			</div>
			{addEntityCategory && (
				<Modal state={addEntityCategory} close={setaddEntityCategory}>
					<AddModalContainer
						action={setData}
						categories={data ? data : []}
						close={setaddEntityCategory}
					/>
				</Modal>
			)}

			{modifyEntityCategory && (
				<Modal state={modifyEntityCategory} close={setmodifyEntityCategory}>
					<ModifyModalContainer
						action={setData}
						categories={data ? data : []}
						close={setmodifyEntityCategory}
						indexModify={modifyIndex}
						deleteCat={setDelAction}
					/>
				</Modal>
			)}
			{/*
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
			*/}

		</div>
	);
};

export default EditEntityCategories;



const AddModalContainer = ({ action, categories, close }: ExportModalContainer) => {
	const [hex, setHex] = useState('#fff');
	const { control: controlForm, handleSubmit: handleSubmitAdd } = useForm<Record<string, string | number>>();

	const submit: SubmitHandler<Record<string, string | number>> = (data: any) => {
		data.color = hex;
		data.id = categories.length;
		action && action([...categories, data]);
		close && close();
	};
	return (
		<form onSubmit={handleSubmitAdd(submit)}>
			<div className="flex flex-col ">
				<div className="flex justify-center items-center">
					<div className="w-1/2 flex flex-col justify-evenly">
						<div className="mt-2">
							<Input
								name="name"
								control={controlForm}
								label="Nombre de la categoria"
								rules={{ required: "Requerido *" }}
							/>
						</div>
						<div className="mt-2">
							<Input
								name="points"
								control={controlForm}
								label="Puntos"
								rules={{ required: "Requerido *" }}
							/>
						</div>
						<h1 className="mt-6">Nota: Debe utilizar selector de colores para definir color de categoria</h1>
					</div>
					<div className="flex w-1/2 items-center justify-stretch">
						<ColorSelect ExternsetHex={setHex} />
					</div>
				</div>

				<div className="flex justify-end py-2">
					<Button color="slate-600" name="Aceptar" type="submit" />
				</div>
			</div>
		</form>
	);
};

const ModifyModalContainer = ({ action, categories, close, indexModify, deleteCat }: ModifyModalContainer) => {
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
				<div className="flex justify-center items-center">
					<div className="w-1/2 flex flex-col justify-evenly items-start">
						<div className="mt-2">
							<Input
								name="name"
								control={controlForm}
								label="Nombre de la categoria"
								rules={{ required: "Requerido *" }}
								defaultValue={renderInfo?.name}
							/>
						</div>
						<div className="mt-2">
							<Input
								name="points"
								control={controlForm}
								label="Puntos"
								rules={{ required: "Requerido *" }}
								defaultValue={renderInfo?.points}
							/>
						</div>
						<h1 className="mt-6">Nota: Debe utilizar selector de colores para definir color de categoria</h1>
						{/*
						<button className="flex items-center justify-start mt-6 w-8 h-8">
							<FontAwesomeIcon
								onClick={() => {
									let finalCategories = [...categories];
									const nuevoArray = eliminarYReorganizar(finalCategories, indexModify);
									action && action(nuevoArray);
									close && close();
								}
								}
								className="text-slate-600 hover:scale-125 w-8 h-8 "
								icon={faTrash}
							/>
						</button>
						*/}
					</div>
					<div className="flex w-1/2 items-center justify-stretch">
						<ColorSelect ExternsetHex={setHex} color={renderInfo?.color} />
					</div>
				</div>

				<div className="flex justify-between py-2">
					<div>
						<Button
							icon={<TrashIcon className='text-red-500  w-8 h-8' />}
							color='gray-50'
							type='button'
							action={() => {
								let finalCategories = [...categories];
								const nuevoArray = eliminarYReorganizar(finalCategories, indexModify);
								action && action(nuevoArray);
								close && close();
							}}
							outline
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

interface categoriesData {
	name: string;
	color: `#${string}`;
	points?: number;
	id: number;
	issueEntityId: number;
	cardImageId?: number;
}

interface ExportModalContainer {
	action: Function | undefined,
	categories: categoriesData[],
	close: Function | undefined
}

interface ModifyModalContainer {
	action?: Function,
	categories: categoriesData[],
	close?: Function,
	indexModify: number
	deleteCat?: Function,
}

function eliminarYReorganizar(array: any, idAEliminar: number) {
	// Filtrar el array para excluir el objeto con el ID a eliminar
	const newArray = array.filter((objeto: any) => objeto.id !== idAEliminar);

	// Reorganizar los IDs para que sean secuenciales
	const nuevoArray = newArray.map((objeto: any, index: any) => ({
		...objeto,
		id: index,
	}));

	return nuevoArray;
}

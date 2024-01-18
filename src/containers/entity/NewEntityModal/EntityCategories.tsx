import React, { useContext, useState } from "react";
import { ProductContext } from "./NewEntityModal";
import { useAppSelector } from "../../../store/hooks";
import RadioGroupForm from "../../../components/forms/RadioGroup";
import { getProductTypes } from "../../../utils/stylesHelpers";
import TextArea from '../../../components/forms/TextArea';
import { deleteUndefinedAttr } from '../../../utils/helpers';
import Input from '../../../components/forms/Input';
import AsyncComboBox from '../../../components/forms/AsyncCombobox';
import Button from '../../../components/misc/Button';
import StepsComponent from "../../../components/misc/StepsComponent";
import Fetching from "../../../components/misc/Fetching";
import GenericTable, {
	DataTableInterface,
} from '../../../components/misc/GenericTable';
import Paginate from '../../../components/misc/Paginate';
import {
	PlusIcon,
} from '@heroicons/react/24/outline';
import { useForm, SubmitHandler, Control } from "react-hook-form";
import Modal from '../../../components/modals/GenericModal';

const EntityCategories = () => {

	const { control, stepUp, stepDown, data=[], setData } = useContext(ProductContext);
	const [isLoading, setIsLoading] = useState(false);
	const [addEntityCategory, setaddEntityCategory] = useState(false);


	//Table ------------------------------------------------------------------------
	const tableTitles =
		['Nombre', 'Color', 'Puntos' ];


	const tableData: DataTableInterface[] = [];

	data.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				Nombre: item?.name,
				Color: <div style={{backgroundColor: item.color, width:'20px', height:'20px', margin:'auto'}}></div>,
				Puntos: item.points,
			},
		});
	});

	const rowAction = (id: number) => {
		console.log('aaaa');
	};

	const actions = [
		{
			icon: <PlusIcon className='h-5' />,
			title: 'Agregar categoria',
			action: () => setaddEntityCategory(true),
		},
	];
	



	return (
		<div className="h-auto border border-slate-300 rounded p-2 overflow-y-visible">
			<div>
				<p className='mb-4 font-semibold text-lg text-center'>Defina las categorias para su negocio</p>

				<GenericTable
					tableData={tableData}
					tableTitles={tableTitles}
					loading={isLoading}
					actions={actions}
					rowAction={rowAction}
				/>

				<div className="grid grid-cols-2 gap-3 py-2">
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
				<Modal state={addEntityCategory} close={setaddEntityCategory} size='m'>
					<ExportModalContainer action={setData} />
				</Modal>
			)}
		</div>
	);
};

export default EntityCategories;



const ExportModalContainer = ({action}: {action: Function | undefined }) => {
	const { control:controlForm, handleSubmit, reset } = useForm<Record<string, string | number>>();
	const submit: SubmitHandler<Record<string, string | number>> = (data:any) => {
		action && action(data.name);
	};
	return (
		<form onSubmit={handleSubmit(submit)}>
			<Input
				name="name"
				control={controlForm}
				label="Nombre de la categoria"
				rules={{ required: "Requerido *" }}
			/>
			
			<h1>Color de la categoria</h1>
			<ColorPicker />
			<Input
				name="points"
				control={controlForm}
				label="Puntos"
				rules={{ required: "Requerido *" }}
			/>
			<div className="flex justify-end py-2">
				<Button color="slate-600" name="Aceptar" type="submit" />
			</div>

		</form>
	);
};


const ColorPicker = () => {
  const [currentColor, setCurrentColor] = useState('red-800');
  const [iconColor, setIconColor] = useState('text-white');
  const [isOpen, setIsOpen] = useState(false);

  const colors = ['gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink'];
  const variants = [100, 200, 300, 400, 500, 600, 700, 800, 900];

  const initColor = () => {
    setCurrentColor('red-800');
    setIconColor('text-white');
  };

  const setIconWhite = () => {
    setIconColor('text-white');
  };

  const setIconBlack = () => {
    setIconColor('text-black');
  };

  const selectColor = (color:any, variant:any) => {
    setCurrentColor(`${color}-${variant}`);
    if (variant < 500) {
      setIconBlack();
    } else {
      setIconWhite();
    }
    setIsOpen(false);
  };

  return (
    <div className="bg-white mx-auto my-auto p-6">
      <div>
        <label htmlFor="color-picker" className="block mb-1 font-semibold">
          Select a color
        </label>
        <div className="flex flex-row relative">
          <input
            id="color-picker"
            className="border border-gray-400 p-2 rounded-lg"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
          />
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={`cursor-pointer rounded-full ml-3 my-auto h-10 w-10 flex ${iconColor}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto my-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </div>
          {isOpen && (
            <div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black opacity-25 z-40"
            ></div>
          )}
          {isOpen && (
            <div className="border border-gray-300 origin-top-right absolute right-0 top-full mt-2 rounded-md shadow-lg">
              <div className="rounded-md bg-white shadow-xs p-2">
                <div className="flex">
                  {colors.map((color:any) => (
                    <div key={color}>
                      {variants.map((variant:any) => (
                        <div
                          onClick={() => selectColor(color, variant)}
                          key={`${color}-${variant}`}
                          className={`cursor-pointer w-6 h-6 rounded-full mx-1 my-1 bg-${color}-${variant}`}
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};









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
*/
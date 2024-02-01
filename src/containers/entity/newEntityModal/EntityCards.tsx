import { useContext} from "react";
import { ProductContext } from "./NewEntityModal";
import Button from '../../../components/misc/Button';
import GenericImageDrop from "../../../components/misc/Images/GenericImageDrop";


const EntityCards = () => {
	const { control, stepDown, data, setImgRelation } = useContext(ProductContext);
	
	return (
		<div className="h-auto border border-slate-300 rounded p-2">
			<div className="max-h-96 min-h-96 h-96 overflow-y-auto">
			<p className='mb-4 font-semibold text-lg text-center'>Defina los diseños de tarjetas para categorías</p>
				<div className="grid grid-cols-2 gap-2 grid-flow-row auto-rows-max">
					{data?.map((obj) => (
						<div className="flex flex-col items-center p-2" key={obj.id}>
							<div className="p-2"><h1 className="font-bold uppercase text-center">{obj.name}</h1></div>
							<div className="w-4/5">
								<GenericImageDrop
									className="h-44 rounded-md border border-gray-400 m-auto overflow-hidden"
									control={control}
									name={`${obj.id}-ImageId`}
									key={obj.id}
									dataUp={setImgRelation}
									rules={{ required: 'Las imágenes de categorías son requeridas' }}
									dataIndex={obj.name}
									//previewDefault={imgRelation.find((obj:any) => obj.hasOwnProperty(obj.name)) ? imgRelation.find((obj:any) => obj.hasOwnProperty(obj.name)).src : undefined}
									//previewHash={imgRelation.find((obj:any) => obj.hasOwnProperty(obj.name)) ? imgRelation.find((obj:any) => obj.hasOwnProperty(obj.name)).hash : undefined}
								/>
							</div>
						</div>

					))}

				</div>
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
					full
					outline
					type="submit"
					name="Crear entidad"
				/>
			</div>
		</div>
	);
};

export default EntityCards;

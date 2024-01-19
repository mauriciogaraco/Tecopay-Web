import { useContext, useState, useEffect } from "react";
import { ProductContext } from "./NewEntityModal";
import Button from '../../../components/misc/Button';
import GenericImageDrop from "../../../components/misc/Images/GenericImageDrop";
import useServer from '../../../api/useServerMain';

export interface ImageView {
	id: number;
	url: string;
	hash: string;
}

const EntityCards = ({setImgRelation}:{setImgRelation:Function}) => {
	const { control, stepUp, stepDown, data, setData } = useContext(ProductContext);
	const { imgView, getImg } = useServer();

	useEffect(() => {
		getImg(26);
	}, []);

	const unknownObject: unknown = imgView;
	const anotherObject1 = unknownObject as ImageView;
	let url = imgView ? `https://paydev.tecopos.com${anotherObject1?.url}` : '';

	interface ImageLoad {
		id: number;
		src: string;
		hash: string;
	  }
	  
	return (
		<>
			<div className="max-h-96 h-96 overflow-y-auto">
			<p className='mb-4 font-semibold text-lg text-center'>Defina los diseños de tarjetas segun categorias</p>
				<div className="grid grid-cols-2 gap-2 grid-flow-row auto-rows-max">
					{data?.map((obj) => (
						<div className="flex flex-col items-center p-2" key={obj.id}>
							<div className="p-2"><h1 className="font-bold uppercase text-center">{obj.name}</h1></div>
							<div className="w-4/5">
								<GenericImageDrop
									className="h-32 rounded-md border border-gray-400 m-auto overflow-hidden"
									control={control}
									name={`${obj.id}-cardImageId`}
									key={obj.id}
									dataUp={setImgRelation}
									dataIndex={obj.name}
								/>
							</div>
						</div>

					))}

				</div>
			</div>
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
					full
					outline
					textColor="slate-600"
					type="submit"
					name="Crear entidad"
				/>
			</div>
		</>
	);
};

export default EntityCards;

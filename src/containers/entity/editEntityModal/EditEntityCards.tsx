import { useContext, useState, useEffect } from "react";
import { ProductContext } from "./EditEntityModal";
import Button from '../../../components/misc/Button';
import GenericImageDrop from "../../../components/misc/Images/GenericImageDrop";

export interface ImageView {
	id: number;
	url: string;
	hash: string;
}

const EditEntityCards = () => {
	const { control, stepUp, stepDown, data, setData, setImgRelation, category } = useContext(ProductContext);

	return (
		<div className="h-auto border border-slate-300 rounded p-2">
			<div className="max-h-96 min-h-96 h-96 overflow-y-auto">
			<p className='mb-4 font-semibold text-lg text-center'>Diseño de tarjetas para categorías</p>
				<div className="grid grid-cols-2 gap-2 grid-flow-row auto-rows-max">
					{category?.map((obj:any) => (
						<div className="flex flex-col items-center p-2" key={obj?.cardImageId?.id}>
							<div className="p-2"><h1 className="font-bold uppercase text-center">{obj.name}</h1></div>
							<div className="w-4/5">
								<GenericImageDrop
									className="h-32 rounded-md border border-gray-400 m-auto overflow-hidden"
									control={control}
									name={`obj?.cardImageId?.id`}
									key={obj?.cardImageId?.id}
									dataUp={setImgRelation}
									dataIndex={obj.name}
									previewDefault={obj?.cardImageId?.url}
									previewHash={obj?.cardImageId?.hash}
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
					color="slate-500"
					full
					outline
					textColor="slate-600"
					type="submit"
					name="Actualizar entidad"
				/>
			</div>
		</div>
	);
};

export default EditEntityCards;

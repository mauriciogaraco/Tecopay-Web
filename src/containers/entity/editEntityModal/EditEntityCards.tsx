import { useContext } from "react";
import { ProductContext } from "./EditEntityModal";
import Button from '../../../components/misc/Button';
import GenericImageDrop from "../../../components/misc/Images/GenericImageDrop";


const EditEntityCards = () => {
	const { control, setImgRelation, category } = useContext(ProductContext);

	return (
		<div className="h-auto border border-slate-300 rounded p-2">
			<div className="max-h-96 min-h-96 h-96 overflow-y-auto">
				<p className='mb-4 font-semibold text-lg text-center'>Tarjetas</p>
				<div className="grid grid-cols-2 gap-2 grid-flow-row auto-rows-max">
					{category?.map((obj: any) => (
						<div key={obj?.cardImageId?.id}>
							<div className="flex flex-col items-center p-2">
								<div className="p-2"><h1 className="font-bold uppercase text-center">{obj.name}</h1></div>
								<div className="w-4/5">
									<GenericImageDrop
										className="h-44 rounded-md border border-gray-400 m-auto overflow-hidden"
										control={control}
										name={`name-${obj.cardImageId}`}
										key={obj?.cardImageId}
										dataUp={setImgRelation}
										dataIndex={obj?.name ? obj?.name : undefined}
										previewDefault={obj?.cardImage?.url ? `https://apidevpay.tecopos.com${obj?.cardImage?.url}` : undefined}
										previewHash={obj?.cardImage?.hash ? obj?.cardImage?.hash : undefined}
									/>
								</div>
							</div>
						</div>
					))}

				</div>
			</div>
			<div className="grid grid-cols-2 gap-3 py-2 mt-9 mx-2">
				<div></div>
				<Button
					color="indigo-700"
					full
					outline
					type="submit"
					name="Actualizar entidad"
				/>
			</div>
		</div>
	);
};

export default EditEntityCards;

import { useContext, useState, useEffect } from "react";
import { ProductContext } from "./EditEntityModal";
import Button from '../../../components/misc/Button';
import GenericImageDrop from "../../../components/misc/Images/GenericImageDrop";
import query from '../../../api/APIServices';
import SpinnerLoading from '../../../components/misc/SpinnerLoading';

export interface ImageView {
	id: number;
	url: string;
	hash: string;
}
type categories = {
	id: number;
	name: string;
	color: string;
	cardImageId: number;
	issueEntityId: number;
	createdAt: Date;
	updatedAt: Date;
}

const EditEntityCards = () => {
	const { control, stepDown, setImgRelation, category } = useContext(ProductContext);
	const [imageDetails, setImageDetails] = useState<ImageView[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchDataAndUpdateObjects = async (arrayOfObjects: categories[]) => {
		try {
			const updatedImageDetailsPromises = arrayOfObjects.map(async (obj) => {
				try {
					const response = await query.get(`/image/${obj.cardImageId}`);
					if (!response.data) {
						throw new Error(`Failed to fetch data for cardImageId ${obj.cardImageId}`);
					}
					return response.data;
				} catch (error: any) {
					console.error(error.message);
					return null;
				}
			});
			const updatedImageDetails = await Promise.all(updatedImageDetailsPromises);
			setImageDetails(updatedImageDetails.filter((result) => result !== null));
		} catch (error: any) {
			console.error('Error fetching data:', error.message);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchDataAndUpdateObjects(category);
	}, []);

	const cat_imgDetails = category.map((obj1: categories) => {
		const matchingObj2 = imageDetails.find((obj2) => obj2.id === obj1.cardImageId);
		if (matchingObj2) {
			return { ...obj1, imageDetails: matchingObj2 };
		} else {
			return obj1;
		}
	});
	console.log('cat_imgDetails');
	console.log(cat_imgDetails);

	return (
		<div className="h-auto border border-slate-300 rounded p-2">
			<div className="max-h-96 min-h-96 h-96 overflow-y-auto">
				<p className='mb-4 font-semibold text-lg text-center'>Tarjetas</p>

				{loading ? <div className='h-3/4 flex justify-center items-center'><SpinnerLoading /></div> :
					<div className="grid grid-cols-2 gap-2 grid-flow-row auto-rows-max">
						{cat_imgDetails?.map((obj: any) => (
							<div key={obj?.cardImageId?.id}>
								<div className="flex flex-col items-center p-2">
									<div className="p-2"><h1 className="font-bold uppercase text-center">{obj.name}</h1></div>
									<div className="w-4/5">
										<GenericImageDrop
											className="h-32 rounded-md border border-gray-400 m-auto overflow-hidden"
											control={control}
											name={`obj?.cardImageId?.id`}
											key={obj?.cardImageId}
											dataUp={setImgRelation}
											dataIndex={obj?.name ? obj?.name : undefined}
											previewDefault={obj?.imageDetails?.url ? `https://apidevpay.tecopos.com${obj?.imageDetails?.url}` : undefined}
											previewHash={obj?.imageDetails?.hash ? obj?.imageDetails?.hash : undefined}
										/>
									</div>
								</div>
							</div>
						))}

					</div>}
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

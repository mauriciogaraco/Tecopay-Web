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

const EntityCards = () => {
	const { control, stepUp, stepDown } = useContext(ProductContext);
	const { imgView, uploadImg, isFetching, getImg } = useServer();
	const [image, setImage] = useState<any>({});


	useEffect(() => {
		getImg(16);
	}, []);

	const unknownObject: unknown = imgView;
	const anotherObject1 = unknownObject as ImageView;
	let url = imgView ? `https://paydev.tecopos.com${anotherObject1?.url}` : '';
    console.log(imgView?.id , url , imgView?.hash);

		return (
		<>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<GenericImageDrop
						className="h-40 w-40 rounded-full border border-gray-400 m-auto overflow-hidden"
						control={control}
						name="cardImageId"
						previewDefault={url}
						previewHash={imgView?.hash}
					/>
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

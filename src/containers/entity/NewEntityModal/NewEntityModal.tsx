import { useForm, SubmitHandler, Control } from "react-hook-form";
import { useState, createContext, useEffect } from "react";
import StepsComponent from "../../../components/misc/StepsComponent";
import Fetching from "../../../components/misc/Fetching";
import EntityGeneralInfo from "./EntityGeneralInfo";
import EntityCards from "./EntityCards";
import EntityCategories from "./EntityCategories";
import { deleteUndefinedAttr } from '../../../utils/helpers';
import useServerEntity from '../../../api/userServerEntity';
import userServerCategories from "../../../api/userServerCategories";


const contextData: ContextData = {};

export const ProductContext = createContext(contextData);


const NewEntityModal = ({
	action,
	isLoading,
}: propsDestructured) => {

	const {
		getAllBussinnes,
		isLoading: loading,
		business,
		addEntity,
		allEntity,
	} = useServerEntity();

	const {
		allCategories,
		addCategory
	} = userServerCategories();

	useEffect(() => {
		getAllBussinnes();
	}, []);


	const { control, handleSubmit, reset } = useForm<Record<string, string | number>>();
	const [data, setData] = useState<categoriesData[]>([]);
	const [imgRelation, setImgRelation] = useState([]);
	const [currentStep, setCurrentStep] = useState(0);

	function unifyData(imgRelation: any,) {
		imgRelation.forEach((obj: any) => {
			const key = Object.keys(obj)[0];
			const flag = data.find((elemento: any) => elemento.name === key);
			if (flag) {
				flag.cardImageId = obj[key];
			}
		});
	}
	console.log(data);
	//Form Handle -----------------------------------------------------------------------------
	const onSubmit: SubmitHandler<any> = async (datax) => {
		if (currentStep !== 2) return;
		datax.ownerId = 1;
		datax.businessId = 3;
		unifyData(imgRelation)
		addEntity(deleteUndefinedAttr(filtrarPropiedades(datax)), data, () => { })
	};

	//Step Component Data-------------------------------------------------------------
	const stepTitles = [
		"Información general",
		"Categorías",
		"Tarjetas"
	];

	const stepUp = () => setCurrentStep(currentStep + 1);
	const stepDown = () => {
		setCurrentStep(currentStep - 1)
	};
	//----------------------------------------------------------------------------------------

	return (
		<>
			<StepsComponent current={currentStep} titles={stepTitles} />
			<form onSubmit={handleSubmit(onSubmit)}>
				<ProductContext.Provider value={{ control, stepUp, stepDown, data, setData, business }}>
					{isLoading && <Fetching />}
					{currentStep === 0 && <EntityGeneralInfo />}
					{currentStep === 1 && <EntityCategories />}
					{currentStep === 2 && <EntityCards setImgRelation={setImgRelation} />}
				</ProductContext.Provider>
			</form>
		</>
	);
};

export default NewEntityModal;



export type Welcome = {
	id: number;
	name: string;
	status: string;
	slug: string;
	dni: string;
	businessCategory: BusinessCategory;
	logo: Logo | null;
}

export type BusinessCategory = {
	id: number;
	name: string;
	description: null;
}

export type Logo = {
	id: number;
	src: string;
	thumbnail: string;
	blurHash: string;
}


interface propsDestructured {
	action: Function;
	isLoading: boolean;
}

interface ContextData {
	control?: Control;
	stepUp?: Function;
	stepDown?: Function;
	data?: categoriesData[];
	setData?: Function;
	business?: Welcome[];
}

interface categoriesData {
	name: string;
	color: `#${string}`;
	points?: number;
	id: number;
	issueEntityId: number;
	cardImageId?: number;

}


interface MyObject {
	address: string;
	allowCreateAccount: boolean;
	businessId: string;
	name: string;
	ownerId: number;
	phone: string;
	responsable: string;
	[key: string]: any;
}

function filtrarPropiedades(objeto: MyObject): MyObject {
	const propiedadesPermitidas: Array<keyof MyObject> = [
		'address',
		'allowCreateAccount',
		'businessId',
		'name',
		'ownerId',
		'phone',
		'responsable',
	];

	const resultado: Partial<MyObject> = {};


	Object.keys(objeto).forEach((clave) => {
		if (propiedadesPermitidas.includes(clave as keyof MyObject)) {
			resultado[clave as keyof MyObject] = objeto[clave];
		}
	});

	return resultado as MyObject;
}
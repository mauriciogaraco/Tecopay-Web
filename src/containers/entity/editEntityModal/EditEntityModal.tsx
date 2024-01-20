import { useForm, SubmitHandler, Control } from "react-hook-form";
import { useState, createContext, useEffect } from "react";
import StepsComponent from "../../../components/misc/StepsComponent";
import EditEntityGeneralInfo from "./EditEntityGeneralInfo";
import EditEntityCards from "./EditEntityCards";
import EditEntityCategories from "./EditEntityCategories";
import { deleteUndefinedAttr } from '../../../utils/helpers';
import useServerCategories from "../../../api/userServerCategories";
import SpinnerLoading from '../../../components/misc/SpinnerLoading';

const contextData: ContextData = {};

export const ProductContext = createContext(contextData);

interface propsDestructured {
	close: Function;
	id: number;
	entityCRUD: any;
}

const EditEntityModal = ({
	id,
	close,
	entityCRUD
}: propsDestructured) => {


	const {
		getAllBussinnes,
		business,
		isLoading: loading,
		addEntity,
		updateEntity,
		entity,
		getEntity,
	} = entityCRUD;

	console.log(id)
	const { control, handleSubmit } = useForm<Record<string, string | number>>();
	const [data, setData] = useState<categoriesData[]>([]);
	const [imgRelation, setImgRelation] = useState([]);
	const [currentStep, setCurrentStep] = useState(0);

	const {
		getCategory,
		category,
	} = useServerCategories();

	useEffect(() => {
		getAllBussinnes().then(
			() => { getEntity(id) }
		).then(
			() => { getCategory(1) }
		)
	}, []);

	function unifyData(imgRelation: any,) {
		imgRelation.forEach((obj: any) => {
			const key = Object.keys(obj)[0];
			const flag = data.find((elemento: any) => elemento.name === key);
			if (flag) {
				flag.cardImageId = obj[key];
			}
		});
	}

	//Form Handle -----------------------------------------------------------------------------
	const onSubmit: SubmitHandler<any> = async (dataToSubmit) => {
		if (currentStep !== 2) return;
		dataToSubmit.ownerId = 1;
		dataToSubmit.businessId = 3;
		unifyData(imgRelation);
		//addEntity(deleteUndefinedAttr(propertyFilter(dataToSubmit)), data, close);
		updateEntity(id, deleteUndefinedAttr(propertyFilter(dataToSubmit)), data, close)
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
				<ProductContext.Provider value={{ control, stepUp, stepDown, data, setData, entity, setImgRelation, close }}>
					{!entity && <SpinnerLoading />}
					{currentStep === 0 && entity && <EditEntityGeneralInfo />}
					{currentStep === 1 && entity && <EditEntityCategories />}
					{currentStep === 2 && entity && <EditEntityCards />}
				</ProductContext.Provider>
			</form>
		</>
	);
};

export default EditEntityModal;





//Interfaces, Types & Utility functions
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


interface ContextData {
	control?: Control;
	stepUp?: Function;
	stepDown?: Function;
	data?: categoriesData[];
	setData?: Function;
	business?: Welcome[];
	entityInfo?: any;
	loadingEntity?: boolean;
	entity?: any;
	setImgRelation?: Function;
	close?: Function;
}

type categoriesData = {
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

function propertyFilter(objeto: MyObject): MyObject {
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
import { useForm, SubmitHandler, Control } from "react-hook-form";
import { useState, createContext, useEffect } from "react";
import StepsComponent from "../../../components/misc/StepsComponent";
import EditEntityGeneralInfo from "./EditEntityGeneralInfo";
import EditEntityCards from "./EditEntityCards";
import EditEntityCategories from "./EditEntityCategories";
import { deleteUndefinedAttr } from '../../../utils/helpers';
import { toast } from "react-toastify";

const contextData: ContextData = {};

export const ProductContext = createContext(contextData);

interface propsDestructured {
	close: Function;
	entityCRUD: any;
}

const EditEntityModal = ({
	close,
	entityCRUD
}: propsDestructured) => {


	const {
		business,
		isLoading: loading,
		updateEntity,
		entity,
		getCategory,
		category,
		allEntity,
		id,
		isLoadingCat,
		setCategory,
		setAllEntity,
		deleteEntity,
		isFetching,
	} = entityCRUD;

	const [data, setData] = useState<categoriesData[]>([]);
	const [imgRelation, setImgRelation] = useState([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [catToDelete, setCatToDelete] = useState<number[]>([]);
	
	//esta funcion establece el valor de la propiedad 'cardImageId' de las categorias (imagen asociada)
	function unifyData(imgRelation: any,) {
		imgRelation.forEach((obj: any) => {
			const key = Object.keys(obj)[0];
			const flag = category.find((elemento: any) => elemento.name === key);
			if (flag) {
				flag.cardImageId = obj[key];
			}
		});
	}

	//Form Handle -----------------------------------------------------------------------------

	const { control, handleSubmit, formState:{errors} } = useForm<Record<string, string | number>>();
	
	const onSubmit: SubmitHandler<any> = async (dataToSubmit) => {
		if (currentStep === 0) {stepUp(); return };
		if (currentStep === 1) { return };
		dataToSubmit.ownerId = 1;
		dataToSubmit.businessId = 3;
		unifyData(imgRelation);
		if(!category.every((obj:any) => obj.cardImageId !== null && obj.cardImageId !== undefined)) {
			toast.error('Las imágenes de categorías son requeridas');
			return;
		}
		updateEntity(id, deleteUndefinedAttr(propertyFilter(dataToSubmit)), category, catToDelete, close)
	};
	toast.error(findMessage(errors));

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
				<ProductContext.Provider value={
					{
						stepUp,
						stepDown,
						setImgRelation,
						setData,
						deleteEntity,
						setAllEntity,
						control,
						isLoadingCat,
						getCategory,
						category,
						entity,
						allEntity,
						close,
						business,
						id,
						setCategory,
						setCatToDelete,
						catToDelete,
						isFetching,
					}}>
					{/*isLoadingCat && <SpinnerLoading />*/}
					{currentStep === 0 && <EditEntityGeneralInfo />}
					{currentStep === 1 && <EditEntityCategories />}
					{currentStep === 2 && <EditEntityCards />}
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
	category?: any;
	allEntity?: any;
	id?: number;
	getCategory?: Function;
	isLoadingCat?: boolean;
	setCategory?: Function;
	setCatToDelete?: Function;
	catToDelete?:number[];
	setAllEntity?: Function;
	deleteEntity?: Function;
	isFetching?: boolean;
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

function findMessage(obj: any): string | null {
	for (const key in obj) {
	  if (obj.hasOwnProperty(key)) {
		const currentProperty = obj[key];
  
		if (typeof currentProperty === 'object' && currentProperty !== null) {
		  const nestedMessage = findMessage(currentProperty);
  
		  if (nestedMessage !== null) {
			return nestedMessage;
		  }
		} else if (key === 'message' && typeof currentProperty === 'string') {
		  return currentProperty;
		}
	  }
	}
  
	return null;
  }
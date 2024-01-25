import { useForm, SubmitHandler, Control } from "react-hook-form";
import { useState, createContext, useEffect } from "react";
import StepsComponent from "../../../components/misc/StepsComponent";
import { deleteUndefinedAttr } from '../../../utils/helpers';
import SpinnerLoading from '../../../components/misc/SpinnerLoading';
import { useAppSelector } from "../../../store/hooks";
import { toast } from "react-toastify";
import EntityGeneralInfo from "./EntityGeneralInfo";
import EntityCategories from "./EntityCategories";
import EntityCards from "./EntityCards";



const contextData: ContextData = {};

interface propsDestructured {
	close: Function;
	entityCRUD: any;
}

export const ProductContext = createContext(contextData);

const NewEntityModal = ({close, entityCRUD}: propsDestructured) => {

	const {
		isLoading,
		business,
		addEntity,
	} = entityCRUD;

	const { businessId } = useAppSelector( ( state ) => state.session );

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
	
	const { control, handleSubmit, formState:{errors} } = useForm<Record<string, string | number>>();

	const onSubmit: SubmitHandler<Record<string, string | number | null>> = (dataToSubmit) => { 
		if (currentStep === 0) {stepUp(); return };
		if (currentStep === 1) { return };
		dataToSubmit.ownerId = 1;
		dataToSubmit.businessId = 3;
		unifyData(imgRelation);
		addEntity(deleteUndefinedAttr(propertyFilter(dataToSubmit)), data, close);
	};
	toast.error(findMessage(errors));

	const stepTitles = [
		"Información general",
		"Categorías",
		"Tarjetas"
	];

	const stepUp = () => setCurrentStep(currentStep + 1);
	const stepDown = () => {
		setCurrentStep(currentStep - 1)
	};

	return (
		<>
			<StepsComponent current={currentStep} titles={stepTitles} />
			<form onSubmit={handleSubmit(onSubmit)}>
				<ProductContext.Provider value={{ control, stepUp, stepDown, data, setData, business, setImgRelation }}>
					{isLoading && <SpinnerLoading />}
					{currentStep === 0 && !isLoading && <EntityGeneralInfo />}
					{currentStep === 1 && !isLoading && <EntityCategories/>}
					{currentStep === 2 && !isLoading && <EntityCards />}
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

interface ContextData {
	control?: Control;
	stepUp?: Function;
	stepDown?: Function;
	data?: categoriesData[];
	setData?: Function;
	business?: Welcome[];
	setImgRelation?: Function;
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
	address?: string;
	allowCreateAccount?: boolean;
	businessId?: string;
	name?: string;
	ownerId?: number;
	phone?: string;
	responsable?: string;
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
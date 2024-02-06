import { useForm, SubmitHandler } from "react-hook-form";
import { useState, createContext } from "react";
import StepsComponent from "../../../components/misc/StepsComponent";
import EntityGeneralInfo from "./EntityGeneralInfo";
import EntityCards from "./EntityCards";
import EntityCategories from "./EntityCategories";
import { deleteUndefinedAttr } from '../../../utils/helpers';
import SpinnerLoading from '../../../components/misc/SpinnerLoading';
import { toast } from "react-toastify";
import { BasicNomenclator } from "../../../interfaces/ServerInterfaces";
import { ContextData } from "../entitiesInterfaces";
import { findMessage, propertyFilter } from "../entityUtilityFunctions";
import { useAppDispatch } from '../../../store/hooks';

type dataToSubmit = {
	name: string;
	address: string;
	phone: string;
	color: string;
	ownerId: number;
	businessId: number;
	allowCreateAccount: boolean;
	profileImageId: number;
	categories: Category[];
}

type Category = {
	name: string;
	color: `#${string}`;
	isBasic: boolean;
	cardImageId: number;
	id?: number;
	points?: number;
}



const contextData: ContextData = {};

interface propsDestructured {
	close: Function;
	CRUD: any;
}

export const ProductContext = createContext(contextData);

const NewEntityModal = ({ close, CRUD }: propsDestructured) => {

	const {
		isLoading,
		business,
		addEntity,
	} = CRUD;

	const [data, setData] = useState<Category[]>([]);
	const [imgRelation, setImgRelation] = useState([]);
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [selected, setSelected] = useState<BasicNomenclator[]>([]);
	const [profileImageId, setProfileImageId] = useState<any>([]);

	//This function sets the value of the 'cardImageId' property of the categories (associated image)
	function unifyData(imgRelation: any,) {
		imgRelation.forEach((obj: any) => {
			const key = Object.keys(obj)[0];
			const flag = data.find((elemento: any) => elemento.name === key);
			if (flag) {
				flag.cardImageId = obj[key]?.id;
			}
		});
	}

	function cleanCategories(arrayOfObjects:Category[]) {
		return arrayOfObjects.map(obj => {
		  const cleanedObject = {
			name: obj.name,
			color: obj.color,
			isBasic: obj.isBasic,
			cardImageId: obj.cardImageId
		  };
		  return cleanedObject;
		});
	  }

	const { control, handleSubmit, formState: { errors } } = useForm<Record<string, string | number | Category[]>>();

	const onSubmit: SubmitHandler<Record<string, string | number | Category[]>> = (dataToSubmit) => {
	
		if (currentStep === 0) {
			if (dataToSubmit?.profileImageId) {
				stepUp();
				return;
			} else {
				toast.error("Por favor defina un logotipo para la Entidad");
				return;
			}
		}
		if (currentStep === 1) { return };

		dataToSubmit.profileImageId = profileImageId[0]?.profileImageId?.id;

		unifyData(imgRelation);

		if (data.length === 0 || selected.length === 0) {
			toast.error("Por favor defina una categoría básica");
			return;
		}
		const dataCategories: Category[] = data.map(obj => ({
			...obj,
			isBasic: false,
		}));

		const idObject = selected[0]?.id;
		const objectMatch = dataCategories.find(objeto => objeto.id === idObject);
		if (objectMatch) {
			objectMatch.isBasic = true;
		} else {
			toast.error("Por favor defina una categoría básica");
		}

		dataToSubmit.categories = cleanCategories(dataCategories);

		addEntity(deleteUndefinedAttr(propertyFilter(dataToSubmit)), close);
		
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
				<ProductContext.Provider
					value={{ control, stepUp, stepDown, data, setData, business, setImgRelation, imgRelation, selected, setSelected, setProfileImageId }}>
					{isLoading && <SpinnerLoading />}
					{currentStep === 0 && !isLoading && <EntityGeneralInfo />}
					{currentStep === 1 && !isLoading && <EntityCategories />}
					{currentStep === 2 && !isLoading && <EntityCards />}
				</ProductContext.Provider>
			</form>
		</>
	);
};

export default NewEntityModal;


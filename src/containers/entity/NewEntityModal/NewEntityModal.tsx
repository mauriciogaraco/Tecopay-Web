import { useForm, SubmitHandler } from "react-hook-form";
import { useState, createContext } from "react";
import StepsComponent from "../../../components/misc/StepsComponent";
import EntityGeneralInfo from "./EntityGeneralInfo";
import EntityCards from "./EntityCards";
import EntityCategories from "./EntityCategories";
import { deleteUndefinedAttr } from '../../../utils/helpers';
import SpinnerLoading from '../../../components/misc/SpinnerLoading';
import { useAppSelector } from "../../../store/hooks";
import { toast } from "react-toastify";
import { BasicNomenclator } from "../../../interfaces/ServerInterfaces";
import { ContextData , CategoriesData } from "../EntityInterfaces";
import { findMessage , propertyFilter } from "../entityUtilityFunctions";


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

	const { businessId } = useAppSelector((state) => state.session);

	const [data, setData] = useState<CategoriesData[]>([]);
	const [imgRelation, setImgRelation] = useState([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [selected, setSelected] = useState<BasicNomenclator[]>([]);

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

	const { control, handleSubmit, formState: { errors } } = useForm<Record<string, string | number>>();

	const onSubmit: SubmitHandler<Record<string, string | number | null>> = (dataToSubmit) => {
	
		if (currentStep === 0) { stepUp(); return };
		if (currentStep === 1) { return };
		dataToSubmit.ownerId = 1;
		dataToSubmit.businessId = 3;
		unifyData(imgRelation);

		if ( data.length === 0 || selected.length === 0 ) {
			toast.error("Por favor defina una categoría básica");
			return;
		}
		const dataCategories: { id: number, name: string, basic?: boolean | null }[] =  data.map(obj => ({
			...obj,
			basic: null,
		  }));
		const idObject = selected[0]?.id;
		const objectMatch = dataCategories.find(objeto => objeto.id === idObject);
		if (objectMatch) {
			objectMatch.basic = true;
		} else {
			toast.error("Por favor defina una categoría básica");
		}
		addEntity(deleteUndefinedAttr(propertyFilter(dataToSubmit)), dataCategories, close);
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
					value={{ control, stepUp, stepDown, data, setData, business, setImgRelation, imgRelation, selected, setSelected }}>
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


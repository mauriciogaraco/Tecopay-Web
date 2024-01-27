import { useForm, SubmitHandler } from "react-hook-form";
import { useState, createContext } from "react";
import StepsComponent from "../../../components/misc/StepsComponent";
import EditEntityGeneralInfo from "./EditEntityGeneralInfo";
import EditEntityCards from "./EditEntityCards";
import EditEntityCategories from "./EditEntityCategories";
import { deleteUndefinedAttr } from '../../../utils/helpers';
import { toast } from "react-toastify";
import { BasicNomenclator } from "../../../interfaces/ServerInterfaces";
import { ContextData , CategoriesData } from "../EntityInterfaces";
import { findMessage , propertyFilter } from "../entityUtilityFunctions";

const contextData: ContextData = {};

export const ProductContext = createContext(contextData);

interface propsDestructured {
	close: Function;
	CRUD: any;
}

const EditEntityModal = ({
	close,
	CRUD
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
	} = CRUD;

	const [data, setData] = useState<CategoriesData[]>([]);
	const [imgRelation, setImgRelation] = useState([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [catToDelete, setCatToDelete] = useState<number[]>([]);
	const [selected, setSelected] = useState<BasicNomenclator[]>([]);
	
	//This function sets the value of the 'cardImageId' property of the categories (associated image)
	function unifyData(imgRelation: any,) {
		imgRelation.forEach((obj: any) => {
			const key = Object.keys(obj)[0];
			const flag = category.find((elemento: any) => elemento.name === key);
			if (flag) {
				flag.cardImageId = obj[key]?.id;
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
		if ( category.length === 0 || selected.length === 0 ) {
			toast.error("Por favor defina una categoría básica");
			return;
		}
		const dataCategories: { id: number, name: string, basic?: boolean | null }[] =  category.map((obj:any) => ({
			...obj,
			basic: null,
		  }));
		const idObjeto2 = selected[0]?.id;
		const objectMatch = dataCategories.find(objeto => objeto.id === idObjeto2);
		if (objectMatch) {
			objectMatch.basic = true;
		} else {
			toast.error("Por favor defina una categoría básica");
		}
		
		updateEntity(id, deleteUndefinedAttr(propertyFilter(dataToSubmit)), dataCategories, catToDelete, close)
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
						selected, 
						setSelected,
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


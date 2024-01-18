import { useForm, SubmitHandler, Control } from "react-hook-form";
import { useState, createContext, useEffect } from "react";
import StepsComponent from "../../../components/misc/StepsComponent";
import Fetching from "../../../components/misc/Fetching";
import EntityGeneralInfo from "./EntityGeneralInfo";
import EntityCards from "./EntityCards";
import EntityCategories from "./EntityCategories";
import { deleteUndefinedAttr } from '../../../utils/helpers';

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
}

interface categoriesData {
	name: string;
	color: `#${string}`;
	points: number;
	id: number;
}

const contextData: ContextData = {};

export const ProductContext = createContext(contextData);


const NewEntityModal = ({
	action: addEntity,
	isLoading,
}: propsDestructured) => {

	const { control, handleSubmit, reset } = useForm<Record<string, string | number>>();
	const [data, setData] = useState<categoriesData[]>([]);

	useEffect(() => {
		setData([
			{ name: "Roberto", color: '#455678', points: 23, id: 356 },
			{ name: "Juan", color: '#345678', points: 34, id: 3344 },
			{ name: "Alberto", color: '#349678', points: 56, id: 345 },
			{ name: "Pepe", color: '#344578', points: 657, id: 348 },
			{ name: "Ruben", color: '#345645', points: 343, id: 45 },
			{ name: "Luis", color: '#245678', points: 4545, id: 395 },])
	}, []);


	//Form Handle -----------------------------------------------------------------------------
	const onSubmit: SubmitHandler<Record<string, string | number>> = (data) => {
		//currentStep !== 2 ? stepUp() : addEntity(data);
		currentStep !== 2 ? stepUp() : console.log(data);;
	};

	//Step Component Data-------------------------------------------------------------
	const [currentStep, setCurrentStep] = useState(0);
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
				<ProductContext.Provider value={{ control, stepUp, stepDown, data, setData }}>
					{isLoading && <Fetching />}
					{currentStep === 0 && <EntityGeneralInfo />}
					{currentStep === 1 && <EntityCategories />}
					{currentStep === 2 && <EntityCards />}
				</ProductContext.Provider>
			</form>
		</>
	);
};

export default NewEntityModal;

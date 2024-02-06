import { useForm, SubmitHandler } from "react-hook-form";
import { useState, createContext, useEffect } from "react";
import EditEntityGeneralInfo from "./EditEntityGeneralInfo";
import EditEntityCards from "./EditEntityCards";
import EditEntityCategories from "./EditEntityCategories";
import { deleteUndefinedAttr } from '../../../utils/helpers';
import { toast } from "react-toastify";
import { BasicNomenclator } from "../../../interfaces/ServerInterfaces";
import { ContextData } from "../entitiesInterfaces";
import { findMessage, propertyFilter } from "../entityUtilityFunctions";
import TabNav from "../../../components/navigation/TabNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCreditCard,
	faList,
	faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import userServerCategories from "../../../api/userServerCategories"


const contextData: ContextData = {};

export const ProductContext = createContext(contextData);

interface propsDestructured {
	close: Function;
	CRUD: any;
}

export type Category = {
	name: string;
	color: string;
	cardImageId: number;
	cardImage: CardImage;
	IssueEntityCategory: IssueEntityCategory;
	isBasic: boolean;
	id?: number;
	newCat?: boolean;
}

export type IssueEntityCategory = {
	issueEntityId: number;
	categoryId: number;
	createdAt: Date;
	updatedAt: Date;
}

export type CardImage = {
	id: number;
	url: string;
	hash: string;
}

export interface ImageRelation {
	id: number;
	src: string;
	hash: string;
}

type CategoryData = {
	name: string;
	color: `#${string}`;
	isBasic: boolean;
	cardImageId: number;
	id?: number;
	points?: number;
}

const EditEntityModal = ({
	close,
	CRUD
}: propsDestructured) => {

	const {
		business,
		updateEntity,
		id,
		deleteEntity,
		isFetching,
		allEntity,
	} = CRUD;

	const entity = allEntity.find((obj: any) => obj.id === id);
	const [category, setCategory] = useState<Category[]>([]);
	const [data, setData] = useState<CategoryData[]>([]);
	const [imgRelation, setImgRelation] = useState([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [catToDelete, setCatToDelete] = useState<number[]>([]);
	const [selected, setSelected] = useState<BasicNomenclator[]>([]);
	const [currentTab, setCurrentTab] = useState("info");

	const { addCategory, updateCategory } = userServerCategories();

	useEffect(() => {
		entity?.categories && setCategory(entity.categories);
	}, [entity]);


	let lookingForBasicCat = category.find(obj => obj.isBasic === true);
	useEffect(() => {
		if (lookingForBasicCat) {
			setSelected([{ id: lookingForBasicCat.id ?? 0, name: '' }])
		}
	}, [lookingForBasicCat]);

	//Form Handle -----------------------------------------------------------------------------

	const { control, handleSubmit, formState: { errors }, watch } = useForm<Record<string, string | number>>();
	console.log(id);
	const onSubmit: SubmitHandler<any> = async (dataToSubmit) => {

		let dataCategories: Category[] = category?.map((obj: any) => ({
			...obj,
			isBasic: false,
		}));

		const modifiedCategories = dataCategories.map(category => {
			if (!category.newCat) {
				return {
					...category,
					cardImageId: category?.cardImage?.id,
				};
			} else {
				return category;
			}
		});

		imgRelation.forEach((obj: any) => {
			const key = Object.keys(obj)[0];
			const flag = modifiedCategories?.find((elemento: any) => elemento.name === key);
			if (flag) {
				flag.cardImageId = obj[key]?.id;
			}
		});

		if (category?.length === 0 || selected.length === 0) {
			toast.error("Por favor defina una categoría básica");
			return;
		}

		const idObjeto2 = selected[0]?.id;

		const objectMatch = modifiedCategories.find(objeto => objeto.id === idObjeto2);

		if (objectMatch) {
			objectMatch.isBasic = true;
		} else {
			toast.error("Por favor defina una categoría básica");
			return;
		}

		if (!modifiedCategories?.every((obj: any) => obj.cardImageId !== null && obj.cardImageId !== undefined)) {
			toast.error('Las imágenes de categorías son requeridas');
			return;
		}

		dataToSubmit.allowCreateAccount = watch().allowCreateAccount;

		const BasicCat = modifiedCategories.filter((obj: any) => obj.isBasic === true);

		if (BasicCat[0]?.newCat === true) {
			await addCategory(id, BasicCat[0]);
		} else {
			await updateCategory(id, BasicCat[0].id as number, BasicCat[0]);
		}
		updateEntity(id, deleteUndefinedAttr(propertyFilter(dataToSubmit)), modifiedCategories, catToDelete, close);
	};
	toast.error(findMessage(errors));


	const stepUp = () => setCurrentStep(currentStep + 1);
	const stepDown = () => {
		setCurrentStep(currentStep - 1)
	};

	//----------------------------------------------------------------------------------------

	const tabs = [
		{
			icon: <FontAwesomeIcon icon={faCircleInfo} />,
			name: "Información general",
			href: "info",
			current: currentTab === "details",
		},
		{
			icon: <FontAwesomeIcon icon={faList} />,
			name: "Categorías",
			href: "categories",
			current: currentTab === "compounds",
		},
		{
			icon: <FontAwesomeIcon icon={faCreditCard} />,
			name: "Tarjetas",
			href: "cards",
			current: currentTab === "attribute",
		},
	];

	return (
		<>
			<TabNav action={setCurrentTab} tabs={tabs} />
			<ProductContext.Provider value={
				{
					id,
					entity,
					control,
					deleteEntity,
					close,
					business,
					catToDelete,
					isFetching,
					selected,
					category,
					setCategory,
					stepUp,
					stepDown,
					setImgRelation,
					setData,
					setCatToDelete,
					setSelected,
				}}>
				<form onSubmit={handleSubmit(onSubmit)}>
					{currentTab === "info" && <EditEntityGeneralInfo />}
					{currentTab === "categories" && <EditEntityCategories />}
					{currentTab === "cards" && <EditEntityCards />}
				</form>
			</ProductContext.Provider>
		</>
	);
};

export default EditEntityModal;


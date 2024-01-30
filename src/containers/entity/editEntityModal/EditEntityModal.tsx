import { useForm, SubmitHandler } from "react-hook-form";
import { useState, createContext, useEffect } from "react";
import EditEntityGeneralInfo from "./EditEntityGeneralInfo";
import EditEntityCards from "./EditEntityCards";
import EditEntityCategories from "./EditEntityCategories";
import { deleteUndefinedAttr } from '../../../utils/helpers';
import { toast } from "react-toastify";
import { BasicNomenclator } from "../../../interfaces/ServerInterfaces";
import { ContextData, CategoriesData } from "../entitiesInterfaces";
import { findMessage, propertyFilter } from "../entityUtilityFunctions";
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchEntities } from '../../../store/slices/EntitySlice';
import TabNav from "../../../components/navigation/TabNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCreditCard,
	faList,
	faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";


const contextData: ContextData = {};

export const ProductContext = createContext(contextData);

interface propsDestructured {
	close: Function;
	CRUD: any;
}

interface categories {
	id: number;
	name: string;
	color: string;
	imageId?: number;
	cardImageId?: number;
	issueEntityId: number;
	createdAt: Date;
	updatedAt: Date;
	basic?: boolean;
}

export interface ImageRelation {
	id: number;
	src: string;
	hash: string;
}

const EditEntityModal = ({
	close,
	CRUD
}: propsDestructured) => {

	const dispatch = useAppDispatch();

	const {
		business,
		updateEntity,
		id,
		deleteEntity,
		isFetching,
	} = CRUD;

	const { entities } = useAppSelector((state) => state.Entity)
	const entity = entities.find(obj => obj.id === id)
	console.log(id);
	const [category, setCategory] = useState<categories[]>([]);
	const [data, setData] = useState<CategoriesData[]>([]);
	const [imgRelation, setImgRelation] = useState([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [catToDelete, setCatToDelete] = useState<number[]>([]);
	const [selected, setSelected] = useState<BasicNomenclator[]>([]);
	const [currentTab, setCurrentTab] = useState("info");

	useEffect(() => {
		entity && setCategory(entity.categories);
	}, [entities]);

	//Form Handle -----------------------------------------------------------------------------

	const { control, handleSubmit, formState: { errors } } = useForm<Record<string, string | number>>();

	const onSubmit: SubmitHandler<any> = async (dataToSubmit) => {

		dataToSubmit.ownerId = 1;

		const businessId = business.find((obj: any) => obj.name === dataToSubmit.businessId);
		dataToSubmit.businessId = businessId.id;

		let dataCategories: categories[] = category?.map((obj: any) => ({
			...obj,
			basic: null,
		}));

		imgRelation.forEach((obj: any) => {
			const key = Object.keys(obj)[0];
			const flag = dataCategories?.find((elemento: any) => elemento.name === key);
			if (flag) {
				flag.imageId = obj[key]?.id;
				flag.cardImageId = obj[key]?.id;
			}
		});

		if (!dataCategories?.every((obj: any) => obj.cardImageId !== null && obj.cardImageId !== undefined)) {
			toast.error('Las imágenes de categorías son requeridas');
			return;
		}

		if (category?.length === 0 || selected.length === 0) {
			toast.error("Por favor defina una categoría básica");
			return;
		}

		const idObjeto2 = selected[0]?.id;

		const objectMatch = dataCategories.find(objeto => objeto.id === idObjeto2);

		if (objectMatch) {
			objectMatch.basic = true;
		} else {
			toast.error("Por favor defina una categoría básica");
		}

		updateEntity(id, deleteUndefinedAttr(propertyFilter(dataToSubmit)), dataCategories, catToDelete, close).then(
			() => dispatch(fetchEntities())
		);
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


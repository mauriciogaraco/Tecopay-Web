import { Control } from "react-hook-form";



export interface ContextData {
	control?: Control;
	stepUp?: Function;
	stepDown?: Function;
	data?: CategoriesData[];
	setData?: Function;
	business?: Bussiness[];
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
	selected?: any;
	setSelected?: Function;
	imgRelation?: any;
}

export type BusinessCategory = {
	id: number;
	name: string;
	description: null;
}

export type Bussiness = {
	id: number;
	name: string;
	status: string;
	slug: string;
	dni: string;
	businessCategory: BusinessCategory;
	logo: Logo | null;
}

export interface CategoriesData {
	name: string;
	color: `#${string}`;
	points?: number;
	id: number;
	issueEntityId: number;
	cardImageId?: number;
	basic?: boolean;
}

export type Logo = {
	id: number;
	src: string;
	thumbnail: string;
	blurHash: string;
}

export interface FilterInterface {
	address?: string;
	allowCreateAccount?: boolean;
	businessId?: string;
	name?: string;
	ownerId?: number;
	phone?: string;
	responsable?: string;
	[key: string]: any;
}


export interface CategoriesData {
	name: string;
	color: `#${string}`;
	points?: number;
	id: number;
	issueEntityId: number;
	cardImageId?: number;
}

export interface ExportModalContainer {
	action: Function | undefined,
	categories: CategoriesData[],
	close: Function | undefined
}

export interface ModifyModal{
	action?: Function,
	categories: CategoriesData[],
	close?: Function,
	indexModify: number
	deleteCat?: Function,
}
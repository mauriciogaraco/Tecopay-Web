import { Control } from "react-hook-form";

type Category = {
	name: string;
	color: `#${string}`;
	isBasic: boolean;
	cardImageId: number;
	id?: number;
	points?: number;
}


export interface ContextData {
	control?: Control;
	stepUp?: Function;
	stepDown?: Function;
	data?: Category[];
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
	setProfileImageId?: Function;
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
	[key: string]: any;
}


//export interface CategoriesData {
//	name: string;
//	color: `#${string}`;
//	points?: number;
//	id: number;
//	cardImageId?: number;
//}

export interface ExportModalContainer {
	action: Function | undefined,
	categories: Category[],
	close: Function | undefined
}

export interface ModifyModal{
	action?: Function,
	categories: Category[],
	close?: Function,
	indexModify: number
	deleteCat?: Function,
}
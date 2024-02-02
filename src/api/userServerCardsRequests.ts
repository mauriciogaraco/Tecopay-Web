import { useState } from 'react';
import {
	type PaginateInterface,
	type AccountData,
} from '../interfaces/ServerInterfaces';
import query from './APIServices';
import useServer from './useServer';
import { toast } from 'react-toastify';
import { generateUrlParams } from '../utils/helpers';
import { type BasicType } from '../interfaces/LocalInterfaces';
import { SelectInterface } from '../interfaces/InterfacesLocal';

export type CardsRequests = {
	id: number;
	queryNumber: string;
	holderName: string;
	quantity: number;
	priority: string;
	status: string;
	observations: string;
	issueEntityId: number;
	requestedToId: number;
	createdAt: Date;
	updatedAt: Date;
	requestedBy: RequestedBy;
	requestedTo: number;
	account: number;
	issueEntity: number;
	card: any[];
}

export type RequestedBy = {
	fullName: string;
}


const useServerCardsRequests = () => {
	const { manageErrors } = useServer();
	const [isLoading, setIsLoading] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
	const [allCardsRequests, setAllCardsRequests] = useState<any>([]);
	const [cardRequestRecords, setCardRequestRecords] = useState<any>([]);
	const [cardRequest, setCardRequest] = useState<AccountData | null>(null);

	const [selectedDataToParent, setSelectedDataToParent] =
		useState<SelectInterface | null>(null);

	//Postman -> 'cardRequest / findAllRequest'	
	const getAllCardsRequests = async (filter: BasicType) => {
		setIsLoading(true);
		try {
			let resp = await query.get(`/cardRequest${generateUrlParams(filter)}`)
			setPaginate({
				totalItems: resp.data.totalItems,
				totalPages: resp.data.totalPages,
				currentPage: resp.data.currentPage,
			});
			setAllCardsRequests(resp.data.items);
		}
		catch (error) {
			manageErrors(error);
		} finally {
			setIsLoading(false);
		}
	};

	//Postman -> 'card / findAllCards'
	const GetRequestRecord = async (id: number, filter: BasicType) => {
		setIsFetching(true);
		await query
			.get(`/cardRequest/${id}/record${generateUrlParams(filter)}`)
			.then((resp) => {
				setCardRequestRecords(resp.data);
			})
			.catch((error) => {
				manageErrors(error);
			});
			setIsFetching(false);
	};

	const addSimpleCardRequest = async (data: any, close: Function) => {
		setIsFetching(true);
		setIsLoading(true);
		await query
			.post('/cardRequest/simple', data)
			.then((resp) => {

				setAllCardsRequests([...allCardsRequests, resp.data]);

				toast.success('Solicitud agregada satisfactoriamente');
			})
			.then(() => close())
			.catch((e) => {
				manageErrors(e);
			});
		setIsFetching(false);
		setIsLoading(false);
	};

	const addBulkCardRequest = async (data: any, close: Function) => {
		setIsFetching(true);
		setIsLoading(true);
		await query
			.post('/cardRequest/bulk', data)
			.then((resp) => {
				setAllCardsRequests([...allCardsRequests, resp.data]);

				toast.success('Solicitudes agregadas satisfactoriamente');
			})
			.then(() => close())
			.catch((e) => {
				manageErrors(e);
			});
		setIsFetching(false);
		setIsLoading(false);
	};

	const editCardRequest = async (
		id: number,
		data: Record<string, string | number | boolean | string[]>,
		callback?: Function,
	) => {
		setIsFetching(true);
		await query
			.patch(`/cardRequest/${id}`, data)
			.then((resp) => {
				const newCardsRequests: any = [...allCardsRequests];
				const idx = newCardsRequests.findIndex((card: any) => card.id === id);
				newCardsRequests.splice(idx, 1, resp.data);

				setAllCardsRequests(newCardsRequests);
				callback?.();
			})
			.catch((e) => {
				manageErrors(e);
			});
		setIsFetching(false);
	};

	const getCardRequest = async (id: any) => {
		setIsLoading(true);
		await query
			.get(`/cardRequest/${id}`)
			.then((resp) => {
				setCardRequest(resp.data);
			})
			.catch((error) => {
				manageErrors(error);
			});
		setIsLoading(false);
	};

	const updateCardStatus = async (
		id: number,
		data: any,
		callback?: Function,
	) => {
		try {
			setIsFetching(true);
			await query

				.post(`/cardRequest/${id}/status`, data)
				.then((resp) => {
					const newCardsRequests: any = [...allCardsRequests];
					const idx = newCardsRequests.findIndex((card: any) => card.id === id);
					newCardsRequests.splice(idx, 1, resp.data);

					setAllCardsRequests(newCardsRequests);

					toast.success('Estado Actualizado con éxito');
				})
				.catch((error) => {
					manageErrors(error);
				});
			setIsFetching(false);
		} catch (error) {
			console.log(error);
		}
	};

	const deleteCardRequest = async (id: number, callback?: Function) => {
		setIsFetching(true);
		await query
			.deleteAPI(`/cardRequest/${id}`, {})
			.then(() => {
				toast.success('Tarjeta Eliminada con éxito');
				const newCard = allCardsRequests.filter((item: any) => item.id !== id);
				setAllCardsRequests(newCard);
				callback?.();
			})
			.catch((error) => {
				manageErrors(error);
			});
		setIsFetching(false);
	};

	const acceptRequest = async (
		id: number,
		data: Record<string, string | number | boolean | string[]>,
		callback?: Function,
	) => {
		setIsFetching(true);
		await query
			.post(`/cardRequest/accept`, data)
			.then(() => {
				toast.success('Tarjeta Aceptada con éxito');
				const newCard = allCardsRequests.filter((item: any) => item.id !== id);
				setAllCardsRequests(newCard);
				callback?.();
			})
			.catch((error) => {
				manageErrors(error);
			});
		setIsFetching(false);
	};



	return {
		paginate,
		isLoading,
		isFetching,
		cardRequest,
		getAllCardsRequests,
		addSimpleCardRequest,
		getCardRequest,
		editCardRequest,
		deleteCardRequest,
		manageErrors,
		allCardsRequests,
		setAllCardsRequests,
		addBulkCardRequest,
		setSelectedDataToParent,
		acceptRequest,
		GetRequestRecord,
		updateCardStatus,
		cardRequestRecords,
	};
};
export default useServerCardsRequests;

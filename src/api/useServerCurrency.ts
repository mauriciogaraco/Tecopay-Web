import { useState } from 'react';
import type {
	CurrencyInterface,
	PaginateInterface,
} from '../interfaces/ServerInterfaces';
import query from './APIServices';
import useServer from './useServer';
import { generateUrlParams } from '../utils/helpers';
import { BasicType } from '../interfaces/InterfacesLocal';
import { toast } from 'react-toastify';

const useServerCurrency = () => {
	const { manageErrors } = useServer();
	const [isLoading, setIsLoading] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
	const [allCurrencys, setAllCurrencys] = useState<CurrencyInterface[]>([]);

	const getAllCurrencys = async (filter: BasicType) => {
		setIsLoading(true);
		await query
			.get(`/currency${generateUrlParams(filter)}`)
			.then((resp) => {
				setPaginate({
					totalItems: resp.data.totalItems,
					totalPages: resp.data.totalPages,
					currentPage: resp.data.currentPage,
				});
				setAllCurrencys(resp.data.items);
			})
			.catch((error) => {
				manageErrors(error);
			});
		setIsLoading(false);
	};

	const registerNewCurrency = async (data: any, close: Function) => {
		setIsFetching(true);
		setIsLoading(true);
		await query
			.post('/currency', data)
			.then((resp) => {
				setAllCurrencys([...allCurrencys, resp.data]);

				toast.success('Moneda registrada satisfactoriamente');

				// getAllCurrencys({})
			})
			.then(() => close())
			.catch((e) => {
				manageErrors(e);
			});
		setIsFetching(false);
		setIsLoading(false);
	};

	const updateCurrency = async (id: number, data: any, close: Function) => {
		setIsFetching(true);
		setIsLoading(true);
		await query
			.patch(`/currency/${id}`, data)
			.then((resp) => {
				setAllCurrencys([...allCurrencys, resp.data]);

				toast.success('Moneda modificada satisfactoriamente');

				// getAllCurrencys({})
			})
			.then(() => close())
			.catch((e) => {
				manageErrors(e);
			});
		setIsFetching(false);
		setIsLoading(false);
	};

	return {
		paginate,
		isLoading,
		isFetching,
		allCurrencys,
		getAllCurrencys,
		registerNewCurrency,
		updateCurrency,
	};
};

export default useServerCurrency;

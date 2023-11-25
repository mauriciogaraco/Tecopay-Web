import { useState } from 'react';
import type {
	CurrencyInterface,
	ExchangeRateInterface,
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
	const [allExchangeRates, setAllExchangeRates] = useState<ExchangeRateInterface[]>([]);

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

			})
			.then(() => close())
			.catch((e) => {
				manageErrors(e);
			});
		setIsFetching(false);
		setIsLoading(false);
	};

	const deleteCurrency = async (id: number, close: Function) => {
		setIsFetching(true);
		await query
		  .deleteAPI(`/currency/${id}`, {})
		  .then(() => {
			toast.success("Moneda eliminada con éxito");
			const newCurrencys = allCurrencys.filter((item:any) => item.id !== id);
			setAllCurrencys(newCurrencys)
			
		  })
		  .then(() => close())
		  .catch((error) => { manageErrors(error); });
		setIsFetching(false);
	  };


	const getAllExchangeRate = async (filter: BasicType) => {
		setIsLoading(true);
		await query
			.get(`/exchangerate${generateUrlParams(filter)}`)
			.then((resp) => {
				setPaginate({
					totalItems: resp.data.totalItems,
					totalPages: resp.data.totalPages,
					currentPage: resp.data.currentPage,
				});
				setAllExchangeRates(resp.data.items);
			})
			.catch((error) => {
				manageErrors(error);
			});
		setIsLoading(false);
	};


	const registerNewExchangeRate = async (data: any, close: Function) => {
		setIsFetching(true);
		setIsLoading(true);
		await query
			.post('/exchangerate', data)
			.then((resp) => {
				setAllExchangeRates([...allCurrencys, resp.data]);

				toast.success('Tasa registrada satisfactoriamente');

			})
			.then(() => close())
			.catch((e) => {
				manageErrors(e);
			});
		setIsFetching(false);
		setIsLoading(false);
	};

	const updateExchangeRate = async (id: number, data: any, close: Function) => {
		setIsFetching(true);
		setIsLoading(true);
		await query
			.patch(`/exchangerate/${id}`, data)
			.then((resp) => {
				setAllExchangeRates([...allCurrencys, resp.data]);

				toast.success('Tasa modificada satisfactoriamente');

			})
			.then(() => close())
			.catch((e) => {
				manageErrors(e);
			});
		setIsFetching(false);
		setIsLoading(false);
	};

	const deleteExchangeRate= async (id: number, close: Function) => {
		setIsFetching(true);
		await query
		  .deleteAPI(`/exchangerate/${id}`, {})
		  .then(() => {
			toast.success("Tasa eliminada con éxito");
			const newCurrencys = allCurrencys.filter((item:any) => item.id !== id);
			setAllCurrencys(newCurrencys)
			
		  })
		  .then(() => close())
		  .catch((error) => { manageErrors(error); });
		setIsFetching(false);
	  };

	return {
		paginate,
		isLoading,
		isFetching,
		allCurrencys,
		getAllCurrencys,
		registerNewCurrency,
		updateCurrency,
		deleteCurrency,
		getAllExchangeRate,
		allExchangeRates,
		registerNewExchangeRate,
		updateExchangeRate,
		deleteExchangeRate
	};
};

export default useServerCurrency;

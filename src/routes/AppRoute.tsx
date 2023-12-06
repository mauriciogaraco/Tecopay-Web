import { Route, Routes } from 'react-router-dom';

import NotFoundpage from '../pages/NotFoundPage';
import Dashboard from '../pages/DashboardPage';
import 'react-toastify/dist/ReactToastify.css';

import AppContainer from '../containers/AppContainer';

import Accounts from '../containers/accounts/Accounts';
import { Suspense, lazy, useEffect, useState } from 'react';
import Loading from '../components/misc/Loading';
import Entity from '../containers/entity/Entity';
import Card from '../containers/card/Card';
import CardRequests from '../containers/card/CardRequests';
import { useAppDispatch } from '../store/hooks';
import useInitialLoad from '../api/useInitialLoad';
import AccountDetails from '../containers/accounts/Details/AccountDetails';
import Users from '../containers/users/Users';
import CurrencyList from '../containers/currencys/currencyList/CurrencyList';
import CurrencyExchangeRate from '../containers/currencys/currencyExchangeRate/CurrencyExchangeRate';
import { fetchRole } from '../store/slices/roleSlice';
import Transfer from '../containers/accounts/Details/transactions/Transfer';
import Charge from '../containers/accounts/Details/transactions/Charge';

const AppRoute = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchRole());
	}, [dispatch]);

	return (
		<Routes>
			<Route path='/' element={<AppContainer />}>
				<Route index element={<Dashboard />} />
				<Route path='/accounts' element={<Accounts />} />
				<Route path='/cards/all' element={<Card />} />
				<Route path='/cards/requests' element={<CardRequests />} />
				<Route path='/entities' element={<Entity />} />
				<Route path='/accounts/details' element={<AccountDetails />} />
				<Route path='/users' element={<Users />} />
				<Route path='/coins/list' element={<CurrencyList />} />
				<Route
					path='/coins/exchangeRate'
					element={<CurrencyExchangeRate />}
				/>{' '}
			</Route>
			<Route path='/*' element={<NotFoundpage />} />
		</Routes>
	);
};

export default AppRoute;

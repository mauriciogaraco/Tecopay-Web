import { Route, Routes } from 'react-router-dom';
import NotFoundpage from '../pages/NotFoundPage';
import 'react-toastify/dist/ReactToastify.css';
import AppContainer from '../containers/AppContainer';
import { lazy, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { fetchLoggedUser } from '../store/slices/loggedUserSlice';
import { fetchEntities } from '../store/slices/EntitySlice';

const AppRoute = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchLoggedUser());
		dispatch(fetchEntities());
	}, [dispatch]);

	const LazyDashboard = lazy(() => import('../pages/DashboardPage'));
	const LazyAccounts = lazy(() => import('../containers/accounts/Accounts'));
	const LazyCard = lazy(() => import('../containers/card/Card'));
	const LazyCardRequests = lazy(() => import('../containers/card/CardRequests'));
	const LazyEntity = lazy(() => import('../containers/entity/Entity'));
	const LazyAccountDetails = lazy(() => import('../containers/accounts/Details/AccountDetails'));
	const LazyUsers = lazy(() => import('../containers/users/Users'));
	const LazyCurrencyList = lazy(() => import('../containers/currencys/currencyList/CurrencyList'));
	const LazyCurrencyExchangeRate = lazy(() => import('../containers/currencys/currencyExchangeRate/CurrencyExchangeRate'));

	return (
		<Routes>
			<Route path='/' element={<AppContainer />}>
				<Route index Component={LazyDashboard} />
				<Route path='/accounts' Component={LazyAccounts} />
				<Route path='/cards/all' Component={LazyCard} />
				<Route path='/cards/requests' Component={LazyCardRequests} />
				<Route path='/entities' Component={LazyEntity} />
				<Route path='/accounts/details' Component={LazyAccountDetails} />
				<Route path='/users' Component={LazyUsers} />
				<Route path='/coins/list' Component={LazyCurrencyList} />
				<Route path='/coins/exchangeRate' Component={LazyCurrencyExchangeRate} />
			</Route>
			<Route path='/*' element={<NotFoundpage />} />
		</Routes>
	);
};

export default AppRoute;

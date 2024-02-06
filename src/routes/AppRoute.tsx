import { Route, Routes } from 'react-router-dom';
import NotFoundpage from '../pages/NotFoundPage';
import 'react-toastify/dist/ReactToastify.css';
import AppContainer from '../containers/AppContainer';
import { lazy, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { fetchLoggedUser, fetchLoggedUserRole } from '../store/slices/loggedUserSlice';

const AppRoute = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchLoggedUser()).then(
			()=>{dispatch(fetchLoggedUserRole())}
		);
	}, [dispatch]);

	const LazyDashboard = lazy(() => import('../pages/DashboardPage'));
	const LazyAccounts = lazy(() => import('../containers/accounts/Accounts'));
	const LazyCard = lazy(() => import('../containers/card/AcceptedCardRequest'));
	const LazyCardRequests = lazy(() => import('../containers/card/CardRequests'));
	const LazyEntity = lazy(() => import('../containers/entity/Entity'));
	const LazyAccountDetails = lazy(() => import('../containers/accounts/Details/AccountDetails'));
	const LazyUsers = lazy(() => import('../containers/users/Users'));

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
			</Route>
			<Route path='/*' element={<NotFoundpage />} />
		</Routes>
	);
};

export default AppRoute;

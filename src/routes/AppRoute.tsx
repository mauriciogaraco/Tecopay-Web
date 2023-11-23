import { Route, Routes } from 'react-router-dom';

import NotFoundpage from '../pages/NotFoundPage';
import Dashboard from '../pages/DashboardPage';
import 'react-toastify/dist/ReactToastify.css';

import AppContainer from '../containers/AppContainer';

import Accounts from '../containers/accounts/Accounts';
import Entity from '../containers/entity/Entity';
import Card from '../containers/card/Card';
import CardRequests from '../containers/card/CardRequests';
import AccountDetails from '../containers/accounts/Details/AccountDetails';
import Users from '../containers/users/Users';
import CurrencyList from '../containers/currencys/currencyList/CurrencyList';
import CurrencyExchangeRate from '../containers/currencys/currencyExchangeRate/CurrencyExchangeRate';

const AppRoute = () => {
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
				<Route path='/coins/exchangeRate' element={<CurrencyExchangeRate />} />
			</Route>
			<Route path='/*' element={<NotFoundpage />} />
		</Routes>
	);
};

export default AppRoute;

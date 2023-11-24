import { Route, Routes } from 'react-router-dom';

import NotFoundpage from '../pages/NotFoundPage';
import Dashboard from '../pages/DashboardPage';
import 'react-toastify/dist/ReactToastify.css';

import AppContainer from '../containers/AppContainer';

import Accounts from '../containers/accounts/Accounts';
import { Suspense, lazy, useEffect } from 'react';
import Loading from '../components/misc/Loading';
import Entity from '../containers/entity/Entity';
import Card from '../containers/card/Card';
import CardRequests from '../containers/card/CardRequests';
import AccountDetails from '../containers/accounts/Details/AccountDetails';
import Users from '../containers/users/Users';
import { setFullUser } from '../store/slices/initSlice';
import { useAppDispatch } from '../store/hooks';
import useInitialLoad from '../api/useInitialLoad';

//Almacenes
/*const ListStocks = lazy(() => import("../containers/areas/ListStocks"));

const DetailStockContainer = lazy(
  () => import("../containers/areas/stock/DetailStockContainer")
);

const ListStockDispatches = lazy(
  () => import("../containers/areas/stock/dispatch/ListStockDispatches")
);

const ReportContainer = lazy(
  () => import("../containers/areas/stock/reports/ReportContainer")
);*/

const AppRoute = () => {
	const { init } = useInitialLoad();

	useEffect(() => {
		init();
	}, []);
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

				{/**Stocks */}
				<>
					{/*<Route
              //index={roles.isManagerArea}
              path="/stocks"
              element={
                <Suspense fallback={<Loading loading={false} />}>
                  <ListStocks />
                </Suspense>
              }
            />
            <Route
              path="/stocks/:stockId"
              element={
                <Suspense fallback={<Loading loading={false} />}>
                  <DetailStockContainer />
                </Suspense>
              }
            />
            <Route
              path="/stocks/dispatches"
              element={
                <Suspense fallback={<Loading loading={false} />}>
                  <ListStockDispatches />
                </Suspense>
              }
            />
            <Route
              path="/stocks/reports"
              element={
                <Suspense fallback={<Loading loading={false} />}>
                  <ReportContainer />
                </Suspense>
              }
            />
          </>*/}
				</>
			</Route>
			<Route path='/*' element={<NotFoundpage />} />
		</Routes>
	);
};

export default AppRoute;

import { Route, Routes } from "react-router-dom";

import NotFoundpage from "../pages/NotFoundPage";
import Dashboard from "../pages/DashboardPage";
import "react-toastify/dist/ReactToastify.css";

import AppContainer from "../containers/AppContainer";

import Tickets from "../containers/tickets/Tickets";
import { Suspense, lazy } from "react";
import Loading from "../components/misc/Loading";
import Entity from "../containers/Entity/Entity";
import Card from "../containers/Card/Card";


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
  return (
    <Routes>
      <Route path="/" element={<AppContainer />}>
        <Route index element={<Dashboard />} />
        <Route path="/cuentas" element={<Tickets />} />
        <Route path="/tarjetas" element={<Card />} />
        <Route path="/cuentas/Detalles" element={<Tickets />} />
        <Route path="/entidades" element={<Entity />} />
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

        </></Route>
      <Route path="/*" element={<NotFoundpage />} />
    </Routes>
  );
};

export default AppRoute;

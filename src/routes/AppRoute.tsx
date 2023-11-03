import { Route, Routes } from "react-router-dom";

import NotFoundpage from "../pages/NotFoundPage";
import Dashboard from "../pages/DashboardPage";
import "react-toastify/dist/ReactToastify.css";

import AppContainer from "../containers/AppContainer";

import Tickets from "../pages/Tickets";

const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<AppContainer />}>
        <Route index element={<Dashboard />} />
        <Route path="/cuentas" element={<Tickets />} />
      </Route>
      <Route path="/*" element={<NotFoundpage />} />
    </Routes>
  );
};

export default AppRoute;

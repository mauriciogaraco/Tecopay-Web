import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import 'date-fns/locale/es';
import SideBar from '../components/Sidebar';
//import useInitialLoad from "../api/useInitialLoad";
import Loading from '../components/misc/Loading';
import Navbar from '../components/Navbar';
import { useAppSelector } from '../store/hooks';
moment.updateLocale('es', {
	invalidDate: ' -',
});

const AppContainer = () => {
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
	const switchSideBar = () => {
		setSidebarOpen(!sidebarOpen);
	};
	const { staticBar } = useAppSelector((state) => state.session);
	/*//const { init, isLoading } = useInitialLoad();

  useEffect(() => {
    init();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );*/
	return (
		<div className='relative h-screen w-screen'>
			<Navbar />
			<SideBar barState={sidebarOpen} switchSideBar={switchSideBar} />
			<div
				className={`fixed w-full ${
					staticBar ? 'md:pl-64' : 'md:pl-20'
				} pt-24 md:pt-16 h-full`}
			>
				<main className='sm:px-2 md:px-4 lg:px-8 py-5 h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300'>
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default AppContainer;

import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import 'date-fns/locale/es';
import SideBar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAppSelector } from '../store/hooks';
import SpinnerLoading from '../components/misc/SpinnerLoading';
moment.updateLocale('es', {
	invalidDate: ' -',
});

const AppContainer = () => {

	const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

	const switchSideBar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const { staticBar } = useAppSelector((state) => state.session);
	
	return (
		<div className='relative h-screen w-screen'>
			<Navbar />
			<SideBar barState={sidebarOpen} switchSideBar={switchSideBar} />
			<div
				className={`fixed w-full ${staticBar ? 'md:pl-64' : 'md:pl-20'
					} pt-24 md:pt-16 h-full`}
			>
				<main className='sm:px-2 md:px-4 lg:px-8 py-5 h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300'>
					<Suspense fallback={
						<div className='w-full h-full flex justify-center items-center'><SpinnerLoading /></div>
					}>
						<Outlet />
					</Suspense>
				</main>
			</div>
		</div>
	);
};

export default AppContainer;

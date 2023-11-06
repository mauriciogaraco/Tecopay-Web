import { Bars3Icon } from '@heroicons/react/24/outline';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

type Childs = {
	switchSidebar: Function;
};

const MainContainer = ({ switchSidebar }: Childs) => {
	return (
		<>
			<div className='flex flex-1 flex-col md:pl-64 py-10'>
				<div className='sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden'>
					<button
						type='button'
						className='-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-600'
						onClick={() => switchSidebar(true)}
					>
						<span className='sr-only'>Open sidebar</span>
						<Bars3Icon className='h-6 w-6' aria-hidden='true' />
					</button>
				</div>
				<main className='flex-1 px-10 overflow-auto'>
					<Outlet />
				</main>
			</div>
		</>
	);
};

export default MainContainer;

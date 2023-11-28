import { Fragment, useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';

import {
	ArrowRightOnRectangleIcon,
	Cog6ToothIcon,
	LockClosedIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
} from '@heroicons/react/24/outline';

import moment from 'moment';
import { IoCloudOfflineOutline, IoLogoWebComponent } from 'react-icons/io5';
import { useAppSelector } from '../store/hooks';
import useServer from '../api/useServer';
import LoadingSpin from './misc/LoadingSpin';
import Modal from './modals/GenericModal';
import PasswordModal from './app/PasswordModal';
import UserModal from './app/UserModal';
import Logo from '../assets/png/logo-tecopay.png';

const Navbar = () => {
	const { logOut, isFetching } = useServer();

	const [userModal, setUserModal] = useState(false);
	const [passwModal, setPasswModal] = useState(false);

	//Conexion listener -----------------------------------------------------------------
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	useEffect(() => {
		function onlineHandler() {
			setIsOnline(true);
		}

		function offlineHandler() {
			setIsOnline(false);
		}

		window.addEventListener('online', onlineHandler);
		window.addEventListener('offline', offlineHandler);

		return () => {
			window.removeEventListener('online', onlineHandler);
			window.removeEventListener('offline', offlineHandler);
		};
	}, []);

	//--------------------------------------------------------------------------------
	//Licence alert ---------------------------------------------------------
	let difference: number | undefined;
	//------------------------------------------------------------------------
	return (
		<>
			<div
				className={`fixed w-full top-0 z-40 flex h-16 flex-shrink-0 bg-${
					difference && difference >= 0 ? 'red' : 'gray'
				}-50 shadow`}
			>
				<div className='flex flex-1 justify-between items-center gap-10'>
					<div className='flex'>
						<div className='w-16 h-16 self-center mt-3'>
							<img className='' src={Logo} alt='Logo de Tecopay' />
						</div>
						<h4 className=' flex items-center font-semibold'>Tecopay</h4>
					</div>

					{!navigator.onLine && (
						<div className='flex flex-grow justify-center items-center gap-2 '>
							<IoCloudOfflineOutline className='text-red-500 font-semibold' />
							<h5 className='text-red-500 font-semibold'>Sin conexión</h5>
						</div>
					)}

					<div className='inline-flex gap-5'>
						<div className='ml-4 mr-3 flex items-center md:ml-6 flex-shrink-0'></div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Navbar;

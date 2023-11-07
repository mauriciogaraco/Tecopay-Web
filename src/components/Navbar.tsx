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
	const { user, business } = useAppSelector((state) => state.init);

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
	let licenceData = {
		color: 'green-700',
		text: 'Licencia activa',
		icon: CheckCircleIcon,
	};

	if (business?.licenceUntil) {
		difference = moment().diff(moment(business?.licenceUntil), 'hours');
		if (difference >= 0) {
			licenceData = {
				color: 'red-600',
				text: 'Su licencia expiró',
				icon: ExclamationTriangleIcon,
			};
		} else if (Math.abs(difference) < 72) {
			licenceData = {
				color: 'yellow-500',
				text: `Su licencia expira el ${moment(
					business?.licenceUntil ?? '',
				).format('DD/MM/YYYY hh:mm A')}`,
				icon: ExclamationTriangleIcon,
			};
		}
	}
	//------------------------------------------------------------------------
	return (
		<>
			<div
				className={`fixed w-full top-0 z-40 flex h-16 flex-shrink-0 bg-${
					business?.subscriptionPlan.code !== 'FREE' &&
					difference &&
					difference >= 0
						? 'red'
						: 'gray'
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
						{business?.subscriptionPlan.code !== 'FREE' && (
							<div className='inline-flex gap-1 justify-end items-center flex-shrink-0'>
								{
									<licenceData.icon
										className={`h-5 text-${licenceData.color}`}
									/>
								}
								<p className={`text-${licenceData.color} text-sm`}>
									{licenceData.text}
								</p>
							</div>
						)}

						<div className='ml-4 mr-3 flex items-center md:ml-6 flex-shrink-0'>
							{/* Profile dropdown */}
							<Menu as='div' className='relative ml-3'>
								<div>
									<Menu.Button className='flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
										<span className='sr-only'>Open user menu</span>
										<img
											className='h-8 w-8 rounded-full'
											src={
												user?.avatar?.src ??
												require('../assets/user-default.jpg')
											}
											alt=''
										/>
									</Menu.Button>
								</div>
								<Transition
									as={Fragment}
									enter='transition ease-out duration-100'
									enterFrom='transform opacity-0 scale-95'
									enterTo='transform opacity-100 scale-100'
									leave='transition ease-in duration-75'
									leaveFrom='transform opacity-100 scale-100'
									leaveTo='transform opacity-0 scale-95'
								>
									<Menu.Items className='absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
										<Menu.Item>
											<div>
												<div className='relative flex items-center rounded-lg bg-white px-2 py-2 gap-2'>
													<div className='flex-shrink-0'>
														<img
															className='h-16 w-16 rounded-full'
															src={
																user?.avatar?.src ??
																require('../assets/user-default.jpg')
															}
															alt=''
														/>
													</div>
													<div className='min-w-0 flex-1'>
														<a href='#' className='focus:outline-none'>
															<span
																className='absolute inset-0'
																aria-hidden='true'
															/>
															<p className='text-sm font-medium text-gray-900'>
																{user?.displayName}
															</p>
															<p className='text-xs text-gray-500 flex flex-col'>
																{user?.roles?.map((item: any, idx: any) => (
																	<span key={idx}>{item.name}</span>
																))}
															</p>
														</a>
													</div>
												</div>
												<button
													className='flex justify-start items-center w-full px-4 py-2 text-sm text-gray-700 shadow-inner gap-1 font-medium'
													onClick={(e) => {
														//e.preventDefault();
														setUserModal(true);
													}}
												>
													<Cog6ToothIcon className='h-5' />
													Configurar mi cuenta
												</button>
												<button
													className='flex justify-start items-center w-full px-4 py-2 text-sm text-gray-700 shadow-inner gap-1 font-medium'
													onClick={(e) => {
														//e.preventDefault();
														setPasswModal(true);
													}}
												>
													<LockClosedIcon className='h-5' />
													Cambiar contraseña
												</button>
												<button
													className='flex justify-start items-center w-full px-4 py-2 text-sm text-gray-700 shadow-inner gap-1 font-medium'
													onClick={(e) => {
														e.preventDefault();
														logOut();
													}}
												>
													{isFetching ? (
														<LoadingSpin color='gray-800' />
													) : (
														<ArrowRightOnRectangleIcon className='h-5' />
													)}
													Salir
												</button>
											</div>
										</Menu.Item>
									</Menu.Items>
								</Transition>
							</Menu>
						</div>
					</div>
				</div>
			</div>

			{userModal && (
				<Modal state={userModal} close={() => setUserModal(false)}>
					<UserModal closeModal={() => setUserModal(false)} />
				</Modal>
			)}

			{passwModal && (
				<Modal state={passwModal} close={() => setPasswModal(false)}>
					<PasswordModal closeModal={() => setPasswModal(false)} />
				</Modal>
			)}
		</>
	);
};

export default Navbar;

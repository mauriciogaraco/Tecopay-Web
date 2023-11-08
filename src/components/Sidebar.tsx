import { Fragment, useState } from 'react';
import { Dialog, Transition, Disclosure } from '@headlessui/react';
import {
	LockClosedIcon,
	Bars3Icon,
	ShoppingBagIcon,
	ArrowPathRoundedSquareIcon,
	HomeIcon,
	UsersIcon,
	XMarkIcon,
	Cog8ToothIcon,
	UserGroupIcon,
	ClipboardDocumentListIcon,
	ChevronRightIcon,
	BanknotesIcon,
	ArrowTrendingUpIcon,
	BuildingStorefrontIcon,
	RectangleGroupIcon,
	CreditCardIcon,
	TruckIcon,
	MegaphoneIcon,
	UserCircleIcon,
	HomeModernIcon,
	Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useLocation, Link } from 'react-router-dom';

import { BsPin } from 'react-icons/bs';

import { AiOutlineFire } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import ImageComponent from './misc/Images/Image';
import { changeStaticBar } from '../store/slices/sessionSlice';
import Modal from './modals/GenericModal';

interface SideBarProps {
	barState: boolean;
	switchSideBar: Function;
}

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

interface NavChildren {
	name: string;
	href: string;
	current: boolean;
	block?: boolean;
}

interface NavItem {
	name: string;
	icon: any;
	current: boolean;
	href?: string;
	block?: boolean;
	children?: NavChildren[];
}

const SideBar = ({ barState, switchSideBar }: SideBarProps) => {
	const { pathname } = useLocation();
	const mainCurrent = pathname.split('/')[1];
	const secondaryCurrent = pathname.split('/')[2];
	const { business, branches, user, roles } = useAppSelector(
		(state) => state.init,
	);
	const { staticBar } = useAppSelector((state) => state.session);

	const dispatch = useAppDispatch();

	//NavItems

	const navigation: NavItem[] = [
		{
			name: 'Dashboard',
			href: '/',
			icon: HomeIcon,
			current: mainCurrent === '',
		},

		{
			name: 'Cuentas',
			href: 'cuentas',
			icon: UserCircleIcon,
			current: mainCurrent === 'cuentas',
		},
		{
			name: 'Tarjetas',
			href: 'tarjetas',
			icon: CreditCardIcon,
			current: mainCurrent === 'tarjetas',

			children: [
				{
					name: 'Todas',
					href: `/tarjetas`,
					current: !secondaryCurrent && mainCurrent === 'tarjetas',
				},
				{
					name: 'Reportes',
					href: `/stocks/reports`,
					current: secondaryCurrent === 'reports' && mainCurrent === 'stocks',
				},
			],
		},
		{
			name: 'Entidades',
			href: 'entidades',
			icon: HomeModernIcon,
			current: mainCurrent === 'entidades',
		},
		{
			name: 'Configuración',
			href: 'configuration',
			icon: Cog6ToothIcon,
			current: mainCurrent === 'configuration',
		},
	];

	const [changeBusinessModal, setChangeBusinessModal] = useState(false);

	const [disclosure, setDisclosure] = useState<number | null>(null);

	return (
		<>
			<Transition.Root show={barState} as={Fragment}>
				<Dialog
					as='div'
					className='relative z-40 md:hidden'
					onClose={() => switchSideBar()}
				>
					<Transition.Child
						as={Fragment}
						enter='transition-opacity ease-linear duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='transition-opacity ease-linear duration-300'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-tecopay-600 bg-opacity-75' />
					</Transition.Child>

					<div className='fixed inset-0 z-40 flex'>
						<Transition.Child
							as={Fragment}
							enter='transition ease-in-out duration-300 transform'
							enterFrom='-translate-x-full'
							enterTo='translate-x-0'
							leave='transition ease-in-out duration-300 transform'
							leaveFrom='translate-x-0'
							leaveTo='-translate-x-full'
						>
							<Dialog.Panel className='relative flex w-full max-w-xs flex-1 flex-col bg-tecopay-800 pt-5 pb-4'>
								<Transition.Child
									as={Fragment}
									enter='ease-in-out duration-300'
									enterFrom='opacity-0'
									enterTo='opacity-100'
									leave='ease-in-out duration-300'
									leaveFrom='opacity-100'
									leaveTo='opacity-0'
								>
									<div className='absolute top-0 right-0 -mr-12 pt-2'>
										<button
											type='button'
											className='ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
											onClick={() => switchSideBar()}
										>
											<span className='sr-only'>Close sidebar</span>
											<XMarkIcon
												className='h-6 w-6 text-white'
												aria-hidden='true'
											/>
										</button>
									</div>
								</Transition.Child>
								{branches && branches?.length !== 0 ? (
									<div className='flex px-3 py-4 items-center justify-start group-hover:w-60'>
										<ImageComponent
											className='flex flex-shrink-0 h-10 w-10 rounded-full overflow-hidden'
											src={business?.logo?.src ?? null}
											hash={business?.logo?.blurHash ?? null}
										/>
										<button
											className='inline-flex items-center flex-1 focus:outline-none w-full'
											onTouchEnd={() => setChangeBusinessModal(true)}
										>
											<h4 className='flex p-2 text-white w-full'>
												{business?.name}
											</h4>

											<ChevronRightIcon className='h-5 text-white' />
										</button>
									</div>
								) : (
									<div className='flex px-3 py-4 items-center justify-start group-hover:w-64'>
										<ImageComponent
											className='h-10 w-10 rounded-full overflow-hidden flex flex-shrink-0'
											src={business?.logo?.src ?? null}
											hash={business?.logo?.blurHash ?? null}
										/>
										<div className='inline-flex group-hover:flex-shrink-0 items-center w-full focus:outline-none'>
											<h4 className='flex ml-2 items-center text-white'>
												{business?.name}
											</h4>
										</div>
									</div>
								)}
								<div className='flex flex-1 flex-col overflow-y-auto overflow-x-visible scrollbar-thin'>
									<nav className='flex-1 space-y-1 px-2 py-4'>
										{navigation.map((item) =>
											item.children === undefined ? (
												<Link
													key={item.name}
													to={item.href ?? ''}
													className={classNames(
														item.current
															? 'bg-tecopay-900 text-white'
															: 'text-white hover:bg-tecopay-700 hover:text-white',
														'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
													)}
													onClick={() => switchSideBar()}
												>
													<item.icon
														className={classNames(
															item.current
																? 'text-white'
																: 'text-tecopay-400 group-hover:text-white',
															'mr-3 flex-shrink-0 h-6 w-6',
														)}
														aria-hidden='true'
													/>
													{item.name}
												</Link>
											) : (
												<Disclosure
													as='div'
													key={item.name}
													className='space-y-1'
												>
													{({ open }) => (
														<>
															<Disclosure.Button
																className={classNames(
																	item.current
																		? 'bg-tecopay-900 text-white'
																		: 'text-white hover:bg-tecopay-700 hover:text-white',
																	'group w-full flex items-center px-2 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500',
																)}
															>
																<item.icon
																	className='mr-3 h-6 w-6 flex-shrink-0 text-white group-hover:text-white'
																	aria-hidden='true'
																/>
																<span className='flex-1'>{item.name}</span>
																<svg
																	className={classNames(
																		open
																			? 'text-white rotate-90'
																			: 'text-white',
																		'ml-3 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-tecopay-400',
																	)}
																	viewBox='0 0 20 20'
																	aria-hidden='true'
																>
																	<path
																		d='M6 6L14 10L6 14V6Z'
																		fill='currentColor'
																	/>
																</svg>
															</Disclosure.Button>
															<Disclosure.Panel className='space-y-1'>
																{item.children &&
																	item.children.map((subItem) => (
																		<Disclosure.Button
																			key={subItem.name}
																			as={Link}
																			to={subItem.href ?? ''}
																			className='group flex w-full items-center rounded-md py-2 pl-11 pr-2 text-sm font-medium text-tecopay-600 hover:bg-tecopay-50 hover:text-tecopay-900'
																			onClickCapture={() => switchSideBar()}
																		>
																			{subItem.name}
																		</Disclosure.Button>
																	))}
															</Disclosure.Panel>
														</>
													)}
												</Disclosure>
											),
										)}
									</nav>
								</div>
							</Dialog.Panel>
						</Transition.Child>
						<div className='w-14 flex-shrink-0' aria-hidden='true'>
							{/* Dummy element to force sidebar to shrink to fit close icon */}
						</div>
					</div>
				</Dialog>
			</Transition.Root>

			{/* Static sidebar for desktop */}
			<div
				className={`hidden transition-all ease-in-out duration-200 group md:fixed md:inset-y-0 md:flex ${
					staticBar ? 'md:w-64' : 'md:w-20 hover:w-64 active:w-64'
				} md:flex-col md:pt-16 shadow-[25px_0_25px_-20px_#10101048] z-30 h-full`}
				onMouseLeave={() =>
					setDisclosure(navigation.findIndex((item) => item.current))
				}
			>
				{/* Sidebar component, swap this element with another sidebar if you like */}
				<div className='relative flex min-h-0 flex-1 flex-col bg-tecopay-800'>
					<div
						className={`flex flex-grow flex-col  scrollbar-thumb-tecopay-900 border-r border-tecopay-200 bg-tecopay-800 pt-1 pb-4 ${
							staticBar
								? 'pr-3 overflow-y-scroll scrollbar-thin'
								: 'group-hover:pr-3 group-hover:overflow-auto group-hover:scrollbar-thin'
						}`}
					>
						{branches && branches?.length !== 0 ? (
							<div
								className={`flex px-3 py-4 items-center justify-center ${
									staticBar
										? 'w-full'
										: 'group-hover:justify-start group-hover:w-full'
								}`}
							>
								<ImageComponent
									className='flex flex-shrink-0 h-10 w-10 rounded-full overflow-hidden'
									src={business?.logo?.src ?? null}
									hash={business?.logo?.blurHash ?? null}
								/>
								<button
									className={`${
										staticBar ? 'inline-flex' : 'hidden group-hover:inline-flex'
									} items-center flex-1 focus:outline-none w-full`}
									onClick={() => setChangeBusinessModal(true)}
								>
									<h4
										className={`${
											staticBar ? 'flex' : 'hidden group-hover:flex'
										} p-2 text-white w-full `}
									>
										{business?.name}
									</h4>

									<ChevronRightIcon className='h-5 text-white' />
								</button>
							</div>
						) : (
							<div
								className={`flex px-3 py-4 items-center justify-center ${
									staticBar
										? 'w-full'
										: 'group-hover:justify-start group-hover:w-64'
								}`}
							>
								<ImageComponent
									className='h-10 w-10 rounded-full overflow-hidden flex flex-shrink-0'
									src={business?.logo?.src ?? null}
									hash={business?.logo?.blurHash ?? null}
								/>
								<div
									className={`${
										staticBar
											? 'inline-flex'
											: 'hidden group-hover:inline-flex group-hover:flex-shrink-0'
									} items-center w-full focus:outline-none`}
								>
									<h4
										className={`${
											staticBar ? 'flex' : 'hidden group-hover:flex'
										} ml-2 items-center text-white`}
									>
										{business?.name}
									</h4>
								</div>
							</div>
						)}
						<div className='flex flex-grow flex-col'>
							<nav className='flex-1 space-y-1 px-2 py-2'>
								{navigation.map((item, idxMaster) =>
									item.children === undefined ? (
										<div key={item.name}>
											<Link
												to={item.href ?? ''}
												className={classNames(
													item.current
														? 'bg-tecopay-900 text-white'
														: 'text-white hover:bg-tecopay-700 hover:text-white',
													`relative group flex items-center ${
														staticBar
															? ''
															: 'justify-center group-hover:justify-start'
													} px-2 py-2 text-sm font-medium rounded-md`,
												)}
											>
												<item.icon
													className={classNames(
														item.current
															? 'text-white'
															: 'text-white group-hover:text-white',
														`${
															staticBar ? 'mr-3' : 'group-hover:mr-3'
														} flex-shrink-0 h-6 w-6`,
													)}
													aria-hidden='true'
												/>
												<span
													className={`${
														staticBar ? 'flex' : 'hidden group-hover:flex'
													} flex-shrink-0`}
												>
													{item.name}
												</span>
												{item.block && (
													<LockClosedIcon
														className={`${
															staticBar
																? 'absolute'
																: 'hidden group-hover:absolute'
														} h-4 right-2`}
													/>
												)}
											</Link>
										</div>
									) : (
										<Disclosure
											as='div'
											key={item.name}
											className='space-y-1'
											defaultOpen={true}
										>
											{({ open, close }) => {
												if (open && disclosure !== idxMaster) close();
												return (
													<>
														<Disclosure.Button
															className={classNames(
																item.current
																	? 'bg-tecopay-900 text-white'
																	: 'text-white hover:bg-tecopay-900 hover:text-white',
																`relative group w-full flex  items-center ${
																	staticBar
																		? ''
																		: 'items-center justify-center group-hover:justify-start'
																} px-2 py-2 text-left text-sm font-medium rounded-md focus:outline-none`,
															)}
															onClickCapture={() => setDisclosure(idxMaster)}
														>
															<item.icon
																className={classNames(
																	item.current
																		? 'text-white'
																		: 'text-white group-hover:text-white',
																	`${
																		staticBar ? 'mr-3' : 'group-hover:mr-3'
																	} flex-shrink-0 h-6 w-6 text-center`,
																)}
																aria-hidden='true'
															/>
															<span
																className={`${
																	staticBar
																		? 'flex'
																		: 'hidden group-hover:flex flex-shrink-0'
																}`}
															>
																{item.name}
															</span>
															<ChevronRightIcon
																className={classNames(
																	open ? 'text-white rotate-90' : 'text-white',
																	`h-4 w-4 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-white ${
																		staticBar ? '' : 'hidden group-hover:block'
																	} absolute right-1`,
																)}
															/>
														</Disclosure.Button>

														<Disclosure.Panel
															className={`${
																staticBar ? '' : 'hidden group-hover:block'
															} space-y-1 pl-4`}
														>
															{item.children &&
																item.children.map((subItem) => (
																	<Link
																		key={subItem.name}
																		to={subItem.href ?? ''}
																		className={classNames(
																			subItem.current
																				? 'bg-tecopay-600 text-white'
																				: 'text-white hover:bg-tecopay-700 hover:text-white',
																			'relative group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full',
																		)}
																	>
																		<span className='flex flex-shrink-0'>
																			{subItem.name}
																		</span>
																		{subItem.block && (
																			<LockClosedIcon className='h-4 absolute right-2' />
																		)}
																	</Link>
																))}
														</Disclosure.Panel>
													</>
												);
											}}
										</Disclosure>
									),
								)}
							</nav>

							<div className='flex justify-center items-center mt-16'>
								<BsPin
									className={`text-white hover:text-white cursor-pointer ${
										staticBar ? '' : 'rotate-90'
									}`}
									onClick={() => dispatch(changeStaticBar())}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/**Ctrol Sidebar Button */}
			{!barState && (
				<button
					type='button'
					className='absolute top-16 z-50 py-2 px-4 mt-2 text-tecopay-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-tecopay-500 md:hidden'
					onClick={() => switchSideBar()}
				>
					<span className='sr-only'>Open sidebar</span>
					<Bars3Icon className='h-6 w-6' aria-hidden='true' />
				</button>
			)}
		</>
	);
};

export default SideBar;

import { useEffect, useState } from 'react';
import TabNav from '../../../components/navigation/TabNav';

import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';
import Breadcrumb, {
	PathInterface,
} from '../../../components/navigation/Breadcrumb';
import {
	PencilSquareIcon,
	RectangleGroupIcon,
	UserCircleIcon,
} from '@heroicons/react/24/outline';
import SideNav from '../../../components/navigation/SideNav';
import SelectedAccountDetails from './SelectedAccountDetails';
import useServerAccounts from '../../../api/userServerAccounts';
import Button from '../../../components/misc/Button';
import Modal from '../../../components/modals/GenericModal';
import EditAccountContainer from '../editAccountWizzard/EditAccountContainer';
import AssociatedCards from './AssociatedCards/AssociatedCards';
import useServerCards from '../../../api/userServerCards';

const AccountDetails = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const {
		getAccount,
		isLoading,
		account,
		isFetching,
		editAccount,
		allAccounts,
		selectedDataToParent,
		deleteAccount,
		getAllAccounts,
	} = useServerAccounts();

	const { getAllCards, paginate, allCards } = useServerCards();
	//TabNav ------------------------------------------------------------

	const [current, setCurrent] = useState<string>('detalles');
	const changeTab = (to: string) => setCurrent(to);
	const [editModal, setEditModal] = useState(false);

	const id = useAppSelector((state) => state.account.id);

	//const account: any = useAppSelector((state) => state.account.items);

	useEffect(() => {
		getAccount(id);
		getAllCards({ accountId: id });
	}, []);

	const showEditModal = () => {
		setEditModal(!editModal);
	};

	const stockTabs = [
		{
			name: 'Detalles',
			href: 'detalles',
			current: current === 'detalles',
		},
		{
			name: 'Tarjetas',
			href: 'cards',
			current: current === 'cards',
		},
		{
			name: 'Registros',
			href: 'registros',
			current: current === 'registros',
		},
		{
			name: 'Operaciones',
			href: 'operaciones',
			current: current === 'operaciones',
		},
	];

	//-----------------------------------------------------------------------------------

	//Breadcrumb --------------------------------------------------------------------------
	const paths: PathInterface[] = [
		{
			name: 'Cuentas',
			action: () => navigate('/accounts'),
		},

		{
			name: account?.owner?.fullName,
		},
	];
	//--------------------------------------------------------------------------------------

	return (
		<>
			<div className=' flex'>
				<Breadcrumb
					icon={<UserCircleIcon className='h-7 text-gray-500' />}
					paths={paths}
				/>
				<div className='absolute right-9 mt-1 h-7 px-2'>
					<Button
						name='Editar'
						icon={<PencilSquareIcon className=' text-white w-5' />}
						color='slate-600'
						type='button'
						action={() => showEditModal()}
						loading={isFetching}
						disabled={isFetching}
					/>
				</div>
			</div>
			<div className='sm:grid grid-cols-10 gap-3'>
				<SideNav
					tabs={stockTabs}
					action={changeTab}
					className='col-span-10 sm:col-span-2'
				/>

				<div className='sm:col-span-8 pl-3 pt-1'>
					{current === 'detalles' && (
						<SelectedAccountDetails
							isLoading={isLoading}
							id={id}
							account={account}
						/>
					)}
					{current === 'cards' && (
						<AssociatedCards paginate={paginate} allCards={allCards} />
					)}
				</div>
			</div>
			{editModal && (
				<Modal state={editModal} close={close} size='m'>
					<EditAccountContainer
						allAccounts={allAccounts}
						deleteAccount={deleteAccount}
						isLoading={isLoading}
						account={account}
						getAccount={getAccount}
						id={id}
						editAccount={editAccount}
						isFetching={isFetching}
						closeModal={close}
					/>
				</Modal>
			)}
		</>
	);
};

export default AccountDetails;

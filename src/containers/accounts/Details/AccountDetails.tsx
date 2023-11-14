import { useEffect, useState } from 'react';
import TabNav from '../../../components/navigation/TabNav';

import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';
import Breadcrumb, {
	PathInterface,
} from '../../../components/navigation/Breadcrumb';
import {
	RectangleGroupIcon,
	UserCircleIcon,
} from '@heroicons/react/24/outline';
import SideNav from '../../../components/navigation/SideNav';
import SelectedAccountDetails from './SelectedAccountDetails';
import useServerAccounts from '../../../api/userServerAccounts';

const AssociatedCards = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { getAccount, isLoading, account } = useServerAccounts();
	//TabNav ------------------------------------------------------------

	const [current, setCurrent] = useState<string>('detalles');
	const changeTab = (to: string) => setCurrent(to);

	const id = useAppSelector((state) => state.account.id);

	//const account: any = useAppSelector((state) => state.account.items);

	useEffect(() => {
		getAccount(id);
	}, []);

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
			name: 'Osvaldo',
		},
	];
	//--------------------------------------------------------------------------------------

	return (
		<>
			<Breadcrumb
				icon={<UserCircleIcon className='h-7 text-gray-500' />}
				paths={paths}
			/>
			<div className='sm:grid grid-cols-10 gap-3'>
				<SideNav
					tabs={stockTabs}
					action={changeTab}
					className='col-span-10 sm:col-span-2'
				/>

				<div className='sm:col-span-8 pl-3 pt-1'>
					{current === 'detalles' && (
						<SelectedAccountDetails
							getAccount={getAccount}
							isLoading={isLoading}
							id={id}
							account={account}
						/>
					)}
					{/*current === 'opperations' && < />*/}
				</div>
			</div>
		</>
	);
};

export default AssociatedCards;

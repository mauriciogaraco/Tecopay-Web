import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb, {
	PathInterface,
} from '../../../components/navigation/Breadcrumb';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import SideNav from '../../../components/navigation/SideNav';
import AssociatedCards from './AssociatedCards/AssociatedCards';
import AssociatedOperations from './AssociatedOperations/AssociatedOperations';
import AccountDetail from './AccountDetails/AccountDetails';

const AccountDetails = () => {

	const navigate = useNavigate();
	const [current, setCurrent] = useState<string>('details');
	const changeTab = (to: string) => setCurrent(to);

	const stockTabs = [
		{
			name: 'Información',
			href: 'details',
			current: current === 'details',
		},
		{
			name: 'Tarjetas asociadas',
			href: 'cards',
			current: current === 'cards',
		},
		{
			name: 'Operaciones',
			href: 'operations',
			current: current === 'operations',
		},
	];

	//Breadcrumb --------------------------------------------------------------------------
	
	const paths: PathInterface[] = [
		{
			name: 'Cuentas',
			action: () => navigate('/accounts'),
		},

		{
			name: 'Detalles',
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
			</div>
			<div className='sm:grid grid-cols-10 gap-3'>
				<SideNav
					tabs={stockTabs}
					action={changeTab}
					className='col-span-10 sm:col-span-2'
				/>

				<div className='sm:col-span-8 pl-3 pt-1'>
					{current === 'details' && (
						<AccountDetail />
					)}
					{current === 'cards' && (
						<AssociatedCards />
					)}
					{current === 'operations' && (
						<AssociatedOperations />
					)}
				</div>
			</div>
		</>
	);
};

export default AccountDetails;

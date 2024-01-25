import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';
import Breadcrumb, {
	PathInterface,
} from '../../../components/navigation/Breadcrumb';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import SideNav from '../../../components/navigation/SideNav';
import SelectedAccountDetails from './SelectedAccountDetails';
import useServerAccounts from '../../../api/userServerAccounts';
import AssociatedCards from './AssociatedCards/AssociatedCards';
import useServerCards from '../../../api/userServerCards';
import AssociatedOperations from './AssociatedOperations/AssociatedOperations';
import { formatCardNumber } from '../../../utils/helpers';

const AccountDetails = () => {
	const navigate = useNavigate();
	const {
		getAccount,
		isLoading,
		account,
		isFetching,
		editAccount,
		deleteAccount,
		getAccountRecords,
		getAccountOperations,
		operations,
		Charge,
		Transfer,
	} = useServerAccounts();

	const { getAllCards, paginate, allCards } = useServerCards();
	const [current, setCurrent] = useState<string>('details');
	const changeTab = (to: string) => setCurrent(to);


	const id = useAppSelector((state) => state.account.id);


	useEffect(() => {
		getAccount(id);
		getAllCards({ accountId: id });
		getAccountRecords(id);
		getAccountOperations(id);
	}, []);
	console.log(id)
	
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
			name: formatCardNumber(account?.address ?? '-'),
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
						<SelectedAccountDetails
							isFetching={isFetching}
							charge={Charge}
							transfer={Transfer}
							isLoading={isLoading}
							account={account}
							deleteAccount={deleteAccount}
						editAccount={editAccount}
						/>
					)}
					{current === 'cards' && (
						<AssociatedCards paginate={paginate} allCards={allCards} />
					)}
					{current === 'operations' && (
						<AssociatedOperations paginate={paginate} operations={operations} />
					)}
				</div>
			</div>
		</>
	);
};

export default AccountDetails;

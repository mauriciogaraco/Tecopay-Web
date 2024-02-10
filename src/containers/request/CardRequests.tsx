import Breadcrumb, {
	PathInterface,
} from '../../components/navigation/Breadcrumb';
import { useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import SideNav from '../../components/navigation/SideNav';
import RequestStatus from './cardRequestTabs/RequestStatus';
import AcceptedStatus from './cardRequestTabs/AcceptedStatus';
import DeniedStatus from './cardRequestTabs/DeniedStatus';
import PrintedStatus from './cardRequestTabs/PrintedStatus';

const CardRequests = () => {

	//Breadcrumb-----------------------------------------------------------------------------------

	const paths: PathInterface[] = [
		{
			name: ' Solicitudes',
		},
	];

	const [current, setCurrent] = useState<string>('solicitadas');
	const changeTab = (to: string) => setCurrent(to);

	const stockTabs = [
		{
			name: 'Solicitadas',
			href: 'solicitadas',
			current: current === 'solicitadas',
		},
		{
			name: 'Aceptadas',
			href: 'aceptadas',
			current: current === 'aceptadas',
		},
		{
			name: 'Impresas',
			href: 'impresas',
			current: current === 'impresas',
		},
		{
			name: 'Canceladas',
			href: 'canceladas',
			current: current === 'canceladas',
		},
	];

	//Breadcrumb --------------------------------------------------------------------------

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
					{current === 'solicitadas' && (
						<RequestStatus />
					)}
					{current === 'aceptadas' && (
						<AcceptedStatus />
					)}
					{current === 'impresas' && (
						<PrintedStatus />
					)}
					{current === 'canceladas' && (
						<DeniedStatus />
					)}
				</div>
			</div>
		</>
	);

};

export default CardRequests;
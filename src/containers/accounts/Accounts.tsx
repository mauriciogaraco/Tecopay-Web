import { PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import GenericTable, {
	type DataTableInterface,
} from '../../components/misc/GenericTable';
import useServerAccounts from '../../api/userServerAccounts';
import Paginate from '../../components/misc/Paginate';
import Modal from '../../components/modals/GenericModal';
import Breadcrumb, {
	type PathInterface,
} from '../../components/navigation/Breadcrumb';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import BlockedStateForTable from '../../components/misc/BlockedStateForTable';
import StateSpanForTable from '../../components/misc/StateSpanForTable';
import { saveAccountId } from '../../store/slices/accountSlice';
import { useNavigate } from 'react-router-dom';
import NewAccountModal from './NewAccount/NewAccountModal';
import { formatCardNumber } from '../../utils/helpers';

const Accounts = () => {
	const {
		paginate,
		isLoading,
		allAccounts,
		getAllAccounts,
		addAccount,
	} = useServerAccounts();

	const [addAccountModal, setAddAccountModal] = useState(false);
	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	useEffect(() => {
		getAllAccounts(filter);
	}, [filter]);

	// Breadcrumb-----------------------------------------------------------------------------------

	const paths: PathInterface[] = [
		{
			name: 'Cuentas',
		},
	];

	// Data for table ------------------------------------------------------------------------------

	const tableTitles = [
		'Fecha de Activación',
		'Número de Cuenta',
		'Propietario',
		'Entidad',
		'Negocio',
		'',
	];

	const tableData: DataTableInterface[] = [];
	console.log(allAccounts);
	allAccounts?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'No.': item.id,
				'Número de Cuenta': `${formatCardNumber(item?.address)}`,
				'Propietario': item?.owner?.fullName,
				'Entidad': item?.issueEntity?.name,
				'Negocio': ''
			},
		});
	});

	
	const actions = [
		{
			icon: <PlusIcon className='h-5' />,
			title: 'Agregar cuenta',
			action: () => {
				setAddAccountModal(true);
			},
		},
	];

	const rowAction = (id: number) => {
		dispatch(saveAccountId(id));
		navigate('details');
	};

	
	const closeAddAccount = () => {
		setAddAccountModal(false);
	};


	return (
		<div>
			<Breadcrumb
				icon={<UserCircleIcon className='h-6 text-gray-500' />}
				paths={paths}
			/>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={isLoading}
				actions={actions}
				rowAction={rowAction}
				// filterComponent={{ availableFilters, filterAction }}
				paginateComponent={
					<Paginate
						action={(page: number) => {
							setFilter({ ...filter, page });
						}}
						data={paginate}
					/>
				}
			/>

			{addAccountModal && (
				<Modal state={addAccountModal} close={setAddAccountModal}>
					<NewAccountModal
						close={closeAddAccount}
						isLoading={isLoading}
						addAccount={addAccount}
					/>
				</Modal>
			)}
		</div>
	);
};

export default Accounts;

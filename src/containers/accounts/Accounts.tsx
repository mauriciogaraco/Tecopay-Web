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

	const [addTicketmodal, setAddTicketmodal] = useState(false);
	const [nuevoTicketModal, setNuevoTicketModal] = useState(false);
	const [contactModal, setContactModal] = useState(false);
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
		'Código',
		'Nombre del Propietario',
		'Entidad',
		'Moneda',
		'',
	];

	const tableData: DataTableInterface[] = [];

	allAccounts?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'No.': item.id,
				Código: `${formatCardNumber(item?.address)}`,
				'Nombre del Propietario': item.owner?.fullName,
				Entidad: item?.issueEntity?.name,

				Moneda: item.currency ?? '-',
				'': (
					<span className='flex whitespace-nowrap gap-4'>
						<BlockedStateForTable currentState={item.isBlocked} />
						<StateSpanForTable
							currentState={item?.isActive}
							greenState='Activa'
							redState='Inactiva'
						/>
					</span>
				),
			},
		});
	});

	

	const actions = [
		{
			icon: <PlusIcon className='h-5' />,
			title: 'Agregar cuenta',
			action: () => {
				setAddTicketmodal(true);
			},
		},
	];

	const rowAction = (id: number) => {
		dispatch(saveAccountId(id));
		navigate('details');
	};

	
	const closeAddAccount = () => {
		setAddTicketmodal(false);
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

			{addTicketmodal && (
				<Modal state={addTicketmodal} close={setAddTicketmodal}>
					<NewAccountModal
						setContactModal={setContactModal}
						close={closeAddAccount}
						contactModal={contactModal}
						setNuevoTicketModal={setNuevoTicketModal}
						nuevoTicketModal={nuevoTicketModal}
						isLoading={isLoading}
						addAccount={addAccount}
					/>
				</Modal>
			)}
		</div>
	);
};

export default Accounts;

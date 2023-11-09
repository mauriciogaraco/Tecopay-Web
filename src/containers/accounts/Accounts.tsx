import {
	PlusIcon,
	TicketIcon,
	UsersIcon,
	UserCircleIcon,
} from '@heroicons/react/24/outline';

import GenericTable, {
	type DataTableInterface,
	type FilterOpts,
} from '../../components/misc/GenericTable';
import useServerAccounts from '../../api/userServerAccounts';

import Paginate from '../../components/misc/Paginate';
import Modal from '../../components/modals/GenericModal';
import Breadcrumb, {
	type PathInterface,
} from '../../components/navigation/Breadcrumb';
import {
	BasicType,
	type SelectInterface,
} from '../../interfaces/InterfacesLocal';

import { useEffect, useState } from 'react';
import NewAccountModal from './NewAccount/NewAccountModal';
import { data } from '../../utils/TemporaryArrayData';
import { useAppSelector } from '../../store/hooks';
import EditAccountContainer from './editAccountWizzard/EditUserContainer';
import BlockedStateForTable from '../../components/misc/BlockedStateForTable';
import StateSpanForTable from '../../components/misc/StateSpanForTable';

const Accounts = () => {
	const [query, setQuery] = useState<string>('');
	const [queryText, setQueryText] = useState('');
	const [post, setPost] = useState(null);

	const {
		paginate,
		isLoading,
		isFetching,
		waiting,
		modalWaiting,
		allAccounts,
		account,
		getAllAccounts,
		addAccount,
		getAccount,
		editAccount,
		deleteAccount,
		setAllAccounts,
		manageErrors,
		modalWaitingError,
	} = useServerAccounts();

	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});
	const [addTicketmodal, setAddTicketmodal] = useState(false);
	// const [exportModal, setExportModal] = useState(false);

	/* useEffect(() => {
			  getAllClients(filter);
			}, [filter]); */

	// Data for table ------------------------------------------------------------------------
	const tableTitles = [
		'Codigo',
		'Nombre',
		'Entidad',
		'Propietario',
		'Moneda',
		'Direccion',
		'Estado',
		'Actividad',
	];
	const tableData: DataTableInterface[] = [];
	// eslint-disable-next-line array-callback-return

	allAccounts?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'No.': item.id,
				Codigo: `${item?.code}`,
				Nombre: item?.name,
				Entidad: item?.issueEntity?.name,
				Propietario: item.owner?.fullName,
				Moneda: item.currency?.code,
				Direccion: item.address,
				Estado: <BlockedStateForTable currentState={item.isBlocked} />,
				Actividad: (
					<StateSpanForTable
						currentState={item?.isActive}
						greenState='Activa'
						redState='Inactiva'
					/>
				),
			},
		});
	});

	const searching = {
		action: (search: string) => {
			setFilter({ ...filter, search });
		},
		placeholder: 'Buscar ticket',
	};
	const close = () => {
		setEditTicketModal({ state: false, id: null });
	};
	const actions = [
		{
			icon: <PlusIcon className='h-5' />,
			title: 'Agregar cuenta',
			action: () => {
				setAddTicketmodal(true);
			},
		},
		/* {
				title: "Exportar a excel",
				action: () => setExportModal(true),
				icon: <BsFiletypeXlsx />,
			  }, */
	];

	const rowAction = (id: number) => {
		setEditTicketModal({ state: true, id });
	};

	// Breadcrumb-----------------------------------------------------------------------------------
	const paths: PathInterface[] = [
		{
			name: 'Cuentas',
		},
	];
	// ------------------------------------------------------------------------------------
	const [nuevoTicketModal, setNuevoTicketModal] = useState(false);
	const [contactModal, setContactModal] = useState(false);
	const [editTicketModal, setEditTicketModal] = useState<{
		state: boolean;
		id: number | null;
	}>({ state: false, id: null });

	const closeAddAccount = () => {
		setAddTicketmodal(false);
	};

	useEffect(() => {
		getAllAccounts(filter);
	}, [filter]);

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
				searching={searching}
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
					/>
				</Modal>
			)}
			{editTicketModal.state && (
				<Modal state={editTicketModal.state} close={close} size='m'>
					<EditAccountContainer
						deleteAccount={deleteAccount}
						isLoading={isLoading}
						account={account}
						getAccount={getAccount}
						id={editTicketModal.id}
						editAccount={editAccount}
						isFetching={isFetching}
						closeModal={close}
					/>
				</Modal>
			)}
		</div>
	);
};

export default Accounts;

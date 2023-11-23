import {
	PlusIcon,
	CreditCardIcon,
	LockOpenIcon,
} from '@heroicons/react/24/outline';

import GenericTable, {
	DataTableInterface,
	FilterOpts,
} from '../../components/misc/GenericTable';

import Paginate from '../../components/misc/Paginate';
import Modal from '../../components/modals/GenericModal';
import Breadcrumb, {
	PathInterface,
} from '../../components/navigation/Breadcrumb';

import { BasicType, SelectInterface } from '../../interfaces/InterfacesLocal';

import { useEffect, useState } from 'react';
import NuevoTicketModal from '../accounts/NewAccount/NewAccountModal';

import { useAppSelector } from '../../store/hooks';
import useServerCards from '../../api/userServerCards';
import { formatCalendar } from '../../utils/helpers';
import EditCardContainer from './editCardRequestWizzard/EditCardRequestContainer';
import StateSpanForTable from '../../components/misc/StateSpanForTable';
import BlockedStateForTable from '../../components/misc/BlockedStateForTable';
import useServerCardsRequests from '../../api/userServerCardsRequests';
import CreatedStateForTable from '../../components/misc/CreatedStateForTable';
import NewCardRequestModal from './newCardRequest/NewCardRequestModal';
import EditCardRequestContainer from './editCardRequestWizzard/EditCardRequestContainer';
import StatusForCardRequest from '../../components/misc/StatusForCardRequest';

const CardRequests = () => {
	const [query, setQuery] = useState<string>('');
	const [post, setPost] = useState(null);

	const {
		paginate,
		isLoading,
		isFetching,
		waiting,
		modalWaiting,
		cardRequest,
		getAllCardsRequests,
		addCardRequest,
		getCardRequest,
		editCardRequest,
		deleteCardRequest,
		manageErrors,
		modalWaitingError,
		allCardsRequests,
		setAllCardsRequests,
		setSelectedDataToParent,
	} = useServerCardsRequests();

	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});
	const [addTicketmodal, setAddTicketmodal] = useState(false);

	//Data for table ------------------------------------------------------------------------
	const tableTitles = [
		'No. Solicitud',
		'Tipo',

		'Propietario',
		'Moneda',
		'Cuenta',
		'Estado',
	];
	const tableData: DataTableInterface[] = [];

	allCardsRequests?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'No. Solicitud': item?.queryNumber ?? '-',
				Tipo: item?.priority,
				Propietario: item?.holderName,
				Moneda: 'No Existe',
				Cuenta: item?.account ?? '-',

				Estado: <StatusForCardRequest currentState={item.status} />,
			},
		});
	});

	const searching = {
		action: (search: string) => setFilter({ ...filter, search }),
		placeholder: 'Buscar Solicitud',
	};
	const close = () => setEditTicketModal({ state: false, id: null });
	const actions = [
		{
			icon: <PlusIcon className='h-5' />,
			title: 'Agregar Solicitud',
			action: () => setAddTicketmodal(true),
		},
	];

	const rowAction = (id: number) => {
		setEditTicketModal({ state: true, id });
	};

	//Breadcrumb-----------------------------------------------------------------------------------
	const paths: PathInterface[] = [
		{
			name: 'Tarjetas',
		},
		{
			name: ' Solicitudes',
		},
	];
	//------------------------------------------------------------------------------------
	const [nuevoTicketModal, setNuevoTicketModal] = useState(false);
	const [contactModal, setContactModal] = useState(false);
	const [editTicketModal, setEditTicketModal] = useState<{
		state: boolean;
		id: number | null;
	}>({ state: false, id: null });

	const closeAddAccount = () => setAddTicketmodal(false);

	useEffect(() => {
		getAllCardsRequests(filter);
	}, [filter]);

	return (
		<div className=''>
			<Breadcrumb
				icon={<CreditCardIcon className='h-6 text-gray-500' />}
				paths={paths}
			/>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={isLoading}
				searching={searching}
				actions={actions}
				rowAction={rowAction}
				//filterComponent={{ availableFilters, filterAction }}
				paginateComponent={
					<Paginate
						action={(page: number) => setFilter({ ...filter, page })}
						data={paginate}
					/>
				}
			/>

			{addTicketmodal && (
				<Modal state={addTicketmodal} close={setAddTicketmodal}>
					<NewCardRequestModal
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
					<EditCardRequestContainer
						id={editTicketModal.id}
						editCardRequest={editCardRequest}
						deleteCardRequest={deleteCardRequest}
						isFetching={isFetching}
						closeModal={close}
						allCardsRequests={allCardsRequests}
						cardRequest={cardRequest}
						isLoading={isLoading}
						getCardRequest={getCardRequest}
						setSelectedDataToParent={setSelectedDataToParent}
					/>
				</Modal>
			)}
		</div>
	);
};

export default CardRequests;

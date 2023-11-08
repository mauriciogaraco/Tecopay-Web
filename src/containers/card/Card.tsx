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
import EditCardContainer from './editCardWizzard/EditCardContainer';
import StateSpanForTable from '../../components/misc/StateSpanForTable';
import BlockedStateForTable from '../../components/misc/BlockedStateForTable';

const Card = () => {
	const [query, setQuery] = useState<string>('');
	const [post, setPost] = useState(null);

	const {
		paginate,
		isLoading,
		isFetching,
		card,
		allCards,
		getAllCards,
		addCard,
		getCard,
		editCard,
		deleteCard,
		setSelectedDataToParent,
	} = useServerCards();

	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});
	const [addTicketmodal, setAddTicketmodal] = useState(false);

	//Data for table ------------------------------------------------------------------------
	const tableTitles = [
		'id',
		'Expiracion',
		'Propietario',
		'Moneda',
		'Direccion',
		'Descripcion',
		'Estado',
	];
	const tableData: DataTableInterface[] = [];
	// eslint-disable-next-line array-callback-return

	//const items = useAppSelector((state) => state.cards.Cards);

	// @ts-ignore
	allCards?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				id: item.id,
				Codigo: `${item?.code}`,
				Expiracion: formatCalendar(item?.expiratedAt),
				Propietario: item.holder?.fullName,
				Moneda: item.currency?.code,
				Descripcion: item.description,
				Direccion: item.address,
				Estado: <BlockedStateForTable currentState={item.isBlocked} />,
			},
		});
	});

	const searching = {
		action: (search: string) => setFilter({ ...filter, search }),
		placeholder: 'Buscar ticket',
	};
	const close = () => setEditTicketModal({ state: false, id: null });
	const actions = [
		{
			icon: <PlusIcon className='h-5' />,
			title: 'Agregar tarjeta',
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
		getAllCards(filter);
	}, [filter]);

	return (
		<div>
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
					<NuevoTicketModal
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
					<EditCardContainer
						id={editTicketModal.id}
						editCard={editCard}
						deleteCard={deleteCard}
						isFetching={isFetching}
						closeModal={close}
						allCards={allCards}
						card={card}
						isLoading={isLoading}
						getCard={getCard}
						setSelectedDataToParent={setSelectedDataToParent}
					/>
				</Modal>
			)}
		</div>
	);
};

export default Card;

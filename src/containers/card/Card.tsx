import {
	PlusIcon,
	CreditCardIcon,
	LockOpenIcon,
	TruckIcon,
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

import { useAppSelector } from '../../store/hooks';
import useServerCards from '../../api/userServerCards';
import { formatCalendar, formatCardNumber } from '../../utils/helpers';

import BlockedStateForTable from '../../components/misc/BlockedStateForTable';
import EditCardContainer from './editCardWizzard/EditCardContainer';
import StatusForCardRequest from '../../components/misc/StatusForCardRequest';

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
		deliverCard,
	} = useServerCards();

	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});
	const [addTicketmodal, setAddTicketmodal] = useState(false);

	//Data for table ------------------------------------------------------------------------
	const tableTitles = [
		'No. Tarjeta',
		'No. Cuenta',
		'Titular',
		'Categoría',
		'Entidad',
		'Estado',
	];
	const tableData: DataTableInterface[] = [];
	// eslint-disable-next-line array-callback-return
	console.log(allCards);
	//const items = useAppSelector((state) => state.cards.Cards);

	// @ts-ignore
	allCards?.items?.map((item: any) => {
		tableData.push({
			rowId: item?.id,
			payload: {
				'No. Tarjeta': formatCardNumber(item?.address),
				'No. Cuenta': formatCardNumber(item?.account?.address),
				'Titular': item?.holderName ?? '-',
				'Categoría': item?.category?.name ?? '-',
				'Entidad': item?.account.currency,
				'Estado': <StatusForCardRequest currentState={item.request.status} />,
			},
		});
	});

	const close = () => setEditTicketModal({ state: false, id: null });

	const rowAction = (id: number) => {
		setEditTicketModal({ state: true, id });
	};

	//Breadcrumb-----------------------------------------------------------------------------------
	const paths: PathInterface[] = [
		{
			name: 'Tarjetas',
		},
		{
			name: 'Todas',
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
		<div className=''>
			<Breadcrumb icon={<CreditCardIcon className='h-6' />} paths={paths} />
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={isLoading}
				rowAction={rowAction}
				//filterComponent={{ availableFilters, filterAction }}
				paginateComponent={
					<Paginate
						action={(page: number) => setFilter({ ...filter, page })}
						data={paginate}
					/>
				}
			/>

			{editTicketModal.state && (
				<Modal state={editTicketModal.state} close={close} size='m'>
					<EditCardContainer
						deliverCard={deliverCard}
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

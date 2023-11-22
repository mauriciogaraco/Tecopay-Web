import { PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';

import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import GenericTable, {
	DataTableInterface,
} from '../../../../components/misc/GenericTable';
import Paginate from '../../../../components/misc/Paginate';
import { useSelector } from 'react-redux';
import { useAppSelector } from '../../../../store/hooks';
import useServerCards from '../../../../api/userServerCards';
import StateSpanForTable from '../../../../components/misc/StateSpanForTable';
import BlockedStateForTable from '../../../../components/misc/BlockedStateForTable';
import { formatCalendar } from '../../../../utils/helpers';
import { json } from 'stream/consumers';

const AssociatedCards = (allCards: any, paginate: any) => {
	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});
	const [tableData, setTableData] = useState<DataTableInterface[]>([]);

	const [addTicketmodal, setAddTicketmodal] = useState(false);
	const [loadedPaginate, setLoadedPaginate] = useState(null);
	// const [exportModal, setExportModal] = useState(false);

	// Data for table ------------------------------------------------------------------------
	const tableTitles = [
		'No. Tarjeta',
		'Nombre',
		'Propietario',
		'Moneda',
		'Fecha de Expiración',
	];

	const cardMapping = async () => {
		const loadedAllCards = await allCards;

		setLoadedPaginate(loadedAllCards.paginate);
		const items = loadedAllCards.allCards;

		items.map((item: any) => {
			setTableData((prevTableData) => [
				...prevTableData,
				{
					rowId: item.id,
					payload: {
						'No. Tarjeta': item.address,
						Nombre: item?.holderName ?? '-',
						Propietario: item.owner?.fullName,
						Moneda: item.currency ?? '-',
						'Fecha de Expiración': formatCalendar(item?.expiratedAt),
						'': (
							<span className='flex whitespace-nowrap gap-4'>
								<BlockedStateForTable currentState={item.isBlocked} />
							</span>
						),
					},
				},
			]);
		});
	};

	useEffect(() => {
		cardMapping();
	}, []);

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
	];

	const rowAction = (id: number) => {
		setEditTicketModal({ state: true, id });
	};
	const [nuevoTicketModal, setNuevoTicketModal] = useState(false);
	const [contactModal, setContactModal] = useState(false);
	const [editTicketModal, setEditTicketModal] = useState<{
		state: boolean;
		id: number | null;
	}>({ state: false, id: null });

	const closeAddAccount = () => {
		setAddTicketmodal(false);
	};

	const id = useAppSelector((state) => state.account.id);

	return tableData ? (
		<div>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				searching={searching}
				actions={actions}
				rowAction={rowAction}
				// filterComponent={{ availableFilters, filterAction }}
				paginateComponent={
					<Paginate
						action={(page: number) => {
							setFilter({ ...filter, page });
						}}
						data={loadedPaginate}
					/>
				}
			/>
		</div>
	) : (
		<div>loading</div>
	);
};

export default AssociatedCards;

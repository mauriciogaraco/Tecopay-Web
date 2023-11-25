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
import { formatDate } from '../../../../utils/helpersAdmin';

const AssociatedRecords = (records: any, paginate: any) => {
	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});
	const [tableData, setTableData] = useState<DataTableInterface[]>([]);

	const [addAssociatedCard, setAddAssociatedCard] = useState(false);
	const [loadedPaginate, setLoadedPaginate] = useState(null);
	// const [exportModal, setExportModal] = useState(false);

	// Data for table ------------------------------------------------------------------------
	const tableTitles = [
		'Fecha',
		'Nombre',
		'Acción',
		'Detalles',
		'Observaciones',
	];

	const recordMapping = async () => {
		const loadedAllCards = await records;

		setLoadedPaginate(loadedAllCards.paginate);
		const items = loadedAllCards.records;

		items.map((item: any) => {
			setTableData((prevTableData) => [
				...prevTableData,
				{
					rowId: item.id,
					payload: {
						Fecha: formatDate(item?.createdAt),
						Nombre: item?.title ?? '-',
						Acción: item?.action,
						Detalles: item?.details ?? '-',
						Observaciones: item?.observations ?? '-',
					},
				},
			]);
		});
	};

	useEffect(() => {
		recordMapping();
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
			title: 'Agregar tarjeta',
			action: () => {
				setAddAssociatedCard(true);
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
		setAddAssociatedCard(false);
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
				//paginateComponent={
				//	<Paginate
				//		action={(page: number) => {
				//			setFilter({ ...filter, page });
				//		}}
				//		data={loadedPaginate}
				//	/>
				//}
			/>
		</div>
	) : (
		<div>loading</div>
	);
};

export default AssociatedRecords;

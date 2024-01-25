import {
	PlusIcon,
	CreditCardIcon,
} from '@heroicons/react/24/outline';
import GenericTable, {
	DataTableInterface,
} from '../../components/misc/GenericTable';
import Paginate from '../../components/misc/Paginate';
import Modal from '../../components/modals/GenericModal';
import Breadcrumb, {
	PathInterface,
} from '../../components/navigation/Breadcrumb';
import { useEffect, useState } from 'react';
import useServerCardsRequests from '../../api/userServerCardsRequests';
import NewCardRequestModal from './newCardRequest/NewCardRequestModal';
import StatusForCardRequest from '../../components/misc/StatusForCardRequest';
import { translateCardRequestType } from '../../utils/translateCardStatus';
import { formatDate } from '../../utils/helpersAdmin';
import ModalCardRequest from './CardRequestModal/ModalCardRequest'

const CardRequests = () => {

	const CRUD = useServerCardsRequests();

	const [filter, setFilter] = useState<Record<string, string | number | boolean | null>>({ page: 1 });
	const [newCardRequestModal, setNewCardRequestModal] = useState(false);
	const [editCardRequestModal, setEditCardRequestModal] = useState<{
		state: boolean;
		id: number;
	}>({ state: false, id: 0 });

	useEffect(() => {
		CRUD.getAllCardsRequests(filter);
	}, [filter]);

	//Breadcrumb-----------------------------------------------------------------------------------

	const paths: PathInterface[] = [
		{
			name: 'Tarjetas',
		},
		{
			name: ' Solicitudes',
		},
	];

	//Data for table ------------------------------------------------------------------------------

	const tableTitles = [
		'No. Solicitud',
		'Fecha de Solicitud',
		'Titular',
		'Categoria',
		'Entidad',
		'Tipo',
		'Cuenta',
		'Estado',
	];

	const tableData: DataTableInterface[] = [];
	console.log(CRUD?.allCardsRequests);
	CRUD?.allCardsRequests?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'No. Solicitud': item?.queryNumber ?? '-',
				'Entidad': item?.issueEntityIdName ? item?.issueEntityIdName : '',
				'Fecha de Solicitud': formatDate(item?.createdAt) ?? '-',
				'Tipo': translateCardRequestType(item?.priority),
				'Titular': item?.holderName ?? '-',
				'Cuenta': item?.account ?? '-',
				'Estado': <StatusForCardRequest currentState={item.status} />,
			},
		});
	});

	const searching = {
		action: (search: string) => setFilter({ ...filter, search }),
		placeholder: 'Buscar Solicitud',
	};

	const actions = [
		{
			icon: <PlusIcon className='h-5' />,
			title: 'Agregar Solicitud',
			action: () => setNewCardRequestModal(true),
		},
	];

	const closeAddAccount = () => setNewCardRequestModal(false);

	const rowAction = (id: number) => {
		setEditCardRequestModal({ state: true, id });
	};

	return (
		<div className=''>
			<Breadcrumb
				icon={<CreditCardIcon className='h-6 text-gray-500' />}
				paths={paths}
			/>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={CRUD?.isLoading}
				searching={searching}
				actions={actions}
				rowAction={rowAction}
				paginateComponent={
					<Paginate
						action={(page: number) => setFilter({ ...filter, page })}
						data={CRUD?.paginate}
					/>
				}
			/>
			{/*Modal to Create Card Request*/}
			{newCardRequestModal && (
				<Modal state={newCardRequestModal} close={setNewCardRequestModal}>
					<NewCardRequestModal
						close={closeAddAccount}
						contactModal={false}
						addBulkCardRequest={CRUD.addBulkCardRequest}
						isFetching={CRUD?.isFetching}
						addSimpleCardRequest={CRUD.addSimpleCardRequest}
					/>
				</Modal>
			)}

			{/*Modal to Edit Card Request*/}
			{editCardRequestModal && (
				<Modal state={editCardRequestModal?.state} close={setEditCardRequestModal} size='m'>
					<div className="min-h-96">
						<ModalCardRequest close={() => setEditCardRequestModal({ state: false, id: 0 })} CRUD={CRUD}
							id={editCardRequestModal?.id} />
					</div>
				</Modal>
			)}
		</div>
	);
};

export default CardRequests;

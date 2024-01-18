import { PlusIcon, HomeModernIcon } from '@heroicons/react/24/outline';

import GenericTable, {
	type DataTableInterface,
} from '../../components/misc/GenericTable';

import Paginate from '../../components/misc/Paginate';
import Modal from '../../components/modals/GenericModal';
import Breadcrumb, {
	type PathInterface,
} from '../../components/navigation/Breadcrumb';

import { useEffect, useState } from 'react';

import { useAppSelector } from '../../store/hooks';
import useServerEntity from '../../api/userServerEntity';
import { formatCalendar } from '../../utils/helpers';

import NewEntityModal from '../entity/NewEntityModal/NewEntityModal';
import EditEntityContainer from '../entity/editEntityWizzard/EditEntityContainer';

const Entity = () => {
	const [query, setQuery] = useState<string>('');
	const {
		getAllEntity,
		editEntity,
		deleteEntity,
		getEntity,
		setAllEntity,
		paginate,
		isLoading,
		isFetching,
		allEntity,
		entity,
	} = useServerEntity();

	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});
	const [addTicketmodal, setAddTicketmodal] = useState(false);
	// const [exportModal, setExportModal] = useState(false);

	/* useEffect(() => {
              getAllClients(filter);
            }, [filter]); */

	// Data for table ------------------------------------------------------------------------
	const tableTitles = ['ID', 'Nombre', 'Dirección', 'Telefono', 'Fecha'];
	const tableData: DataTableInterface[] = [];
	// eslint-disable-next-line array-callback-return

	const items = useAppSelector((state) => state.Entity.Entity);

	// @ts-expect-error
	items?.items.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				ID: item.id,
				Nombre: item?.name,
				Telefono: item.phone,
				Fecha: formatCalendar(item.createdAt),
				Dirección: item.address,
			},
		});
	});

	
	const close = () => {
		setEditTicketModal({ state: false, id: null });
	};
	const actions = [
		{
			icon: <PlusIcon className='h-5' />,
			title: 'Agregar entidad',
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

	// const filterAction = (data: BasicType) => setFilter(data);
	// ----------------------------------------------------------------------------------

	// Breadcrumb-----------------------------------------------------------------------------------
	const paths: PathInterface[] = [
		{
			name: 'Entidades',
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
		void getAllEntity(filter);
	}, [filter]);

	// @ts-expect-error
	const totalItems = allTickets?.length;
	const totalPages = 1;
	const currentPage = 1;
	return (
		<div>
			<Breadcrumb
				icon={<HomeModernIcon className='h-6 text-gray-500' />}
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
						data={{ totalItems, currentPage, totalPages }}
					/>
				}
			/>

			{/*addTicketmodal && (
				<Modal state={addTicketmodal} close={setAddTicketmodal}>
					<NewEntityModal
						setContactModal={setContactModal}
						close={closeAddAccount}
						contactModal={contactModal}
						setNuevoTicketModal={setNuevoTicketModal}
						nuevoTicketModal={nuevoTicketModal}
					/>
				</Modal>
			)*/}
			{editTicketModal.state && (
				<Modal state={editTicketModal.state} close={close} size='m'>
					<EditEntityContainer
						id={editTicketModal.id}
						editEntity={editEntity}
						deleteEntity={deleteEntity}
						isFetching={isFetching}
						closeModal={close}
						getEntity={getEntity}
						setAllEntity={setAllEntity}
						isLoading={isLoading}
						entity={entity}
						allEntity={allEntity}
					/>
				</Modal>
			)}
		</div>
	);
};

export default Entity;


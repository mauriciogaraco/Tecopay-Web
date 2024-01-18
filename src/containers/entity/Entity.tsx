import {
	PlusIcon,
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
import useServerEntity from '../../api/userServerEntity';
import NewEntityModal from './NewEntityModal/NewEntityModal';
import { HomeModernIcon } from '@heroicons/react/24/outline';
import EditEntityContainer from './editEntityWizzard/EditEntityContainer';
import StateSpanForTable from '../../components/misc/StateSpanForTable';


const Entity = () => {

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
		addEntity,
	} = useServerEntity();

	const [filter, setFilter] = useState<Record<string, string | number | boolean | null>>({});
	const [addEntityModal, setAddEntityModal] = useState(false);

	useEffect(() => {
		getAllEntity(filter);
	}, [filter]);


	//Breadcrumb-----------------------------------------------------------------------------------
	const paths: PathInterface[] = [
		{
			name: 'Entidades',
		},
	];


	//Table ------------------------------------------------------------------------
	const tableTitles = 
	['Nombre', 
	'Dirección', 
	'Telefono', 
	''
	];


	const tableData: DataTableInterface[] = [];
	// @ts-ignore
	allEntity?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				Nombre: item?.name,
				Telefono: item.phone,
				'': (
					<StateSpanForTable
						currentState={item.status}
						greenState='Activa'
						redState='Inactiva'
					/>
				),
				Dirección: item.address,
			},
		});
	});

	const actions = [
		{
			icon: <PlusIcon className='h-5' />,
			title: 'Agregar entidad',
			action: () => setAddEntityModal(true),
		},
	];

	const rowAction = (id: number) => {
		setEditTicketModal({ state: true, id });
	};

	const close = () => setEditTicketModal({ state: false, id: null });


	//------------------------------------------------------------------------------------

	const [editTicketModal, setEditTicketModal] = useState<{
		state: boolean;
		id: number | null;
	}>({ state: false, id: null });


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
				// searching={searching}
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


			{/*Modal de Nueva Entidad*/}
			{addEntityModal && (
				<Modal state={addEntityModal} close={setAddEntityModal} size='m'>
					<NewEntityModal isLoading={isLoading} action={addEntity} />
				</Modal>
			)}

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

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
import EditEntityModal from './editEntityModal/EditEntityModal';
import StateSpanForTable from '../../components/misc/StateSpanForTable';


const Entity = () => {

	const {
		getAllBussinnes,
		getAllEntity,
		addEntity,
		updateEntity,
		getEntity,
		paginate,
		isLoading,
		allEntity,
		business,
		entity,
		isFetching,
	} = useServerEntity();

	useEffect(() => {
		getAllBussinnes();
	}, []);

	let entityCRUD= {getAllEntity, getEntity, getAllBussinnes, addEntity, updateEntity, paginate, isLoading, allEntity, business, entity,}


	const [filter, setFilter] = useState<Record<string, string | number | boolean | null>>({});
	const [addEntityModal, setAddEntityModal] = useState(false);
	const [editEntityModal, setEditEntityModal] = useState<{
		state: boolean;
		id: number;
	}>({ state: false, id: 0 });

	
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
		setEditEntityModal({ state: true, id });
	};



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
				loading={isFetching}
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
				<Modal state={addEntityModal} close={() => setAddEntityModal(false)} size='m'>
					<div className="min-h-96 overflow-hidden">
						<NewEntityModal close={() => setAddEntityModal(false)} entityCRUD={entityCRUD} />
					</div>
					
				</Modal>
			)}

			{editEntityModal && (
				<Modal state={editEntityModal.state} close={setEditEntityModal} size='m'>
					<div className="min-h-96 overflow-hidden">
					<EditEntityModal id={editEntityModal.id} close={()=>setEditEntityModal({ state: false, id: 0 })} entityCRUD={entityCRUD} />
					</div>
				</Modal>
			)}
		</div>
	);
};

export default Entity;

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
import useServerCategories from '../../api/userServerCategories';
import NewEntityModal from './newEntityModal/NewEntityModal';
import { HomeModernIcon } from '@heroicons/react/24/outline';
import EditEntityModal from './editEntityModal/EditEntityModal';
import StatusBadge from '../../components/misc/badges/StatusBadge';


const Entity = () => {

	const [filter, setFilter] = useState<Record<string, string | number | boolean | null>>({});
	const [addEntityModal, setAddEntityModal] = useState(false);
	const [editEntityModal, setEditEntityModal] = useState<{
		state: boolean;
		id: number;
	}>({ state: false, id: 0 });

	const {
		getAllBussinnes,
		getAllEntity,
		addEntity,
		updateEntity,
		getEntity,
		setAllEntity,
		paginate,
		isLoading,
		allEntity,
		business,
		entity,
		isFetching,
		deleteEntity,
	} = useServerEntity();


	const {
		getCategory,
		category,
		isLoadingCat,
		setCategory,
	} = useServerCategories();


	useEffect(() => {
		getAllEntity(filter);
	}, [filter]);

	useEffect(() => {
		getAllBussinnes();
	}, []);

	let entityCRUD = {
		getAllEntity,
		getEntity,
		getAllBussinnes,
		addEntity,
		updateEntity,
		getCategory,
		setAllEntity,
		category,
		paginate,
		isLoading,
		allEntity,
		business,
		entity,
		id: editEntityModal.id,
		isLoadingCat,
		isFetching,
		setCategory,
		deleteEntity,
	};

	//let entityCRUD = {
	//	...useServerEntity(),
	//   getCategory,
	//   category, 
	//   id: editEntityModal.id,
	//   isLoadingCat,
	//   setCategory,
	//  };

	console.log(entityCRUD);


	//Breadcrumb------------------------------------------------------------------------------------

	const paths: PathInterface[] = [
		{
			name: 'Entidades',
		},
	];


	//Table -----------------------------------------------------------------------------------------
	const tableTitles =
		['Nombre',
			'Responsable',
			'Teléfono',
			'Dirección',

			''
		];

	const tableData: DataTableInterface[] = [];
	// @ts-ignore
	allEntity?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'Nombre': item?.name,
				'Responsable':'-',
				'Teléfono': item.phone,
				'': (
					<StatusBadge
						status={item.status}
					/>
				),
				'Dirección': item.address,
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
				actions={actions}
				rowAction={rowAction}
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

			{/*Modal para Editar Entidad*/}
			{editEntityModal && (
				<Modal state={editEntityModal.state} close={setEditEntityModal} size='m'>
					<div className="min-h-96 overflow-hidden">
						<EditEntityModal close={() => setEditEntityModal({ state: false, id: 0 })} entityCRUD={entityCRUD} />
					</div>
				</Modal>
			)}
		</div>
	);
};

export default Entity;

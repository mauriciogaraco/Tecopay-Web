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
import { HomeModernIcon } from '@heroicons/react/24/outline';
import EditEntityModal from './editEntityModal/EditEntityModal';
import StatusBadge from '../../components/misc/badges/StatusBadge';
import NewEntityModal from './newEntityModal/NewEntityModal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEntities } from '../../store/slices/EntitySlice';

const Entity = () => {

	const [filter, setFilter] = useState<Record<string, string | number | boolean | null>>({});
	const [addEntityModal, setAddEntityModal] = useState(false);
	const [editEntityModal, setEditEntityModal] = useState<{
		state: boolean;
		id: number;
	}>({ state: false, id: 0 });

	const dispatch = useAppDispatch();

	const CRUD:any = useServerEntity();
	const {
		getCategory,
		category,
		isLoadingCat,
	} = useServerCategories();
	
	CRUD.getCategory = getCategory;
	CRUD.category = category;
	CRUD.id = editEntityModal.id;
	CRUD.isLoadingCat = isLoadingCat;

	useEffect(() => {
		dispatch(fetchEntities());
	}, [dispatch]);

	const {entities, loading } = useAppSelector((state)=> state.Entity)

	useEffect(() => {
		CRUD.getAllBussinnes();
	}, []);

	//Breadcrumb------------------------------------------------------------------------------------

	const paths: PathInterface[] = [
		{
			name: 'Entidades',
		},
	];

	//Table ------------------------------------------------------------------------------------------

	const tableTitles =
		['Nombre',
			'Responsable',
			'Negocio',
			'Teléfono',
			'Dirección',
			'Estado'
		];

	const tableData: DataTableInterface[] = [];
	
	entities?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'Nombre': item?.name,
				'Responsable':'-',
				'Negocio': item?.business?.name,
				'Teléfono': item.phone,
				'Estado': (
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
				loading={loading}
				actions={actions}
				rowAction={rowAction}
				paginateComponent={
					<Paginate
						action={(page: number) => setFilter({ ...filter, page })}
						data={CRUD.paginate}
					/>
				}
			/>

			{/*New Entity Modal*/}
			{addEntityModal && (
				<Modal state={addEntityModal} close={() => setAddEntityModal(false)} size='m'>
					<div className="min-h-96 overflow-hidden">
						<NewEntityModal close={() => setAddEntityModal(false)} CRUD={CRUD} />
					</div>

				</Modal>
			)}

			{/*Modal to Edit Entity*/}
			{editEntityModal && (
				<Modal state={editEntityModal.state} close={setEditEntityModal} size='m'>
					<div className="min-h-96 overflow-hidden">
						<EditEntityModal close={() => setEditEntityModal({ state: false, id: 0 })} CRUD={CRUD} />
					</div>
				</Modal>
			)}
		</div>
	);
};

export default Entity;

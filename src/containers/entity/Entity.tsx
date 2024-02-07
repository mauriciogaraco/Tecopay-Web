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
import { HomeModernIcon } from '@heroicons/react/24/outline';
import EditEntityModal from './editEntityModal/EditEntityModal';
import StatusBadge from '../../components/misc/badges/StatusBadge';
import NewEntityModal from './newEntityModal/NewEntityModal';

const Entity = () => {

	const [filter, setFilter] = useState<Record<string, string | number | boolean | null>>({});
	const [addEntityModal, setAddEntityModal] = useState(false);
	const [editEntityModal, setEditEntityModal] = useState<{
		state: boolean;
		id: number;
	}>({ state: false, id: 0 });

	const CRUD_origin = useServerEntity();

	type CRUD = { id?: number } & typeof CRUD_origin;
	let CRUD:CRUD = CRUD_origin;
	CRUD.id = editEntityModal.id;

	useEffect(() => {
		CRUD.getAllEntity(filter);
	}, [filter]);

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

	const [finalData, setFinalData] = useState([...CRUD.allEntity]);

	useEffect(() => {
		setFinalData([...CRUD.allEntity]);
	}, [CRUD.allEntity]);

	function filterProcessor(value: { search: string | undefined }) {
		let final_data = [...CRUD.allEntity]
		if (value?.search && (typeof value?.search === 'string')) {
			const searchStringLowercase = value?.search.toLowerCase();
			final_data = final_data.filter((object: any) => {
				const objectNameLowercase = object.name.toLowerCase();
				return objectNameLowercase.includes(searchStringLowercase);
			});
		}
		setFinalData(final_data);
	}

	finalData?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'Nombre': item?.name,
				'Responsable': item?.owner?.username ? item?.owner?.username : '-',
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
	console.log(CRUD.paginate)
	return (
		<div>
			<Breadcrumb
				icon={<HomeModernIcon className='h-6 text-gray-500' />}
				paths={paths}
			/>

			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={CRUD.isFetching}
				actions={actions}
				rowAction={rowAction}
				searching={{
					action: (value: string) => filterProcessor({ search: value }),
					placeholder: 'Buscar entidad por nombe',
				}}
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

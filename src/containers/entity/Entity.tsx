import {
	PlusIcon,
	TicketIcon,
	UsersIcon,
	UserCircleIcon,
} from '@heroicons/react/24/outline';

import GenericTable, {
	DataTableInterface,
	FilterOpts,
} from '../../components/misc/GenericTable';
import useServerUser from '../../api/userServerAccounts';

import Paginate from '../../components/misc/Paginate';
import Modal from '../../components/modals/GenericModal';
import Breadcrumb, {
	PathInterface,
} from '../../components/navigation/Breadcrumb';

import { useNavigate } from 'react-router-dom';

import { BasicType, SelectInterface } from '../../interfaces/InterfacesLocal';

import { useEffect, useState } from 'react';

import { data } from '../../utils/TemporaryArrayData';
import axios from 'axios';
import EditUserContainer from '../accounts/editAccountWizzard/EditAccountContainer';
import { useAppSelector } from '../../store/hooks';
import useServerEntity from '../../api/userServerEntity';
import { formatCalendar } from '../../utils/helpers';
import NewEntityModal from './NewEntity/NewEntityModal';
import { HomeModernIcon } from '@heroicons/react/24/outline';
import EditEntityContainer from './editEntityWizzard/EditEntityContainer';
import StateSpanForTable from '../../components/misc/StateSpanForTable';

const Entity = () => {
	const [query, setQuery] = useState<string>('');
	const [queryText, setQueryText] = useState('');
	const [post, setPost] = useState(null);

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

	const handleSearch = (e: any) => {
		e.preventDefault();
		setQuery(queryText);
	};

	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});
	const [addTicketmodal, setAddTicketmodal] = useState(false);

	//Data for table ------------------------------------------------------------------------
	const tableTitles = ['Nombre', 'Dirección', 'Telefono', ''];
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

	const searching = {
		action: (search: string) => setFilter({ ...filter, search }),
		placeholder: 'Buscar ticket',
	};
	const close = () => setEditTicketModal({ state: false, id: null });
	const actions = [
		{
			icon: <PlusIcon className='h-5' />,
			title: 'Agregar entidad',
			action: () => setAddTicketmodal(true),
		},
		/*{
                title: "Exportar a excel",
                action: () => setExportModal(true),
                icon: <BsFiletypeXlsx />,
              },*/
	];

	const rowAction = (id: number) => {
		setEditTicketModal({ state: true, id });
	};

	//Filters-----------------------------------
	const registrationSelector: SelectInterface[] = [
		{
			id: 'WOO',
			name: 'WOO',
		},
		{
			id: 'ONLINE',
			name: 'ONLINE',
		},
		{
			id: 'POS',
			name: 'POS',
		},
	];

	const sexSelector: SelectInterface[] = [
		{
			id: 'female',
			name: 'Femenino',
		},
		{
			id: 'male',
			name: 'Masculino',
		},
	];

	const availableFilters: FilterOpts[] = [
		//País
		{
			format: 'select',
			filterCode: 'countryId',
			name: 'País',
			asyncData: {
				url: '/public/countries',
				idCode: 'id',
				dataCode: 'name',
			},
		},
		//Provincia
		{
			format: 'select',
			filterCode: 'provinceId',
			name: 'Provincia',
			dependentOn: 'countryId',
			asyncData: {
				url: '/public/provinces',
				idCode: 'id',
				dataCode: 'name',
			},
		},
		//Municipio
		{
			format: 'select',
			filterCode: 'municipalityId',
			name: 'Municipio',
			dependentOn: 'provinceId',
			asyncData: {
				url: '/public/municipalities',
				idCode: 'id',
				dataCode: 'name',
			},
		},
		//Forma de registro
		{
			format: 'select',
			filterCode: 'registrationWay',
			name: 'Forma de registro',
			data: registrationSelector,
		},
		//Nacimiento desde
		{
			format: 'datepicker',
			filterCode: 'birthFrom',
			name: 'Fecha de nacimiento desde',
		},
		//Nacimiento hasta
		{
			format: 'datepicker',
			filterCode: 'birthTo',
			name: 'Fecha de nacimiento hasta',
		},
		//Forma de registro
		{
			format: 'select',
			filterCode: 'sex',
			name: 'Sexo',
			data: sexSelector,
		},
	];

	//const filterAction = (data: BasicType) => setFilter(data);
	//----------------------------------------------------------------------------------

	//Breadcrumb-----------------------------------------------------------------------------------
	const paths: PathInterface[] = [
		{
			name: 'Entidades',
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
		getAllEntity(filter);
	}, [filter]);

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
				searching={searching}
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

			{addTicketmodal && (
				<Modal state={addTicketmodal} close={setAddTicketmodal}>
					<NewEntityModal
						setContactModal={setContactModal}
						close={closeAddAccount}
						contactModal={contactModal}
						setNuevoTicketModal={setNuevoTicketModal}
						nuevoTicketModal={nuevoTicketModal}
						isLoading={isLoading}
						addEntity={addEntity}
					/>
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

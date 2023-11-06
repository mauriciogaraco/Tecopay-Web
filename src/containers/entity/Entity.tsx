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
import NuevoTicketModal from '../accounts/NewTicket/NuevoTicketModal';
import { data } from '../../utils/TemporaryArrayData';
import axios from 'axios';
import EditUserContainer from '../accounts/editAccountWizzard/EditUserContainer';
import { useAppSelector } from '../../store/hooks';
import useServerEntity from '../../api/userServerEntity';
import { formatCalendar } from '../../utils/helpers';
import NewEntityModal from './NewEntity/NewEntityModal';
import { HomeModernIcon } from '@heroicons/react/24/outline';
import EditEntityContainer from './editEntityWizzard/EditEntityContainer';

const Entity = () => {
	const [query, setQuery] = useState<string>('');
	const [queryText, setQueryText] = useState('');
	const [post, setPost] = useState(null);

	const {
		paginate,
		isLoading,
		isFetching,
		waiting,
		modalWaiting,
		allUsers,
		entity,
		setAllTickets,
		allTickets,
		getAllEntity,
		addEntity,
		getEntity,
		editEntity,
		updateEntity,
		updateMyEntity,
		deleteEntity,
		setAllUsers,
		manageErrors,
		modalWaitingError,
	} = useServerEntity();

	const handleSearch = (e: any) => {
		e.preventDefault();
		setQuery(queryText);
	};

	const filteredOptions =
		query === ''
			? data
			: data.filter(
					({
						cliente,
						no,
						fecha,
						description,
						prioridad,
						clasificacion,
						email,
					}) => {
						return (
							cliente.toLowerCase().includes(query.toLowerCase()) ||
							no.toLowerCase().includes(query.toLowerCase()) ||
							prioridad.toLowerCase().includes(query.toLowerCase()) ||
							clasificacion.toLowerCase().includes(query.toLowerCase()) ||
							email.toLowerCase().includes(query.toLowerCase()) ||
							fecha.toLowerCase().includes(query.toLowerCase()) ||
							cliente.toLowerCase().includes(query.toLowerCase())
						);
					},
			  );

	/*const {
              getAllClients,
              addClient,
              allClients,
              paginate,
              isLoading,
              isFetching,
            } = useServerOnlineClients();*/

	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});
	const [addTicketmodal, setAddTicketmodal] = useState(false);
	//const [exportModal, setExportModal] = useState(false);

	/*useEffect(() => {
              getAllClients(filter);
            }, [filter]);*/

	//Data for table ------------------------------------------------------------------------
	const tableTitles = ['ID', 'Nombre', 'Direccion', 'Telefono'];
	const tableData: DataTableInterface[] = [];
	// eslint-disable-next-line array-callback-return

	const items = useAppSelector((state) => state.Entity.Entity);

	// @ts-ignore
	items?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				ID: item.id,
				Nombre: item?.name,
				Telefono: item.phone,
				Direccion: item.address,
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
		getAllEntity(filter).then(
			allTickets ? () => console.log(allTickets) : () => console.log('moee'),
		);
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
					/>
				</Modal>
			)}
		</div>
	);
};

export default Entity;

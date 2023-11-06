import { PlusIcon, CreditCardIcon } from '@heroicons/react/24/outline';

import GenericTable, {
	DataTableInterface,
	FilterOpts,
} from '../../components/misc/GenericTable';

import Paginate from '../../components/misc/Paginate';
import Modal from '../../components/modals/GenericModal';
import Breadcrumb, {
	PathInterface,
} from '../../components/navigation/Breadcrumb';

import { BasicType, SelectInterface } from '../../interfaces/InterfacesLocal';

import { useEffect, useState } from 'react';
import NuevoTicketModal from '../accounts/NewAccount/NewAccountModal';

import { useAppSelector } from '../../store/hooks';
import useServerCards from '../../api/userServerCards';
import { formatCalendar } from '../../utils/helpers';
import EditCardContainer from './editCardWizzard/EditCardContainer';

const Card = () => {
	const [query, setQuery] = useState<string>('');
	const [post, setPost] = useState(null);

	const {
		paginate,
		isLoading,
		isFetching,
		waiting,
		modalWaiting,
		card,
		allCards,
		getAllCards,
		addCard,
		getCard,
		editCard,
		deleteCard,
		setAllCards,
		manageErrors,
		modalWaitingError,
	} = useServerCards();

	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});
	const [addTicketmodal, setAddTicketmodal] = useState(false);

	/*useEffect(() => {
              getAllClients(filter);
            }, [filter]);*/

	//Data for table ------------------------------------------------------------------------
	const tableTitles = [
		'id',
		'Expiracion',
		'Propietario',
		'Moneda',
		'Direccion',
		'Descripcion',
	];
	const tableData: DataTableInterface[] = [];
	// eslint-disable-next-line array-callback-return

	const items = useAppSelector((state) => state.cards.Cards);

	// @ts-ignore
	items?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				id: item.id,
				Codigo: `${item?.code}`,
				Expiracion: formatCalendar(item?.expiratedAt),
				Propietario: item.holder?.fullName,
				Moneda: item.currency.code,
				Descripcion: item.description,
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
			title: 'Agregar cuenta',
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
			name: 'Tarjetas',
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
		getAllCards(filter);
	}, [filter]);

	return (
		<div>
			<Breadcrumb
				icon={<CreditCardIcon className='h-6 text-gray-500' />}
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
					<NuevoTicketModal
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
					<EditCardContainer
						id={editTicketModal.id}
						editCard={editCard}
						deleteCard={deleteCard}
						isFetching={isFetching}
						closeModal={close}
					/>
				</Modal>
			)}
		</div>
	);
};

export default Card;

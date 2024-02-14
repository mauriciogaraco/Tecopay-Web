import GenericTable, {
	DataTableInterface,
	FilterOpts,
} from '../../../components/misc/GenericTable';
import Paginate from '../../../components/misc/Paginate';
import Modal from '../../../components/modals/GenericModal';
import { useState, useEffect } from 'react';
import { formatCardNumber } from '../../../utils/helpers';
import StatusForCard from '../../../components/misc/StatusForCard';
import useServerCards from '../../../api/userServerCards';
import GenericList from '../../../components/misc/GenericList';
import { formatCalendar } from '../../../utils/helpersAdmin';




const Card = () => {

	const CRUD = useServerCards();

	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});
	const [requestToPrint, setRequestToPrint] = useState<{
		state: boolean;
		id: number;
	}>({ state: false, id: 0 });

	useEffect(() => {
		CRUD.getAllCards({ isDelivered: 'true', ...filter });
	}, [filter]);
	
	//Data for table ------------------------------------------------------------------------
	const tableTitles = [
		'No. Tarjeta',
		'No. Cuenta',
		'Titular',
		'Categoría',
		'Entidad',
		'Estado',
	];
	const tableData: DataTableInterface[] = [];

	CRUD?.allCards?.items.map((item: any) => {
		tableData.push({
			rowId: item?.id,
			payload: {
				'No. Tarjeta': formatCardNumber(item?.address),
				'No. Cuenta': formatCardNumber(item?.account?.address),
				'Titular': item?.holderName ?? '-',
				'Categoría': item?.category?.name ?? '-',
				'Entidad': item?.account?.issueEntity?.name ?? '-',
				'Estado': <StatusForCard currentState={item.isDelivered} />,
			},
		});
	});

	const close = () => setRequestToPrint({ state: false, id: 0 });

	const rowAction = (id: number) => {
		setRequestToPrint({ state: true, id });
	};

	//---------------------------------------------------------------------------------------

	const availableFilters: FilterOpts[] = [
		{
			format: "datepicker-range",
			name: "Rango de fecha",
			filterCode: "dateRange",
			datepickerRange: [
				{
					isUnitlToday: true,
					filterCode: "createdFrom",
					name: "Desde",
				},
				{
					isUnitlToday: true,
					filterCode: "createdTo",
					name: "Hasta",
				},
			],
		},
		{
			format: "select",
			filterCode: "businessId",
			name: "Negocio",
			asyncData: {
				url: "/business",
				idCode: "id",
				dataCode: ["name"],
			},
		},
		{
			format: "select",
			filterCode: "issueEntityId",
			name: "Entidad",
			asyncData: {
				url: "/entity",
				idCode: "id",
				dataCode: ["name"],
			},
		},
		{
			format: "select",
			filterCode: "accountId",
			name: "Cuenta",
			asyncData: {
				url: `/account`,
				idCode: "id",
				dataCode: ["address"],
			},
		},

	];

	const filterAction = (data: any) => {
		data ? setFilter({ ...data , isDelivered: 'true' }) : setFilter({ page: 1 , isDelivered: 'true' });
	};

	//---------------------------------------------------------------------------------------

	return (
		<div>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={CRUD.isLoading}
				rowAction={rowAction}	
				filterComponent={{ availableFilters, filterAction }}
				paginateComponent={
					<Paginate
						action={(page: number) => setFilter({ ...filter, page })}
						data={CRUD.paginate}
					/>
				}
			/>

			{requestToPrint.state && (
				<Modal state={requestToPrint.state} close={close} size='b'>
					<EditCardContainer
						id={requestToPrint.id}
						allCards={CRUD?.allCards?.items}
					/>
				</Modal>
			)}
		</div>
	);
};

export default Card;


interface UserWizzardInterface {
	id: number;
	allCards: any;
}

const EditCardContainer = ({
	id, allCards
}: UserWizzardInterface) => {

	const desiredObject: any = allCards?.find((item: any) => item.id === id);

	return (
		<>
			<GenericList
				header={{ title: `Detalles de tarjeta ${formatCardNumber(desiredObject?.address) ?? '-'}` }}
				body={{
					'No. Tarjeta': formatCardNumber(desiredObject?.address) ?? '-',
					'Titular': desiredObject?.holderName ?? '-',
					'Entidad': desiredObject?.account?.issueEntity?.name ?? '-',
					'Categoría': desiredObject?.category?.name ?? '-',
					'Fecha de emisión': 'No existe',
					'Fecha de expiración':
						formatCalendar(desiredObject?.expiratedAt) ?? '-',
				}}
			></GenericList>
		</>
	);
};






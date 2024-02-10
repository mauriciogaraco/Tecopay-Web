import { UserCircleIcon } from '@heroicons/react/24/outline';
import GenericTable, {
	DataTableInterface,
	FilterOpts,
} from '../../components/misc/GenericTable';
import Paginate from '../../components/misc/Paginate';
import Breadcrumb, {
	type PathInterface,
} from '../../components/navigation/Breadcrumb';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { formatCardNumber } from '../../utils/helpers';
import { formatDate } from '../../utils/helpersAdmin';
import useServerEntity from '../../api/userServerEntity';
import { saveAccountId } from '../../store/slices/accountSlice';
import { fetchAccounts } from '../../store/slices/accountSlice';

const Accounts = () => {

	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null  >
	>({ page: 1 });

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchAccounts(filter));
	}, [dispatch, filter]);
	console.log(filter);
	const { accounts, loading: isLoading } = useAppSelector((state) => state.Account);
	let allAccounts = accounts?.items;


	const { getAllBussinnes, business } = useServerEntity();
	const navigate = useNavigate();

	useEffect(() => {
		getAllBussinnes();
	}, []);

	// Breadcrumb-----------------------------------------------------------------------------------

	const paths: PathInterface[] = [
		{
			name: 'Cuentas',
		},
	];

	// Data for table ------------------------------------------------------------------------------

	const tableTitles = [
		'Fecha de Activación',
		'Total de Puntos',
		'Número de Cuenta',
		'Propietario',
		'Entidad',
		'Negocio',
		'',
	];

	//filter_________________________________________________________________________________________________

	type filterAccounts = {
		business?: number;
		entities?: number;
		owner?: number;
		dateFrom?: string;
		dateTo?: string;
		search?: string;
	}

	const [finalData, setFinalData] = useState([...allAccounts]);

	useEffect(() => {
		setFinalData([...allAccounts]);
	}, [allAccounts]);

	//filter_________________________________________________________________________________________________

	const tableData: DataTableInterface[] = [];
	finalData?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'Fecha de Activación': formatDate(item?.createdAt) ?? '-',
				'No.': item.id,
				'Total de Puntos':item?.amount,
				'Número de Cuenta': `${formatCardNumber(item?.address)}`,
				'Nombre': item?.name,
				'Propietario': item?.owner?.fullName ? item?.owner?.fullName : '-',
				'Entidad': item?.issueEntity?.name,
				'Negocio': item?.issueEntity?.business?.name ? item?.issueEntity?.business?.name : '-',
			},
		});
	});

	const rowAction = (id: number) => {
		dispatch(saveAccountId(id));
		navigate('details');
	};

	//---------------------------------------------------------------------------------------

	let measureSelectorData = [{ id: 1, name: 'Juan' }, { id: 2, name: 'Pepe' }];


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
			filterCode: "ownerId",
			name: "Propietario",
			asyncData: {
				url: "/user",
				idCode: "id",
				dataCode: ["fullName"],
			},
		},

	];

	const filterAction = (data: filterAccounts) => {
		data ? setFilter({ ...data }) : setFilter({ page: 1 });
		//data ? filterProcessor(data) : setFinalData([...allAccounts]);
	};

	//---------------------------------------------------------------------------------------

	return (
		<div>
			<Breadcrumb
				icon={<UserCircleIcon className='h-6 text-gray-500' />}
				paths={paths}
			/>

			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={isLoading}
				rowAction={rowAction}
				searching={{
					action: (value: string) => filterAction({ ...filter, search: value }),
					placeholder: 'Buscar Cuenta',
				}}
				filterComponent={{ availableFilters, filterAction }}
				paginateComponent={
					<Paginate
						action={(page: number) => {
							setFilter({ ...filter, page });
						}}
						data={accounts}
					/>
				}
			/>
		</div>
	);
};

export default Accounts;

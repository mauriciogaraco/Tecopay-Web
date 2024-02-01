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
		Record<string, string | number | boolean | null>
	>({ page: 1 });

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchAccounts(filter));
	}, [dispatch, filter]);

	const { accounts, loading: isLoading } = useAppSelector((state) => state.Account);
	let allAccounts = accounts?.items;


	const { getAllBussinnes, business } = useServerEntity();
	const navigate = useNavigate();

	const { entities:entidades } = useAppSelector((state) => state.Entity)
	let entities = entidades.items;

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
		dateFrom?: Date;
		dateTo?: Date;
		search?: string;
	}

	const [finalData, setFinalData] = useState([...allAccounts]);

	useEffect(() => {
		setFinalData([...allAccounts]);
	}, [allAccounts]);

	function filterProcessor(filter: filterAccounts) {

		let final_data = [...allAccounts]
	
		if (filter?.search && (typeof filter?.search === 'string')) {
			const searchStringLowercase = filter?.search.toLowerCase().replace(/\s/g, '');
			final_data = final_data.filter((object: any) => {
				const objectNameLowercase = object.address.toLowerCase().replace(/\s/g, '');
				return objectNameLowercase.includes(searchStringLowercase);
			});
		}
	
		if (filter?.entities) {
			final_data = final_data.filter(objeto => objeto.issueEntity?.id === filter?.entities)
		}

		if (findNameById(filter?.business)) {
			final_data = final_data.filter(objeto => objeto.issueEntity?.business?.name === findNameById(filter?.business));
		}

		if (filter.dateFrom !== undefined && filter.dateTo !== undefined) {
			final_data = final_data.filter(obj => new Date(obj.createdAt) >= new Date(filter.dateFrom ?? 0) && new Date(obj.createdAt) <= new Date(new Date(filter.dateTo ?? 0)));
		}

		setFinalData(final_data);
	}

	const findNameById = (id: number | undefined) => {
		if (!id) return null;
		const matchedObject = business?.find((obj: { id: number, name: string }) => obj.id === id);
		return matchedObject ? matchedObject.name : null;
	};

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
					filterCode: "dateFrom",
					name: "Desde",
				},
				{
					isUnitlToday: true,
					filterCode: "dateTo",
					name: "Hasta",
				},
			],
		},
		{
			format: 'select',
			filterCode: 'business',
			name: 'Negocio',
			data: business,
		},
		{
			format: 'select',
			filterCode: 'owner',
			name: 'Propietario',
			data: measureSelectorData,
		},
		{
			format: 'select',
			filterCode: 'entities',
			name: 'Entidad',
			data: entities,
		},
	];

	/*
	{
			format: "select",
			filterCode: "movedById",
			name: "Usuario",
			asyncData: {
				url: "/security/users",
				idCode: "id",
				dataCode: ["displayName", "email", "username"],
			},
		},
		{
			format: 'input',
			filterCode: 'disponibilityFrom',
			name: 'Cantidad disponible hasta',
		},
		{
			format: 'boolean',
			filterCode: 'showForSale',
			name: 'Listos para vender',
		},
		{
			format: "multiselect",
			filterCode: "entities",
			name: "Entidad",
			data: entities,
		},
	
	*/

	const filterAction = (data: filterAccounts) => {
		//data ? setFilter({ ...filter, ...data }) : setFilter({ page: 1 });
		data ? filterProcessor(data) : setFinalData([...allAccounts]);
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

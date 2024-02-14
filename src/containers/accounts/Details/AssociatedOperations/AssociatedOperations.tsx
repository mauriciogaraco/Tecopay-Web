import { useEffect, useState } from 'react';

import GenericTable, {
	DataTableInterface,
	FilterOpts,
} from '../../../../components/misc/GenericTable';
import { formatCalendar } from '../../../../utils/helpersAdmin';
import {
	translateOperationConcept,
	translateOperationType,
} from '../../../../utils/translateOperations';
import useServerAccounts from '../../../../api/userServerAccounts';
import { useAppSelector } from '../../../../store/hooks';
import Paginate from '../../../../components/misc/Paginate';

const AssociatedOperations = () => {

	const id = useAppSelector((state) => state.Account?.id);
	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({ page: 1, accountId: id });
	console.log(id)
	const {
		isLoading,
		operations,
		paginate,
		getAccountOperations,
	} = useServerAccounts();

	useEffect(() => {
		getAccountOperations(filter);
	}, [filter]);

	// Data for table ------------------------------------------------------------------------
	const tableTitles = ['Fecha', 'Tipo de Operación', 'Monto', 'Tarjeta', 'Concepto'];

	const tableData: DataTableInterface[] = [];
	operations?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'Fecha': formatCalendar(item?.createdAt),
				'Tipo de Operación': translateOperationType(item?.operation ?? '-'),
				'Monto': item?.amount ?? '-',
				'Tarjeta': '-',
				'Concepto': translateOperationConcept(item?.description ?? '-'),
			},
		});
	});

	//---------------------------------------------------------------------------------------

	const availableFilters: FilterOpts[] = [
		{
			format: "datepicker-range",
			name: "Rango de fecha",
			filterCode: "dateRange",
			datepickerRange: [
				{
					isUnitlToday: true,
					filterCode: "fromDate",
					name: "Desde",
				},
				{
					isUnitlToday: true,
					filterCode: "toDate",
					name: "Hasta",
				},
			],
		},
		{
			format: "select",
			filterCode: "ownerId",
			name: "Propietario",
			asyncData: {
				url: "/user",
				idCode: "id",
				dataCode: ["username"],
			},
		},
		{
			format: "select",
			filterCode: "operation",
			name: "Operación",
			data: [{ id: "DEBIT", name: "Débito" }, { id: "CREDIT", name: "Crédito" }]
		},
		{
			format: "select",
			filterCode: "cardAddress",
			name: "Tarjeta",
			asyncData: {
				url: `/card`,
				defaultParams: { accountId: id },
				idCode: "address",
				dataCode: ["address"],
			},
		},
	];

	const filterAction = (data: any) => {
		data ? setFilter({ ...data, accountId: id }) : setFilter({ page: 1, accountId: id });
	};

	//---------------------------------------------------------------------------------------

	return (
		<>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				filterComponent={{ availableFilters, filterAction }}
				paginateComponent={
					<Paginate
						action={(page: number) => {
							setFilter({ ...filter, page });
						}}
						data={paginate}
					/>
				}
				loading={isLoading}
			/>
		</>
	)
};

export default AssociatedOperations;

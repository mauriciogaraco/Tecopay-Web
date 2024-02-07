import { useEffect, useState } from 'react';

import GenericTable, {
	DataTableInterface,
} from '../../../../components/misc/GenericTable';
import { formatCalendar } from '../../../../utils/helpersAdmin';
import {
	translateOperationConcept,
	translateOperationType,
} from '../../../../utils/translateOperations';
import useServerAccounts from '../../../../api/userServerAccounts';
import { useAppSelector } from '../../../../store/hooks';
import Paginate from '../../../../components/misc/Paginate';

const AssociatedOperations = ( ) => {

	const id = useAppSelector((state) => state.Account?.id);
	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});
	console.log(id)
	const {
		isLoading,
		operations,
		paginate,
		getAccountOperations,
	} = useServerAccounts();
	
	useEffect(() => {
		getAccountOperations(id);
	}, []);

	// Data for table ------------------------------------------------------------------------
	const tableTitles = ['Fecha', 'Tipo de Operación', 'Monto', 'Concepto'];

	const tableData: DataTableInterface[] = [];
	operations?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'Fecha': formatCalendar(item?.createdAt),
				'Tipo de Operación': translateOperationType(item?.operation ?? '-'),
				'Monto': item?.amount ?? '-',
				'Concepto': translateOperationConcept(item?.description ?? '-'),
			},
		});
	});

	return (
		<>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
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

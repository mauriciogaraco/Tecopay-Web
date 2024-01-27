import { useEffect, useState } from 'react';

import GenericTable, {
	DataTableInterface,
} from '../../../../components/misc/GenericTable';
import { formatCalendar } from '../../../../utils/helpersAdmin';
import {
	translateOperationConcept,
	translateOperationType,
} from '../../../../utils/translateOperations';

const AssociatedOperations = (operations: any, paginate: any) => {
	const [tableData, setTableData] = useState<DataTableInterface[]>([]);

	// Data for table ------------------------------------------------------------------------
	const tableTitles = ['Fecha', 'Tipo de Operación', 'Monto', 'Concepto'];

	const operationMapping = async () => {
		const loadedAllCards = await operations;

		const items = loadedAllCards.operations;
		console.log(operations);
		items?.map((item: any) => {
			setTableData((prevTableData) => [
				...prevTableData,
				{
					rowId: item.id,
					payload: {
						'Fecha': formatCalendar(item?.createdAt),
						'Tipo de Operación': translateOperationType(item?.operation ?? '-'),
						'Monto': item?.amount ?? '-',
						'Concepto': translateOperationConcept(item?.description ?? '-'),
					},
				},
			]);
		});
	};

	useEffect(() => {
		operationMapping();
	}, []);

	return tableData ? (
		<div>
			<GenericTable tableData={tableData} tableTitles={tableTitles} />
		</div>
	) : (
		<div>...</div>
	);
};

export default AssociatedOperations;

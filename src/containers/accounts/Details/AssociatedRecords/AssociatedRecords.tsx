import { useEffect, useState } from 'react';

import GenericTable, {
	DataTableInterface,
} from '../../../../components/misc/GenericTable';
import { formatDate } from '../../../../utils/helpersAdmin';
import { getAccountAction } from '../../../../utils/functions';

const AssociatedRecords = (records: any, paginate: any) => {
	
	const [tableData, setTableData] = useState<DataTableInterface[]>([]);

	// Data for table ------------------------------------------------------------------------
	const tableTitles = [
		'Fecha',
		'Nombre',
		'Acción',
		'Detalles',
		'Observaciones',
	];

	const recordMapping = async () => {
		const loadedAllCards = await records;

		const items = loadedAllCards.records;

		items.map((item: any) => {
			setTableData((prevTableData) => [
				...prevTableData,
				{
					rowId: item.id,
					payload: {
						Fecha: formatDate(item?.createdAt),
						Nombre: item?.title ?? '-',
						Acción: getAccountAction(item?.action),
						Detalles: item?.details ?? '-',
						Observaciones: item?.observations ?? '-',
					},
				},
			]);
		});
	};

	useEffect(() => {
		recordMapping();
	}, []);


	return tableData ? (
		<div>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
			/>
		</div>
	) : (
		<div>loading</div>
	);
};

export default AssociatedRecords;

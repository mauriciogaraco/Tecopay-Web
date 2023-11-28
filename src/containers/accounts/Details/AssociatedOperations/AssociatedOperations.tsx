import { useState } from 'react';

import GenericTable, {
	DataTableInterface,
} from '../../../../components/misc/GenericTable';

const AssociatedOperations = (operations: any, paginate: any) => {

	const [tableData, setTableData] = useState<DataTableInterface[]>([]);


	// Data for table ------------------------------------------------------------------------
	const tableTitles = ['Fecha', 'Operación', 'Monto', 'Concepto'];


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

export default AssociatedOperations;

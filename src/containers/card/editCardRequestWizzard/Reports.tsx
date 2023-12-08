import GenericTable, {
	DataTableInterface,
} from '../../../components/misc/GenericTable';
import StatusForCardRequest from '../../../components/misc/StatusForCardRequest';
import { formatCalendar } from '../../../utils/helpersAdmin';

interface EditInterface {
	isFetching: boolean;
	setSelectedDataToParent: any;
	cardRequestRecords: any;
}

const Reports = ({
	isFetching,
	cardRequestRecords,
}: EditInterface) => {
	//Data for table ------------------------------------------------------------------------
	const tableTitles = ['Fecha', 'Estado', 'Resgistrado Por'];
	const tableData: DataTableInterface[] = [];
	cardRequestRecords?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				Fecha: formatCalendar(item.updatedAt),
				Estado: <StatusForCardRequest currentState={item.status} />,
				'Resgistrado Por': item?.issuedBy?.fullName ?? '-',
			},
		});
	});

	return (
		<>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={isFetching}
				//searching={searching}
				//actions={actions}
				//rowAction={rowAction}
				//filterComponent={{ availableFilters, filterAction }}
			/>
		</>
	);
};

export default Reports;

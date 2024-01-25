
import StatusForCardRequest from '../../../components/misc/StatusForCardRequest';
import { formatCalendar } from '../../../utils/helpersAdmin';
import GenericTable, {
	DataTableInterface,
} from '../../../components/misc/GenericTable';

interface propsDestructured {
	CRUD: any;
}

const ReportsCardRequest = ({ CRUD }: propsDestructured) => {

	//Data for table ------------------------------------------------------------------------

	const tableTitles = ['Fecha de Solicitud', 'Estado', 'Resgistrado Por'];

	const tableData: DataTableInterface[] = [];
	CRUD?.cardRequestRecords?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'Fecha de Solicitud': formatCalendar(item.updatedAt),
				'Estado': <StatusForCardRequest currentState={item.status} />,
				'Resgistrado Por': item?.issuedBy?.fullName ?? '-',
			},
		});
	});

	return (
		<>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={CRUD.isFetching}
			/>
		</>
	);
};

export default ReportsCardRequest;



import { useState, useEffect } from 'react';
import GenericTable, {
	DataTableInterface,
} from '../../../../components/misc/GenericTable';
import Paginate from '../../../../components/misc/Paginate';
import { formatCalendar, formatCardNumber } from '../../../../utils/helpers';
import useServerCards from '../../../../api/userServerCards';
import { useAppSelector } from '../../../../store/hooks';

const AssociatedCards = () => {

	const id = useAppSelector((state) => state.Account?.id);
	const { getAllCards, paginate, allCards, isLoading } = useServerCards();

	useEffect(() => {
		getAllCards({ accountId: id });
	}, [id]);

	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});

	const tableTitles = [
		'No. Tarjeta',
		'Propietario',
		'Categoría',
		'Fecha de Expiración',
	];

	const tableData: DataTableInterface[] = [];
	allCards?.items?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'No. Tarjeta': formatCardNumber(item?.address),
				'Propietario': item?.holderName ?? '-',
				'Categoría': item?.category?.name ?? '-',
				'Fecha de Expiración': formatCalendar(item?.expiratedAt),
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

export default AssociatedCards;

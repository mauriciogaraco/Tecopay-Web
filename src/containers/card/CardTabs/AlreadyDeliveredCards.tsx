import GenericTable, {
	DataTableInterface,
} from '../../../components/misc/GenericTable';
import Paginate from '../../../components/misc/Paginate';
import Modal from '../../../components/modals/GenericModal';
import { useState, useEffect } from 'react';
import { formatCardNumber } from '../../../utils/helpers';
import StatusForCardRequest from '../../../components/misc/StatusForCardRequest';
import useServerCards from '../../../api/userServerCards';
import Button from '../../../components/misc/Button';
import GenericList from '../../../components/misc/GenericList';
import { formatCalendar } from '../../../utils/helpersAdmin';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPrint,
} from "@fortawesome/free-solid-svg-icons";
import useServerCardsRequests from '../../../api/userServerCardsRequests';
import { NoSymbolIcon } from '@heroicons/react/24/outline';



const Card = () => {

	const CRUD = useServerCards();

	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});
	const [requestToPrint, setRequestToPrint] = useState<{
		state: boolean;
		id: number;
	}>({ state: false, id: 0 });

	useEffect(() => {
		CRUD.getAllCards({ isDelivered: true, ...filter });
	}, [filter]);

	//Data for table ------------------------------------------------------------------------
	const tableTitles = [
		'No. Tarjeta',
		'No. Cuenta',
		'Titular',
		'Categoría',
		'Entidad',
		'Estado',
	];
	const tableData: DataTableInterface[] = [];

	CRUD?.allCards?.items.map((item: any) => {
		tableData.push({
			rowId: item?.id,
			payload: {
				'No. Tarjeta': formatCardNumber(item?.address),
				'No. Cuenta': formatCardNumber(item?.account?.address),
				'Titular': item?.holderName ?? '-',
				'Categoría': item?.category?.name ?? '-',
				'Entidad': item?.account?.issueEntity?.name ?? '-',
				'Estado': <StatusForCardRequest currentState={item.request.status} />,
			},
		});
	});

	const close = () => setRequestToPrint({ state: false, id: 0 });

	const rowAction = (id: number) => {
		setRequestToPrint({ state: true, id });
	};

	//-----------------------------------------------------------------------------------

	return (
		<div>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={CRUD.isLoading}
				rowAction={rowAction}
				//filterComponent={{ availableFilters, filterAction }}
				paginateComponent={
					<Paginate
						action={(page: number) => setFilter({ ...filter, page })}
						data={CRUD.paginate}
					/>
				}
			/>

			{requestToPrint.state && (
				<Modal state={requestToPrint.state} close={close} size='b'>
					<EditCardContainer
						id={requestToPrint.id}
						allCards={CRUD?.allCards?.items}
					/>
				</Modal>
			)}
		</div>
	);
};

export default Card;


interface UserWizzardInterface {
	id: number;
	allCards: any;
}

const EditCardContainer = ({
	id, allCards
}: UserWizzardInterface) => {

	const desiredObject: any = allCards?.find((item: any) => item.id === id);

	return (
		<>
			<GenericList
				header={{ title: `Detalles de tarjeta ${formatCardNumber(desiredObject?.address) ?? '-'}` }}
				body={{
					'No. Tarjeta': formatCardNumber(desiredObject?.address) ?? '-',
					'Titular': desiredObject?.holderName ?? '-',
					'Entidad': desiredObject?.account?.issueEntity?.name ?? '-',
					'Categoría': desiredObject?.category?.name ?? '-',
					'Fecha de emisión': 'No existe',
					'Fecha de expiración':
						formatCalendar(desiredObject?.expiratedAt) ?? '-',
				}}
			></GenericList>
		</>
	);
};






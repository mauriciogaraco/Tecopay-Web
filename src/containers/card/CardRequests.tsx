import {
	PlusIcon,
	CreditCardIcon,
} from '@heroicons/react/24/outline';

import GenericTable, {
	DataTableInterface,
} from '../../components/misc/GenericTable';

import Paginate from '../../components/misc/Paginate';
import Modal from '../../components/modals/GenericModal';
import Breadcrumb, {
	PathInterface,
} from '../../components/navigation/Breadcrumb';

import { useEffect, useState } from 'react';

import { formatDateForCard } from '../../utils/helpers';
import useServerCardsRequests from '../../api/userServerCardsRequests';
import NewCardRequestModal from './newCardRequest/NewCardRequestModal';
import EditCardRequestContainer from './editCardRequestWizzard/EditCardRequestContainer';
import StatusForCardRequest from '../../components/misc/StatusForCardRequest';
import { translateCardRequestType } from '../../utils/translateCardStatus';
import { formatDate } from '../../utils/helpersAdmin';
import { exportExcel, generateUrlParams } from '../../utils/helpersAdmin2';
import ExcelFileExport from '../../components/commos/ExcelFileExport';
import query from '../../api/APIServices';
import { BsFiletypeXlsx } from 'react-icons/bs';
import Button from '../../components/misc/Button';
import { DocumentMagnifyingGlassIcon, InformationCircleIcon } from '@heroicons/react/20/solid';

const CardRequests = () => {

	const {
		acceptRequest,
		paginate,
		isLoading,
		isFetching,
		cardRequest,
		getAllCardsRequests,
		addSimpleCardRequest,
		getCardRequest,
		addBulkCardRequest,
		editCardRequest,
		deleteCardRequest,
		manageErrors,
		allCardsRequests,
		setSelectedDataToParent,
		cardRequestRecords,
		updateCardStatus,
	} = useServerCardsRequests();

	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({ page: 1 });

	const [editCardRequestModal, setEditCardRequestModal] = useState<{
		state: boolean;
		id: number | null;
		active: string | null;
		status: string | null;
	}>({ state: false, id: null, active: null, status: null });

	const [addTicketmodal, setAddTicketmodal] = useState(false);

	//Export to excel
	const [loadingExport, setloadingExport] = useState(false);
	const [exportModal, setExportModal] = useState(false);

	let allResults: any = [];
	let pages: number = paginate?.totalPages ? paginate?.totalPages : 1;
	let page: number = 1;

	const exportBankAccounts = async (filename: string) => {
		const dataToExport: Record<string, string | number>[] = [];
		setloadingExport(true);

		await query
			.get(`/cardRequest${generateUrlParams({ ...filter, page: 1 })}`)
			.then((resp: any) => {
				allResults = allResults.concat(resp.data.items);
			})
			.catch((e: any) => manageErrors(e));

		while (pages > page) {
			page++;
			await query
				.get(`/cardRequest${generateUrlParams({ ...filter, page })}`)
				.then((resp: any) => {
					allResults = allResults.concat(resp.data.items);
				})
				.catch((e: any) => manageErrors(e));
		}

		allResults.forEach((item: any) => {
			if (item.status === 'ACCEPTED') {
				let name: string = '';
				if (
					item?.madeBy?.displayName != null &&
					item?.madeBy?.displayName != undefined
				) {
					name = item?.madeBy?.displayName;
				} else {
					name = '';
				}
				dataToExport.push({
					'Card Number': item?.queryNumber ?? '---',
					'Card Holder': item?.holderName ?? '---',
					Barcode: item?.barCode,
					IssuetAt: formatDateForCard(item.createdAt),
					ExpirationDate: formatDateForCard(item.createdAt),
				});
			}
		});
		exportExcel(dataToExport, filename);
		setloadingExport(false);
		setExportModal(false);
	};

	const exportAction = async (name: string) => {
		exportBankAccounts(name);
	};

	//Data for table ------------------------------------------------------------------------
	const tableTitles = [
		'No. Solicitud',
		'Fecha de Creación',
		'Tipo',
		'Propietario',
		'Cuenta',
		'Estado',
		'Acciones',
	];

	const tableData: DataTableInterface[] = [];

	allCardsRequests?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'No. Solicitud': item?.queryNumber ?? '-',
				'Fecha de Creación': formatDate(item?.createdAt) ?? '-',
				Tipo: translateCardRequestType(item?.priority),
				Propietario: item?.holderName ?? '-',
				Cuenta: item?.account ?? '-',
				Estado: <StatusForCardRequest currentState={item.status} />,
				Acciones: (
					<div className='flex'>
						<div className='mx-1'>
							<Button color='slate-500' textColor='slate-500' icon={<DocumentMagnifyingGlassIcon className='w-5' />} name={"Detalles"}
								action={() => {
									setEditCardRequestModal({ state: true, id: item.id, active: "details", status: null });
								}}></Button>
						</div>
						<div className='mx-1'>
							<Button color='slate-500' textColor='slate-500' icon={<InformationCircleIcon className='w-5' />} name={"Reporte"}
								action={() => {
									setEditCardRequestModal({ state: true, id: item.id, active: "reports", status: null });
								}}></Button>
						</div>
						{
							item?.status === 'PRINTED' ||
								item?.status === 'DENIED' ? null : (
								<div className='mx-1'>
									<Button color='slate-500' textColor='slate-500' icon={<CreditCardIcon className='w-5' />} name={"Cambiar estado"}
										action={() => {
											setEditCardRequestModal({ state: true, id: item.id, active: "changeStatus", status: item.status });
										}}></Button>
								</div>
							)
						}

					</div>
				),
			},
		});
	});

	const searching = {
		action: (search: string) => setFilter({ ...filter, search }),
		placeholder: 'Buscar Solicitud',
	};

	const close = () => setEditCardRequestModal({ state: false, id: null, active: null, status: null });

	const actions = [
		{
			icon: <PlusIcon className='h-5' />,
			title: 'Agregar Solicitud',
			action: () => setAddTicketmodal(true),
		},
		{
			icon: <BsFiletypeXlsx className='h-5' />,
			title: 'Exportar a Excel',
			action: () => setExportModal(true),
		},
	];

	//Breadcrumb-----------------------------------------------------------------------------------
	const paths: PathInterface[] = [
		{
			name: 'Tarjetas',
		},
		{
			name: ' Solicitudes',
		},
	];
	//------------------------------------------------------------------------------------

	const closeAddAccount = () => setAddTicketmodal(false);

	useEffect(() => {
		getAllCardsRequests(filter);
	}, [filter]);


	return (
		<div className=''>
			<Breadcrumb
				icon={<CreditCardIcon className='h-6 text-gray-500' />}
				paths={paths}
			/>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={isLoading}
				searching={searching}
				actions={actions}
				paginateComponent={
					<Paginate
						action={(page: number) => setFilter({ ...filter, page })}
						data={paginate}
					/>
				}
			/>

			{addTicketmodal && (
				<Modal state={addTicketmodal} close={setAddTicketmodal}>
					<NewCardRequestModal
						close={closeAddAccount}
						contactModal={false}
						addBulkCardRequest={addBulkCardRequest}
						isFetching={isFetching}
						addSimpleCardRequest={addSimpleCardRequest}
					/>
				</Modal>
			)}
			{editCardRequestModal.state && (
				<Modal state={editCardRequestModal.state} close={close} size='m'>
					<EditCardRequestContainer
						updateCardStatus={updateCardStatus}
						cardRequestRecords={cardRequestRecords}
						acceptRequest={acceptRequest}
						id={editCardRequestModal.id}
						editCardRequest={editCardRequest}
						deleteCardRequest={deleteCardRequest}
						isFetching={isFetching}
						closeModal={close}
						allCardsRequests={allCardsRequests}
						cardRequest={cardRequest}
						isLoading={isLoading}
						getCardRequest={getCardRequest}
						setSelectedDataToParent={setSelectedDataToParent}
						active={editCardRequestModal.active}
						status={editCardRequestModal.status ?? null}
					/>
				</Modal>
			)}

			{exportModal && (
				<Modal state={exportModal} close={setExportModal}>
					<ExcelFileExport
						exportAction={exportAction}
						loading={loadingExport}
					/>
				</Modal>
			)}
		</div>
	);
};

export default CardRequests;

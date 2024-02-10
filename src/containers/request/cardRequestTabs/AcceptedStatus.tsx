import {
	PlusIcon,
} from '@heroicons/react/24/outline';
import GenericTable, {
	DataTableInterface,
} from '../../../components/misc/GenericTable';
import Paginate from '../../../components/misc/Paginate';
import Modal from '../../../components/modals/GenericModal';
import { useEffect, useState } from 'react';
import useServerCardsRequests from '../../../api/userServerCardsRequests';
import StatusForCardRequest from '../../../components/misc/StatusForCardRequest';
import { translateCardRequestType } from '../../../utils/translateCardStatus';
import { formatDate } from '../../../utils/helpersAdmin';
import BulkCardRequestModal from '../CardRequestModal/BulkCardRequestModal';
import SimpleCardRequestModal from '../CardRequestModal/SimpleCardRequestModal';
import { useForm, SubmitHandler } from "react-hook-form";
import Select from '../../../components/forms/Select';
import TextArea from '../../../components/forms/TextArea';
import Button from '../../../components/misc/Button';
import { TrashIcon, CheckIcon, NoSymbolIcon, } from '@heroicons/react/24/outline';
import { deleteUndefinedAttr } from '../../../utils/helpers';
import Input from '../../../components/forms/Input';
import AlertContainer from '../../../components/misc/AlertContainer';
import AsyncComboBox from '../../../components/forms/AsyncCombobox';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPrint,
} from "@fortawesome/free-solid-svg-icons";
import GenericList from '../../../components/misc/GenericList';
import { translateOrderState } from '../../../utils/translate';

const AcceptedStatus = () => {

	const CRUD = useServerCardsRequests();

	const [filter, setFilter] = useState<Record<string, string | number | boolean | null>>({ page: 1, status: "ACCEPTED" });
	const [simpleCardRequestModal, setSimpleCardRequestModal] = useState(false);
	const [bulkCardRequestModal, setBulkCardRequestModal] = useState(false);
	const [editCardRequestModal, setEditCardRequestModal] = useState<{
		state: boolean;
		id: number;
	}>({ state: false, id: 0 });

	useEffect(() => {
		CRUD.getAllCardsRequests(filter);
	}, [filter]);

	//Data for table ------------------------------------------------------------------------------

	const tableTitles = [
		'Fecha de Solicitud',
		'Titular',
		'Cantidad',
		'Categoría',
		'Entidad',
		'Negocio',
		'No. Cuenta',
		'Tipo',
		'Estado',
	];

	const tableData: DataTableInterface[] = [];

	CRUD?.allCardsRequests?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'Fecha de Solicitud': formatDate(item?.createdAt) ?? '-',
				'Titular': item?.holderName ?? '-',
				'Cantidad': item?.quantity,
				'Categoría': item?.category?.name ?? '-',
				'Entidad': item?.issueEntity?.name ? item?.issueEntity?.name : '',
				'No. Cuenta': item?.accounts[0]?.address ?? '-',
				'Tipo': translateCardRequestType(item?.priority),
				'Estado': <StatusForCardRequest currentState={item.status} />,
			},
		});
	});

	const searching = {
		action: (search: string) => setFilter({ ...filter, search }),
		placeholder: 'Buscar Solicitud',
	};

	const actions = [
		{
			icon: <PlusIcon className='h-5' />,
			title: 'Agregar Solicitud Simple',
			action: () => setSimpleCardRequestModal(true),
		},
		{
			icon: <PlusIcon className='h-5' />,
			title: 'Agregar Solicitud por Bulto',
			action: () => setBulkCardRequestModal(true),
		},
	];

	const closeSimpleRequestModal = () => setSimpleCardRequestModal(false);
	const closeBulkRequestModal = () => setBulkCardRequestModal(false);

	const rowAction = (id: number) => {
		setEditCardRequestModal({ state: true, id });
	};

	return (
		<div className=''>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={CRUD?.isLoading}
				//searching={searching}
				actions={actions}
				rowAction={rowAction}
				paginateComponent={
					<Paginate
						action={(page: number) => setFilter({ ...filter, page })}
						data={CRUD?.paginate}
					/>
				}
			/>


			{/*Modal to Create Simple Card Request*/}
			{simpleCardRequestModal && (
				<Modal state={simpleCardRequestModal} close={setSimpleCardRequestModal}>
					<SimpleCardRequestModal
						close={closeSimpleRequestModal}
					/>
				</Modal>
			)}


			{/*Modal to Create Bulk Card Request*/}
			{bulkCardRequestModal && (
				<Modal state={bulkCardRequestModal} close={setBulkCardRequestModal}>
					<BulkCardRequestModal
						close={closeBulkRequestModal}
					/>
				</Modal>
			)}

			{/*Modal to Edit Card Request*/}
			{editCardRequestModal && (
				<Modal state={editCardRequestModal?.state} close={setEditCardRequestModal} size='b'>
					<div className="min-h-96">
						<ModalCardRequest close={() => setEditCardRequestModal({ state: false, id: 0 })} CRUD={CRUD}
							id={editCardRequestModal?.id} />
					</div>
				</Modal>
			)}

		</div>
	);
};

export default AcceptedStatus;


interface propsDestructured {
	CRUD: any;
	id: number;
	close: Function;
}

const ModalCardRequest = ({ CRUD, id, close }: propsDestructured) => {

	const cardRequest: any = CRUD.allCardsRequests.find((item: any) => item.id === id);

	function accepted() {
		CRUD.updateCardStatus(id, { status: 'PRINTED' }, close);
	}

	return (
		<>
			<div className="flex">
				<div>
					<p className='mb-4 font-semibold text-lg'>
						Solicitud {cardRequest?.queryNumber}
					</p>
					{cardRequest?.quantity === 1 && (
						<p className='mb-4 font-semibold text-lg'>
							Simple ( cantidad: 1 )
						</p>
					)}
					{cardRequest?.quantity > 1 && (
						<>
							<p className='mb-4 font-semibold text-lg'>
								Por bulto ( cantidad: <span>{cardRequest?.quantity}</span> )
							</p>
						</>
					)}
				</div>
				<div className="flex justify-end items-center grow">
					<div className="flex justify-end items-center grow">
						<div className="mx-10 flex gap-5">

							{cardRequest?.status === "ACCEPTED" && (
								<Button
									iconAfter={<FontAwesomeIcon icon={faPrint} className='h-5 text-green-600' />}
									color={'green-200'}
									action={() => accepted()}
									name='Imprimir'
									textColor='green-600'
								/>
							)}

						</div>

					</div>

				</div>
			</div>
			<GenericList
				body={{
					'Nombre del propietario': cardRequest?.holderName ?? '-',

					'Prioridad': cardRequest?.priority,

					'Estado': translateOrderState(cardRequest?.status) ?? '',

					'Entidad': cardRequest?.issueEntity?.name ?? '-',

					'Categoría': cardRequest?.category?.name ?? '-',

					'Observaciones': cardRequest?.observations,
				}}
			></GenericList>


		</>
	)
};


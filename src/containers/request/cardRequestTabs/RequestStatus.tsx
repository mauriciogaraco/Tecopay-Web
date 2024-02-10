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

const RequestStatus = () => {

	const CRUD = useServerCardsRequests();

	const [filter, setFilter] = useState<Record<string, string | number | boolean | null>>({ page: 1, status: "REQUESTED" });
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

	const customSort = (a: any, b: any) => {
		if (a.status === "REQUESTED" && b.status !== "REQUESTED") {
			return -1; // a comes first
		} else if (a.status !== "REQUESTED" && b.status === "REQUESTED") {
			return 1; // b comes first
		} else if (a.status === "REQUESTED" && b.status === "REQUESTED") {
			// Both have status REQUESTED, now compare priority
			if (a.priority === "EXPRESS" && b.priority !== "EXPRESS") {
				return -1; // a comes first
			} else if (a.priority !== "EXPRESS" && b.priority === "EXPRESS") {
				return 1; // b comes first
			}
		}
		// If status and priority are the same or not REQUESTED, maintain current order
		return 0;
	};

	let requests = CRUD?.allCardsRequests?.sort(customSort);

	requests?.map((item: any) => {
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

export default RequestStatus;



interface propsDestructured {
	close: Function;
	CRUD: any;
	id: number
}

const ModalCardRequest = ({ CRUD, id, close }: propsDestructured) => {

	console.log(id);

	const cardRequest: any = CRUD.allCardsRequests.find((item: any) => item.id === id);
	const [delAction, setDelAction] = useState(false);

	const { control, handleSubmit } = useForm<Record<string, string | number>>();

	let dataCardStatus: any;

	const onSubmit: SubmitHandler<Record<string, string | number | null>> = (dataToSubmit) => {

		if (dataToSubmit.priority === 'Expresa') {
			dataCardStatus = { ...dataToSubmit, priority: 'EXPRESS' };
		}
		if (dataToSubmit.priority === 'Normal') {
			dataCardStatus = { ...dataToSubmit, priority: 'NORMAL' };
		}

		CRUD.editCardRequest(id, deleteUndefinedAttr(dataCardStatus ?? []), () => { });

		close();
	};
	function denied() {
		CRUD.updateCardStatus(id, { status: 'DENIED' }, close);
	}

	function accepted() {
		CRUD.updateCardStatus(id, { status: 'ACCEPTED' }, close);
	}

	const priorityData = [
		{ id: 1, name: 'Normal', code: "NORMAL" },
		{ id: 2, name: 'Expresa', code: "EXPRESS" },
	]

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
					<div className="mx-10 flex gap-5">
						<Button
							icon={<NoSymbolIcon className='h-5 text-red-600' />}
							color={'red-200'}
							action={() => denied()}
						/>
						{cardRequest?.status === "REQUESTED" && (
							<Button
								icon={<CheckIcon className='h-5 text-green-600' />}
								color={'green-200'}
								action={() => accepted()}
							/>
						)}

					</div>

				</div>
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-4">
					{cardRequest?.quantity === 1 && (
						<Input
							label='Nombre del propietario'
							name='holderName'
							defaultValue={cardRequest?.holderName ?? '-'}
							control={control}
						></Input>
					)}
					{cardRequest?.quantity > 1 && (
						<p className='mb-4 font-semibold text-lg'>
							Por bulto ( cantidad: <span>{cardRequest?.quantity}</span> )
						</p>
					)}
					<div className="flex gap-4">
						<div className="w-1/2">
							<Select
								defaultValue={priorityData?.find((priority: any) => priority.code === cardRequest?.priority)?.name}
								control={control}
								name='priority'
								label='Prioridad'
								data={priorityData}
							></Select>
						</div>
						<div className="w-1/2">
							<AsyncComboBox
								name='categoryId'
								normalizeData={{ id: 'id', name: 'name' }}
								control={control}
								label='Categoría'
								dataQuery={{ url: `/entity/${cardRequest?.issueEntity?.id}/categories` }}
								defaultItem={{ id: cardRequest?.category?.id, name: cardRequest?.category?.name }}
							></AsyncComboBox>
						</div>
					</div>

					<TextArea
						name='observations'
						defaultValue={cardRequest?.observations}
						rules={{ required: 'Campo requerido' }}
						control={control}
						label='Observaciones'
					></TextArea>

					<div className="flex justify-between">
						<Button
							color="slate-500"
							action={() => {
								setDelAction(true);
							}}
							name="Eliminar solicitud"
							outline
							textColor="text-red-500"
							iconAfter={<TrashIcon className='text-red-500  w-4 h-4' />}
							type={'button'}
						/>
						<Button
							name='Actualizar'
							color='slate-600'
							type='submit'
							loading={CRUD.isLoading}
						/>
					</div>
				</div>
			</form>
			{delAction && (
				<Modal state={delAction} close={setDelAction}>
					<AlertContainer
						onAction={() => CRUD.deleteCardRequest(id, close)}
						onCancel={setDelAction}
						title={`Eliminar solicitud ${cardRequest?.queryNumber}`}
						text='¿Seguro que desea eliminar esta solicitud del sistema?'
						loading={CRUD.isFetching}
					/>
				</Modal>
			)}
		</>
	);
}

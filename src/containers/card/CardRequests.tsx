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
import useServerCardsRequests from '../../api/userServerCardsRequests';
import StatusForCardRequest from '../../components/misc/StatusForCardRequest';
import { translateCardRequestType } from '../../utils/translateCardStatus';
import { formatDate } from '../../utils/helpersAdmin';
import ModalCardRequest from './CardRequestModal/ModalCardRequest'
import { type SubmitHandler, useForm } from 'react-hook-form';
import TextArea from '../../components/forms/TextArea';
import { deleteUndefinedAttr } from '../../utils/helpers';
import Input from '../../components/forms/Input';
import Button from '../../components/misc/Button';
import Select from '../../components/forms/Select';
import AsyncComboBox from '../../components/forms/AsyncCombobox';
import userServerAccounts from "../../api/userServerAccounts"

const CardRequests = () => {

	const CRUD = useServerCardsRequests();

	const [filter, setFilter] = useState<Record<string, string | number | boolean | null>>({ page: 1 });
	const [simpleCardRequestModal, setSimpleCardRequestModal] = useState(false);
	const [bulkCardRequestModal, setBulkCardRequestModal] = useState(false);
	const [editCardRequestModal, setEditCardRequestModal] = useState<{
		state: boolean;
		id: number;
	}>({ state: false, id: 0 });

	useEffect(() => {
		CRUD.getAllCardsRequests(filter);
	}, [filter]);

	//Breadcrumb-----------------------------------------------------------------------------------

	const paths: PathInterface[] = [
		{
			name: 'Tarjetas',
		},
		{
			name: ' Solicitudes',
		},
	];

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
	
	//let allCardsRequestsFiltered = CRUD?.allCardsRequests?.filter((objeto:any) => objeto.status === "REQUESTED" || objeto.status === "DENIED");

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
				'No. Cuenta': item?.account?.address ?? '-',
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
			<Breadcrumb
				icon={<CreditCardIcon className='h-6 text-gray-500' />}
				paths={paths}
			/>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={CRUD?.isLoading}
				searching={searching}
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
						isFetching={CRUD?.isFetching}
						addSimpleCardRequest={CRUD.addSimpleCardRequest}
					/>
				</Modal>
			)}


			{/*Modal to Create Bulk Card Request*/}
			{bulkCardRequestModal && (
				<Modal state={bulkCardRequestModal} close={setBulkCardRequestModal}>
					<BulkCardRequestModal
						close={closeBulkRequestModal}
						isFetching={CRUD?.isFetching}
						addBulkCardRequest={CRUD.addBulkCardRequest}
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

export default CardRequests;





interface propsSimpleDestructured {
	close: Function;
	addSimpleCardRequest: Function;
	isFetching: boolean;
}

const SimpleCardRequestModal = ({
	addSimpleCardRequest,
	close,
	isFetching,
}: propsSimpleDestructured) => {

	const { control, handleSubmit } = useForm();
	const [associate, setAssociate] = useState('none');
	const [entity, setEntity] = useState<Record<string, string | number>>({});
	const [account, setAccount] = useState<Record<string, string | number> | null>({});
	let dataTosend: any;

	function resetAssociate(params: string) {
		setEntity({});
		setAccount(null);
		setAssociate(params);
	}

	const { getAccount } = userServerAccounts();

	function getEntityFromAccount(params: any) {
		getAccount(params.id).then(
			(resp) => { setAccount(resp?.issueEntity?.id) }
		)
	}

	const onSubmit: SubmitHandler<
		Record<string, string | number | boolean | string[]>
	> = (data) => {

		if (associate === 'Entidad') {
			delete data.accountId;
		} else if (associate === 'Cuenta') {
			delete data.issueEntityId;
		}

		if (data.priority === 'Normal')
			dataTosend = {
				...data,
				priority: 'NORMAL',
			};
		else
			dataTosend = {
				...data,
				priority: 'EXPRESS',
			};
		delete dataTosend.associate;
		addSimpleCardRequest(deleteUndefinedAttr(dataTosend), close);
	};


	return (
		<main>
			<div>
				<p className='mb-4 font-semibold text-lg text-center'>
					Nueva solicitud Simple
				</p>


				<form
					className='flex flex-col gap-y-5'
					onSubmit={handleSubmit(onSubmit)}
				>

					<Input
						name='holderName'
						label='Titular'
						placeholder='Nombre del Titular'
						control={control}
						rules={{
							required: 'Campo requerido',
							maxLength: {
								value: 50,
								message: 'El nombre de titular debe tener como máximo 50 carácteres'
							}
						}}
					></Input>

					<Select
						control={control}
						name='priority'
						rules={{ required: 'Campo requerido' }}
						label='Prioridad'
						data={[
							{ id: 1, name: 'Normal' },
							{ id: 2, name: 'Express' },
						]}
					></Select>

					<Select
						control={control}
						name='associate'
						rules={{ required: 'Campo requerido' }}
						label='Asociar a:'
						data={[
							{ id: 1, name: 'Entidad' },
							{ id: 2, name: 'Cuenta' },
						]}
						setSelectedToParent={resetAssociate}
					></Select>

					{associate === 'Entidad' && (
						<>
							<AsyncComboBox
								rules={{ required: 'Campo requerido' }}
								name='issueEntityId'
								normalizeData={{ id: 'id', name: 'name' }}
								control={control}
								label='Entidad'
								dataQuery={{ url: '/entity' }}
								setSelectedDataToParent={setEntity}
							></AsyncComboBox>
							{entity?.id && (
								<AsyncComboBox
									rules={{ required: 'Campo requerido' }}
									name='categoryId'
									normalizeData={{ id: 'id', name: 'name' }}
									control={control}
									label='Categoría'
									dataQuery={{ url: `/categories/${entity?.id}` }}
								></AsyncComboBox>
							)}


						</>
					)}

					{associate === 'Cuenta' && (
						<>
							<AsyncComboBox
								rules={{ required: 'Campo requerido' }}
								name='accountId'
								normalizeData={{ id: 'id', name: 'address' }}
								control={control}
								label='Cuenta'
								dataQuery={{ url: '/account' }}
								setSelectedDataToParent={getEntityFromAccount}
							></AsyncComboBox>
							{account && (
								<AsyncComboBox
									rules={{ required: 'Campo requerido' }}
									name='categoryId'
									normalizeData={{ id: 'id', name: 'name' }}
									control={control}
									label='Categoría'
									dataQuery={{ url: `/categories/${account}` }}
								></AsyncComboBox>
							)}
						</>
					)}
					<div className='h-full'>
						<TextArea
							name='observations'
							control={control}
							paddingInput='py-0'
							label='Observaciones'
							rules={{
								maxLength: {
									value: 150,
									message: 'las observaciones deben tener como máximo 150 carácteres'
								}
							}}
						></TextArea>
					</div>

					<div className='flex self-end'>
						<Button
							name='Insertar'
							color='slate-600'
							type='submit'
							loading={isFetching}
							disabled={isFetching}
						/>
					</div>
				</form>
			</div>
		</main>
	);
};

interface propsBulkDestructured {
	close: Function;
	addBulkCardRequest: Function;
	isFetching: boolean;
}

const BulkCardRequestModal = ({
	close,
	addBulkCardRequest,
	isFetching,
}: propsBulkDestructured) => {
	const { control, handleSubmit } = useForm();
	const [associate, setAssociate] = useState('none');
	const [entity, setEntity] = useState<Record<string, string | number>>({});
	const [account, setAccount] = useState<Record<string, string | number> | null>({});
	let dataTosend: any;

	function resetAssociate(params: string) {
		setEntity({});
		setAccount(null);
		setAssociate(params);
	}

	const { getAccount } = userServerAccounts();

	function getEntityFromAccount(params: any) {
		getAccount(params.id).then(
			(resp) => { setAccount(resp?.issueEntity?.id) }
		)
	}

	const onSubmit: SubmitHandler<
		Record<string, string | number | boolean | string[]>
	> = (data) => {

		if (associate === 'Entidad') {
			delete data.accountId;
		} else if (associate === 'Cuenta') {
			delete data.issueEntityId;
		}

		if (data.priority === 'Normal')
			dataTosend = {
				...data,
				priority: 'NORMAL',
			};
		else
			dataTosend = {
				...data,
				priority: 'EXPRESS',
			};
		delete dataTosend.associate;
		addBulkCardRequest(deleteUndefinedAttr(dataTosend), close);
	};

	return (
		<main>
			<div>
				<p className='mb-4 font-semibold text-lg text-center'>
					Nueva solicitud por Bulto
				</p>
				<form
					className='flex flex-col gap-y-5'
					onSubmit={handleSubmit(onSubmit)}
				>

					<Input
						name='quantity'
						label='Cantidad'
						placeholder='Cantidad'
						control={control}
						rules={{ required: 'Campo requerido' }}
					></Input>

					<Select
						control={control}
						name='priority'
						label='Prioridad'
						data={[
							{ id: 1, name: 'Normal' },
							{ id: 2, name: 'Express' },
						]}
					></Select>

					<Select
						control={control}
						name='associate'
						rules={{ required: 'Campo requerido' }}
						label='Asociar a:'
						data={[
							{ id: 1, name: 'Entidad' },
							{ id: 2, name: 'Cuenta' },
						]}
						setSelectedToParent={resetAssociate}
					></Select>

					{associate === 'Entidad' && (
						<>
							<AsyncComboBox
								rules={{ required: 'Campo requerido' }}
								name='issueEntityId'
								normalizeData={{ id: 'id', name: 'name' }}
								control={control}
								label='Entidad'
								dataQuery={{ url: '/entity' }}
								setSelectedDataToParent={setEntity}
							></AsyncComboBox>
							{entity?.id && (
								<AsyncComboBox
									rules={{ required: 'Campo requerido' }}
									name='categoryId'
									normalizeData={{ id: 'id', name: 'name' }}
									control={control}
									label='Categoría'
									dataQuery={{ url: `/categories/${entity?.id}` }}
								></AsyncComboBox>
							)}


						</>
					)}

					{associate === 'Cuenta' && (
						<>
							<AsyncComboBox
								rules={{ required: 'Campo requerido' }}
								name='accountId'
								normalizeData={{ id: 'id', name: 'address' }}
								control={control}
								label='Cuenta'
								dataQuery={{ url: '/account' }}
								setSelectedDataToParent={getEntityFromAccount}
							></AsyncComboBox>
							{account && (
								<AsyncComboBox
									rules={{ required: 'Campo requerido' }}
									name='categoryId'
									normalizeData={{ id: 'id', name: 'name' }}
									control={control}
									label='Categoría'
									dataQuery={{ url: `/categories/${account}` }}
								></AsyncComboBox>
							)}
						</>
					)}
					<div className='h-full'>
						<TextArea
							name='observations'
							control={control}
							paddingInput='py-0'
							label='Observaciones'
							rules={{
								maxLength: {
									value: 150,
									message: 'las observaciones deben tener como máximo 150 carácteres'
								}
							}}
						></TextArea>
					</div>



					<div className='flex self-end'>
						<Button
							name='Insertar'
							color='slate-600'
							type='submit'
							loading={isFetching}
							disabled={isFetching}
						/>
					</div>
				</form>
			</div>
		</main>
	);
};


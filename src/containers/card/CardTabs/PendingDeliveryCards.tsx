import GenericTable, {
	DataTableInterface,
	FilterOpts,
} from '../../../components/misc/GenericTable';
import Paginate from '../../../components/misc/Paginate';
import Modal from '../../../components/modals/GenericModal';
import { useState, useEffect } from 'react';
import { formatCardNumber } from '../../../utils/helpers';
import StatusForCard from '../../../components/misc/StatusForCard';
import useServerCards from '../../../api/userServerCards';
import Button from '../../../components/misc/Button';
import AsyncComboBox from '../../../components/forms/AsyncCombobox';
import { useForm, SubmitHandler } from "react-hook-form";
import Toggle from "../../../components/forms/Toggle";
import Input from '../../../components/forms/Input';
import useServerAccounts from '../../../api/userServerAccounts';


const PendingDelivery = () => {

	const CRUD = useServerCards();

	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});
	const [requestToDeliver, setRequestToDeliver] = useState<{
		state: boolean;
		id: number;
	}>({ state: false, id: 0 });

	useEffect(() => {
		CRUD.getAllCards({ isDelivered: 'false', ...filter });
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


	CRUD.allCards?.items?.map((item: any) => {
		tableData.push({
			rowId: item?.id,
			payload: {
				'No. Tarjeta': formatCardNumber(item?.address),
				'No. Cuenta': formatCardNumber(item?.account?.address),
				'Titular': item?.holderName ?? '-',
				'Categoría': item?.category?.name ?? '-',
				'Entidad': item?.account?.issueEntity?.name ?? '-',
				'Estado': <StatusForCard currentState={item.isDelivered} />,
			},
		});
	});

	const close = () => setRequestToDeliver({ state: false, id: 0 });

	const rowAction = (id: number) => {
		setRequestToDeliver({ state: true, id });
	};

	//---------------------------------------------------------------------------------------

	const availableFilters: FilterOpts[] = [
		{
			format: "datepicker-range",
			name: "Rango de fecha",
			filterCode: "dateRange",
			datepickerRange: [
				{
					isUnitlToday: true,
					filterCode: "createdFrom",
					name: "Desde",
				},
				{
					isUnitlToday: true,
					filterCode: "createdTo",
					name: "Hasta",
				},
			],
		},
		{
			format: "select",
			filterCode: "businessId",
			name: "Negocio",
			asyncData: {
				url: "/business",
				idCode: "id",
				dataCode: ["name"],
			},
		},
		{
			format: "select",
			filterCode: "issueEntityId",
			name: "Entidad",
			asyncData: {
				url: "/entity",
				idCode: "id",
				dataCode: ["name"],
			},
		},
		{
			format: "select",
			filterCode: "accountId",
			name: "Cuenta",
			asyncData: {
				url: `/account`,
				idCode: "id",
				dataCode: ["address"],
			},
		},

	];

	const filterAction = (data: any) => {
		data ? setFilter({ ...data, isDelivered: 'false' }) : setFilter({ page: 1, isDelivered: 'false' });
	};

	//------------------------------------------------------------------------------------

	return (
		<div>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={CRUD.isLoading}
				rowAction={rowAction}
				filterComponent={{ availableFilters, filterAction }}
				paginateComponent={
					<Paginate
						action={(page: number) => setFilter({ ...filter, page })}
						data={CRUD.paginate}
					/>
				}
			/>

			{requestToDeliver.state && (
				<Modal state={requestToDeliver.state} close={close} size='b'>
					<DeliveryCardModal
						id={requestToDeliver.id}
						close={close}
						CRUD={CRUD}
					/>
				</Modal>
			)}
		</div>
	);
};

export default PendingDelivery;


interface UserWizzardInterface {
	id: number;
	close: Function;
	CRUD: any
}

const DeliveryCardModal = ({
	id, close, CRUD
}: UserWizzardInterface) => {

	const { control, handleSubmit, watch } = useForm<Record<string, string | number>>();

	const onSubmit: SubmitHandler<Record<string, string | number | null>> = (dataToSubmit) => {
		CRUD.deliverCard(id, dataToSubmit, close);

		//Charge(deleteUndefinedAttr(dataTosend), id, closeModal)
		close();
	};

	let { recharge } = watch();
	console.log(watch().recharge)
	return (
		<>
			<p className='mb-4 font-semibold text-lg'>
				Entregar tarjeta
			</p>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-4">
					<AsyncComboBox
						rules={{ required: 'Campo requerido' }}
						name='ownerId'
						normalizeData={{ id: 'id', name: 'fullName' }}
						control={control}
						label='Nombre'
						dataQuery={{ url: '/user' }}
					></AsyncComboBox>
					<div>
						<Toggle
							name="recharge"
							control={control}
							defaultValue={false}
							title="Recargar cuenta"
						/>
						{recharge && (
							<Input
								name='amount'
								label='Cantidad'
								type='number'
								placeholder='0.00'
								rules={{
									required: 'Campo requerido',
									validate: (value) => {
										if (parseInt(value) === 0) {
											return 'El valor no puede ser cero';
										}
										return true;
									},
								}}
								control={control}
							></Input>
						)}
					</div>


					<Button
						name='Entregar'
						color='slate-600'
						type='submit'
						loading={false}
					/>
				</div>


			</form>
		</>
	);
}





import { PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import GenericTable, {
	type DataTableInterface,
} from '../../components/misc/GenericTable';
import useServerAccounts from '../../api/userServerAccounts';
import Paginate from '../../components/misc/Paginate';
import Modal from '../../components/modals/GenericModal';
import Breadcrumb, {
	type PathInterface,
} from '../../components/navigation/Breadcrumb';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { saveAccountId } from '../../store/slices/accountSlice';
import { useNavigate } from 'react-router-dom';
import NewAccountModal from './NewAccount/NewAccountModal';
import { formatCardNumber } from '../../utils/helpers';
import SearchCriteriaComponent, {
	BasicTypeFilter,
	DateTypeFilter,
	SelectTypeFilter,
  } from "../../components/misc/SearchCriteriaComponent";
  import { FieldValues, SubmitHandler } from "react-hook-form";
  import { deleteUndefinedAttr } from '../../utils/helpers';
  import {
	BasicType
  } from "../../interfaces/InterfacesLocal";
  import { formatDate } from '../../utils/helpersAdmin';

const Accounts = () => {
	const {
		paginate,
		isLoading,
		allAccounts,
		getAllAccounts,
		addAccount,
	} = useServerAccounts();

	const [addAccountModal, setAddAccountModal] = useState(false);
	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	useEffect(() => {
		getAllAccounts(filter);
	}, [filter]);

	// Breadcrumb-----------------------------------------------------------------------------------

	const paths: PathInterface[] = [
		{
			name: 'Cuentas',
		},
	];
	
	// Data for table ------------------------------------------------------------------------------

	const tableTitles = [
		'Fecha de Activación',
		'Número de Cuenta',
		'Propietario',
		'Entidad',
		'Negocio',
		'',
	];

	const tableData: DataTableInterface[] = [];
	allAccounts?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				'Fecha de Activación': formatDate(item?.createdAt) ?? '-',
				'No.': item.id,
				'Número de Cuenta': `${formatCardNumber(item?.address)}`,
				'Nombre': item?.name,
				'Propietario': item?.owner?.fullName ? item?.owner?.fullName : '-',
				'Entidad': item?.issueEntity?.name,
				'Negocio': item?.issueEntity?.business?.name ? item?.issueEntity?.business?.name : '-',
			},
		});
	});


	const actions = [
		{
			icon: <PlusIcon className='h-5' />,
			title: 'Agregar cuenta',
			action: () => {
				setAddAccountModal(true);
			},
		},
	];

	const rowAction = (id: number) => {
		dispatch(saveAccountId(id));
		navigate('details');
	};


	const closeAddAccount = () => {
		setAddAccountModal(false);
	};
	
	 //Submit form ----------------------------------------------------------------------------------
	 const onSubmit: SubmitHandler<BasicType> = (data) => {
		if (Object.keys(data).length > 0) {
		  const allFilters = deleteUndefinedAttr({
			...data,
		  });
		  setFilter(allFilters);
		} else setFilter({});
	  };
	  console.log('filter')
	  console.log(filter)
	 //Management filters ------------------------------------------------------------------------
	 const availableFilters: (
		| BasicTypeFilter
		| DateTypeFilter
		| SelectTypeFilter
	  )[] = [];
	
	  availableFilters.push(
		{
		  name: "dateRange",
		  isRequired: true,
		  label: "Rango de fechas",
		  type: "datepicker-range",
		  datepickerRange: [
			{
			  name: "dateFrom",
			  label: "Desde",
			  isUnitlToday: true,
			},
			{
			  name: "dateTo",
			  label: "Hasta",
			  isUnitlToday: true,
			},
		  ],
		},
		//{
		//  label: "Origen",
		//  name: "origin",
		//  type: "multiselect",
		//  data: [
		//	{ name: "Puntos de venta", id: "pos" },
		//	{ name: "Tienda online", id: "online" },
		//  ],
		//},
		//{
		//  label: "Incluir órdenes consumo casa",
		//  name: "includeHouseCostedOrder",
		//  type: "boolean",
		//},
		//{
		//  label: "Entidad",
		//  name: "issueEntityId",
		//  type: "select",
		//  asyncData: {
		//	url: "/entity",
		//	dataCode: ["id", "lastName", "email"],
		//	defaultParams: { page: 1 },
		//	idCode: "id",
		//  },
		//},
		{
		  label: "Entidad",
		  name: "issueEntityId",
		  type: "select",
		  asyncData: {
			url: "/entity",
			dataCode: "name",
			defaultParams: { page: 1 },
			idCode: "id",
		  },
		}
	  );
	
	  //---------------------------------------------------------------------------------------


	return (
		<div>
			<Breadcrumb
				icon={<UserCircleIcon className='h-6 text-gray-500' />}
				paths={paths}
			/>

			<SearchCriteriaComponent
				filterAction={(data: FieldValues) => onSubmit(data)}
				filters={availableFilters}
			/>

			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={isLoading}
				//actions={actions}
				rowAction={rowAction}
				// filterComponent={{ availableFilters, filterAction }}
				paginateComponent={
					<Paginate
						action={(page: number) => {
							setFilter({ ...filter, page });
						}}
						data={paginate}
					/>
				}
			/>

			{addAccountModal && (
				<Modal state={addAccountModal} close={setAddAccountModal}>
					<NewAccountModal
						close={closeAddAccount}
						isLoading={isLoading}
						addAccount={addAccount}
					/>
				</Modal>
			)}
		</div>
	);
};

export default Accounts;

import { PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import GenericTable, {
	DataTableInterface,
	FilterOpts,
} from '../../components/misc/GenericTable';
import useServerAccounts from '../../api/userServerAccounts';
import Paginate from '../../components/misc/Paginate';
import Modal from '../../components/modals/GenericModal';
import Breadcrumb, {
	type PathInterface,
} from '../../components/navigation/Breadcrumb';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { saveAccountId } from '../../store/slices/accountSlice';
import { useNavigate } from 'react-router-dom';
import NewAccountModal from './NewAccount/NewAccountModal';
import { formatCardNumber } from '../../utils/helpers';
import { formatDate } from '../../utils/helpersAdmin';
import { BasicType } from '../../interfaces/InterfacesLocal';
import useServerEntity from '../../api/userServerEntity';

const Accounts = () => {
	const {
		paginate,
		isLoading,
		allAccounts,
		getAllAccounts,
		addAccount,
	} = useServerAccounts();

	const [addAccountModal, setAddAccountModal] = useState(false);
	const [searchLoading, setSearchLoading] = useState(false);
	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});
	const { getAllBussinnes, business } = useServerEntity();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { entities } = useAppSelector((state) => state.Entity)

	useEffect(() => {
		getAllAccounts(filter);
	}, []);

	useEffect(() => {
		getAllBussinnes();
	}, []);

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

	//filter_________________________________________________________________________________________________

	type filterAccounts = {
		business?: number;
		entities?: number[];
		owner?: number;
		dateFrom?: Date;
		dateTo?: Date;
		search?: string;
	}

	const [finalData, setFinalData] = useState([...allAccounts]);

	useEffect(() => {
		setFinalData([...allAccounts]);
	}, [allAccounts]);

	function filterProcessor(filter: filterAccounts) {
		console.log(filter)
		console.log(allAccounts)

		let final_data = [...allAccounts]

		if (filter?.search) {
			final_data = findAddress( final_data, filter?.search)
		}
		console.log(final_data)

		if (filter?.entities) {
			final_data = final_data.filter(objeto => objeto.issueEntity?.id === filter?.entities)
		}

		if (findNameById(filter?.business)) {
			final_data = final_data.filter(objeto => objeto.issueEntity?.business?.name === findNameById(filter?.business));
		}

		if (filter.dateFrom !== undefined && filter.dateTo !== undefined) {
			final_data = final_data.filter(obj => new Date(obj.createdAt) >= new Date(filter.dateFrom ?? 0) && new Date(obj.createdAt) <= new Date(new Date(filter.dateTo ?? 0)));
		}

		setFinalData(final_data);
	}

	const findNameById = (id: number | undefined) => {
		if (!id) return null;
		const matchedObject = business?.find((obj: { id: number, name: string }) => obj.id === id);
		console.log('matchedObject ' + matchedObject)
		return matchedObject ? matchedObject.name : null;
	};

	function findAddress(arrayDeObjetos: any[], direccionBuscada: string) {
		//setSearchLoading(true);
		for (let i = 0; i < arrayDeObjetos.length; i++) {
			if (arrayDeObjetos[i].address === direccionBuscada.replace(/\s/g, '')) {
				return [arrayDeObjetos[i]];
			}
		}
		//setSearchLoading(false);
		return [];
	}

	//filter_________________________________________________________________________________________________

	const tableData: DataTableInterface[] = [];
	finalData?.map((item: any) => {
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


	//const actions = [
	//	{
	//		icon: <PlusIcon className='h-5' />,
	//		title: 'Agregar cuenta',
	//		action: () => {
	//			setAddAccountModal(true);
	//		},
	//	},
	//];

	const rowAction = (id: number) => {
		dispatch(saveAccountId(id));
		navigate('details');
	};


	const closeAddAccount = () => {
		setAddAccountModal(false);
	};

	//---------------------------------------------------------------------------------------

	let measureSelectorData = [{ id: 1, name: 'Juan' }, { id: 2, name: 'Pepe' }];


	const availableFilters: FilterOpts[] = [
		//Filter by productCategories index 0
		{
			format: "datepicker-range",
			name: "Rango de fecha",
			filterCode: "dateRange",
			datepickerRange: [
				{
					isUnitlToday: true,
					filterCode: "dateFrom",
					name: "Desde",
				},
				{
					isUnitlToday: true,
					filterCode: "dateTo",
					name: "Hasta",
				},
			],
		},
		{
			format: 'select',
			filterCode: 'business',
			name: 'Negocio',
			data: business,
		},
		{
			format: 'select',
			filterCode: 'owner',
			name: 'Propietario',
			data: measureSelectorData,
		},
		{
			format: 'select',
			filterCode: 'entities',
			name: 'Entidad',
			data: entities,
		},
	];

	/*
	{
			format: "select",
			filterCode: "movedById",
			name: "Usuario",
			asyncData: {
				url: "/security/users",
				idCode: "id",
				dataCode: ["displayName", "email", "username"],
			},
		},
		{
			format: 'input',
			filterCode: 'disponibilityFrom',
			name: 'Cantidad disponible hasta',
		},
		{
			format: 'boolean',
			filterCode: 'showForSale',
			name: 'Listos para vender',
		},
		{
			format: "multiselect",
			filterCode: "entities",
			name: "Entidad",
			data: entities,
		},
	
	*/

	const filterAction = (data: filterAccounts) => {
		//data ? setFilter({ ...filter, ...data }) : setFilter({ page: 1 });
		data && filterProcessor(data);
	};

	//---------------------------------------------------------------------------------------


	return (
		<div>
			<Breadcrumb
				icon={<UserCircleIcon className='h-6 text-gray-500' />}
				paths={paths}
			/>

			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={isLoading || searchLoading}
				//actions={actions}
				rowAction={rowAction}
				searching={{
					action: (value: string) => filterAction({ ...filter, search: value }),
					placeholder: 'Buscar Cuenta',
				}}
				filterComponent={{ availableFilters, filterAction }}
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

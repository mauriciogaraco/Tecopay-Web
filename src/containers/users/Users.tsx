import { PlusIcon, UsersIcon } from '@heroicons/react/24/outline';

import GenericTable, {
	type DataTableInterface,
	type FilterOpts,
} from '../../components/misc/GenericTable';
import useServerUsers from '../../api/userServerUsers';

import Paginate from '../../components/misc/Paginate';
import Modal from '../../components/modals/GenericModal';
import Breadcrumb, {
	type PathInterface,
} from '../../components/navigation/Breadcrumb';
import {
	BasicType,
	type SelectInterface,
} from '../../interfaces/InterfacesLocal';

import { useEffect, useState } from 'react';
//import NewUserModal from './NewUser/NewUserModal';
import { data } from '../../utils/TemporaryArrayData';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
//import EditUserContainer from './editUserWizzard/EditUserContainer';
import BlockedStateForTable from '../../components/misc/BlockedStateForTable';
import StateSpanForTable from '../../components/misc/StateSpanForTable';

import { useNavigate } from 'react-router-dom';
import { Item } from '../../interfaces/UsersInterfaces';
import NewUserModal from './NewUser/NewUserModalVariantOne';
import NewUserModalVariantOne from './NewUser/NewUserModalVariantOne';
import NewUserModalVariantTwo from './NewUser/NewUserModalVariantTwo';
import EditUserModal from './editUseWizzard/EditUserModal';

const exists = true;

const Users = () => {
	const {
		paginate,
		isLoading,
		isFetching,
		allUsers,
		user,
		getAllUsers,
		getUser,
		editUser,
		deleteUser,
		registerUser,
		addFromTecopos,
	} = useServerUsers();

	const [filter, setFilter] = useState<
		Record<string, string | number | boolean | null>
	>({});
	const [addUsermodal, setAddUsermodal] = useState(false);
	const [selectedOption, setSelectedOption] = useState('');
	// const [exportModal, setExportModal] = useState(false);

	/* useEffect(() => {
			  getAllClients(filter);
			}, [filter]); */

	// Data for table ------------------------------------------------------------------------
	const tableTitles = ['Nombre', 'Correo Electrónico', 'Entidad', 'Roles'];
	const tableData: DataTableInterface[] = [];

	allUsers?.map((item: Item) => {
		tableData.push({
			rowId: item.id,
			payload: {
				Nombre: item?.fullName,
				Entidad: item?.issueEntity?.name ?? '-',
				'Correo Electrónico': item.email ?? '-',
				Roles: item.roles[0].name,
			},
		});
	});

	const navigate = useNavigate();

	const searching = {
		action: (search: string) => {
			setFilter({ ...filter, search });
		},
		placeholder: 'Buscar usuario',
	};
	const close = () => {
		setEditUserModal({ state: false, id: null });
	};
	const actions = [
		{
			icon: <PlusIcon className='h-5' />,
			title: 'Agregar usuario',
			action: () => {
				setAddUsermodal(true);
			},
		},
	];

	const rowAction = (id: number) => {
		setEditUserModal({ state: true, id });
	};

	// Breadcrumb-----------------------------------------------------------------------------------
	const paths: PathInterface[] = [
		{
			name: 'Usuarios',
		},
	];
	// ------------------------------------------------------------------------------------
	const [nuevoUserModal, setNuevoUserModal] = useState(false);
	const [contactModal, setContactModal] = useState(false);
	const [editUserModal, setEditUserModal] = useState<{
		state: boolean;
		id: number | null;
	}>({ state: false, id: null });

	const closeAddUser = () => {
		setAddUsermodal(false);
	};

	useEffect(() => {
		getAllUsers(filter);
		console.log(allUsers);
	}, [filter]);

	return (
		<div>
			<Breadcrumb
				icon={<UsersIcon className='h-6 text-gray-500' />}
				paths={paths}
			/>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={isLoading}
				searching={searching}
				actions={actions}
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

			{editUserModal.state && (
				<Modal state={editUserModal.state} close={setEditUserModal}>
					<h3 className='p-4 text-xl md:text-2xl'>Editar usuario</h3>
					<EditUserModal
						close={closeAddUser}
						isLoading={isLoading}
						editUser={editUser}
						getUser={getUser}
						id={editUserModal.id}
						user={user}
					/>
				</Modal>
			)}
			{addUsermodal && (
				<Modal state={addUsermodal} close={setAddUsermodal}>
					<div className='flex flex-col gap-4'>
						<h3 className='p-4 text-xl md:text-2xl'>Nuevo usuario</h3>
						<div className=' flex gap-4 items-center'>
							<input
								type='radio'
								value='option1'
								checked={selectedOption === 'option1'}
								onChange={(e) => setSelectedOption(e.target.value)}
							/>
							Nuevo registro de usuario
						</div>
						<div className=' flex gap-4 items-center'>
							<input
								type='radio'
								value='option2'
								checked={selectedOption === 'option2'}
								onChange={(e) => setSelectedOption(e.target.value)}
							/>
							Añadir usuario del ecosistema de Tecopos
						</div>
						{selectedOption === 'option1' && (
							<NewUserModalVariantOne
								close={closeAddUser}
								isLoading={isLoading}
								registerUser={registerUser}
							/>
						)}
					</div>
					{selectedOption === 'option2' && (
						<NewUserModalVariantTwo
							close={closeAddUser}
							isLoading={isLoading}
							addFromTecopos={addFromTecopos}
						/>
					)}
				</Modal>
			)}
		</div>
	);
};

export default Users;

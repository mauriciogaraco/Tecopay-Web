import { useState, createContext, useEffect } from 'react';
import DetailUserEditComponent from './DetailEntityEditComponent';
import Fetching from '../../../components/misc/Fetching';
import TabNav from '../../../components/navigation/TabNav';
import useServerUser from '../../../api/userServerAccounts';
import { redirect, useNavigate } from 'react-router-dom';
import useServerEntity from '../../../api/userServerEntity';

interface UserWizzardInterface {
	id: number | null;
	editEntity: Function;
	deleteEntity: Function;
	isFetching: boolean;
	closeModal: Function;
}

const EditEntityContainer = ({
	id,
	editEntity,
	deleteEntity,
	isFetching,
	closeModal,
}: UserWizzardInterface) => {
	const { getEntity, entity, isLoading } = useServerEntity();

	useEffect(() => {
		id && getEntity(id);
	}, []);

	//------------------------------------------------------------------------------------------------------

	if (isLoading)
		return (
			<div className='h-96'>
				<Fetching />
			</div>
		);
	return (
		<div className=''>
			<div className='flex items-center justify-around'>
				<h1 className='ml-2 text-lg'>Editar entidad {id}</h1>{' '}
			</div>

			<DetailUserEditComponent
				id={id}
				editEntity={editEntity}
				deleteEntity={deleteEntity}
				entity={entity}
				closeModal={closeModal}
				isFetching={isFetching}
			/>
		</div>
	);
};

export default EditEntityContainer;

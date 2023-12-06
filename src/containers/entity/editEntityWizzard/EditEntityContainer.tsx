import { useState, createContext, useEffect } from 'react';
import DetailUserEditComponent from './DetailEntityEditComponent';
import Fetching from '../../../components/misc/Fetching';
import TabNav from '../../../components/navigation/TabNav';
import useServerUser from '../../../api/userServerAccounts';
import { redirect, useNavigate } from 'react-router-dom';
import useServerEntity from '../../../api/userServerEntity';
import Loading from '../../../components/misc/Loading';

interface UserWizzardInterface {
	id: number | null;
	editEntity: Function;
	deleteEntity: Function;
	isFetching: boolean;
	closeModal: Function;
	getEntity: Function;
	setAllEntity: Function;
	isLoading: boolean;
	entity: any;
	allEntity: any;
}

const EditEntityContainer = ({
	id,
	editEntity,
	deleteEntity,
	isFetching,
	closeModal,
	getEntity,
	setAllEntity,
	isLoading,
	entity,
	allEntity,
}: UserWizzardInterface) => {
	useEffect(() => {
		id && getEntity(id);
	}, []);

	//------------------------------------------------------------------------------------------------------

	if (isLoading)
		return (
			<div className=''>
				<Loading h={96} />
			</div>
		);
	return (
		<div className=''>
			<div className='flex items-center justify-around'>
				<p className='mb-4 font-semibold text-lg text-center'>
					Editar entidad {id}
				</p>
			</div>

			<DetailUserEditComponent
				id={id}
				editEntity={editEntity}
				deleteEntity={deleteEntity}
				entity={entity}
				closeModal={closeModal}
				isFetching={isFetching}
				setAllEntity={setAllEntity}
				allEntity={allEntity}
			/>
		</div>
	);
};

export default EditEntityContainer;

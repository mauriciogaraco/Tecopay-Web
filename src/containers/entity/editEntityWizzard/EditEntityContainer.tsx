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

	//Tabs data --------------------------------------------------------------------------------------------
	const [currentTab, setCurrentTab] = useState('edit');
	const tabs = [
		{
			name: `Editar cuenta ${id}`,
			href: 'edit',
			current: currentTab === 'edit',
		},
		{
			name: `Detalles de cuenta ${id}`,
			href: 'details',
			current: currentTab === 'details',
		},
	];

	const action = (href: string) => setCurrentTab(href);

	const navigate = useNavigate();

	{
		currentTab === 'details' && (() => navigate('/Detalles'));
	}

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
				<h1 className='ml-2 text-lg'>Editar cuenta {id}</h1>{' '}
				<button
					onClick={() => navigate('Detalles')}
					className=' hover:bg-blue-500 transition-all ease-in-out duration-200 bg-blue-400 p-2 rounded-md'
				>
					Detalles
				</button>
			</div>
			{/*isFetching && <Fetching />}
      <TabNav tabs={tabs} action={action} />*/}
			{currentTab === 'edit' && (
				<DetailUserEditComponent
					id={id}
					editEntity={editEntity}
					deleteEntity={deleteEntity}
					entity={entity}
					closeModal={closeModal}
					isFetching={isFetching}
				/>
			)}
		</div>
	);
};

export default EditEntityContainer;

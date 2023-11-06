import { useState, createContext, useEffect } from 'react';
import Fetching from '../../../components/misc/Fetching';
import TabNav from '../../../components/navigation/TabNav';
import useServerUser from '../../../api/userServerAccounts';
import { redirect, useNavigate } from 'react-router-dom';
import useServerEntity from '../../../api/userServerEntity';
import DetailCardEditComponent from './DetailCardComponent';

interface UserWizzardInterface {
	id: number | null;
	editCard: Function;
	deleteCard: Function;
	isFetching: boolean;
	closeModal: Function;
}

const EditCardContainer = ({
	id,
	editCard,
	deleteCard,
	isFetching,
	closeModal,
}: UserWizzardInterface) => {
	const { getEntity, entity, isLoading } = useServerEntity();

	useEffect(() => {
		id && getEntity(id);
	}, []);

	// Tabs data --------------------------------------------------------------------------------------------
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

	const action = (href: string) => {
		setCurrentTab(href);
	};

	const navigate = useNavigate();

	{
		currentTab === 'details' &&
			(() => {
				navigate('/Detalles');
			});
	}

	// ------------------------------------------------------------------------------------------------------

	if (isLoading)
		return (
			<div className='h-96'>
				<Fetching />
			</div>
		);
	return (
		<div className=''>
			<div className='flex items-center justify-around'>
				<h1 className='ml-2 text-lg'>Editar Entidad {id}</h1>
			</div>
			{/* isFetching && <Fetching />}
      <TabNav tabs={tabs} action={action} /> */}
			{currentTab === 'edit' && (
				<DetailCardEditComponent
					id={id}
					editCard={editCard}
					deleteCard={deleteCard}
					Entity={entity}
					closeModal={closeModal}
					isFetching={isFetching}
				/>
			)}
		</div>
	);
};

export default EditCardContainer;

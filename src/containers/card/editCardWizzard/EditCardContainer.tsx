import { useState, createContext, useEffect } from 'react';
import Fetching from '../../../components/misc/Fetching';
import TabNav from '../../../components/navigation/TabNav';
import useServerUser from '../../../api/userServerAccounts';
import { redirect, useNavigate } from 'react-router-dom';
import useServerEntity from '../../../api/userServerEntity';
import DetailCardComponent from './DetailCardComponent';
import useServerCards from '../../../api/userServerCards';

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
	const { getCard, card, isLoading } = useServerCards();

	useEffect(() => {
		id && getCard(id);
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
			name: `Detalles de tarjeta ${id}`,
			href: 'tarjetas',
			current: currentTab === 'tarjetas',
		},
	];

	const action = (href: string) => {
		setCurrentTab(href);
	};

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
				<DetailCardComponent
					id={id}
					editCard={editCard}
					deleteCard={deleteCard}
					Card={card}
					closeModal={closeModal}
					isFetching={isFetching}
				/>
			)}
		</div>
	);
};

export default EditCardContainer;

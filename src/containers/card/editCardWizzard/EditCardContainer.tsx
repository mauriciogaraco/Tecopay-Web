import { useState, createContext, useEffect } from 'react';
import Fetching from '../../../components/misc/Fetching';
import EditDetailCardComponent from './EditDetailCardComponent';
import DetailCardComponent from './DetailCardComponent';
import Button from '../../../components/misc/Button';
import {
	DocumentMagnifyingGlassIcon,
	InformationCircleIcon,
	PencilSquareIcon,
} from '@heroicons/react/24/outline';
import TabNav from '../../../components/navigation/TabNav';

interface UserWizzardInterface {
	id: number | null;
	editCard: Function;
	deleteCard: Function;
	isFetching: boolean;
	closeModal: Function;
	allCards: any;
	card: any;
	getCard: Function;
	isLoading: Boolean;
	setSelectedDataToParent: any;
}

const EditCardContainer = ({
	id,
	editCard,
	deleteCard,
	isFetching,
	closeModal,
	allCards,
	card,
	getCard,
	isLoading,
	setSelectedDataToParent,
}: UserWizzardInterface) => {
	const [editModal, setEditModal] = useState(false);
	const [currentTab, setCurrentTab] = useState('details');

	const tabs = [
		{
			icon: <DocumentMagnifyingGlassIcon className='w-5' />,
			name: 'Detalles',
			href: 'details',
			current: currentTab === 'details',
		},
		{
			icon: <PencilSquareIcon className='w-5' />,
			name: 'Editar',
			href: 'Editar',
			current: currentTab === 'Editar',
		},
	];

	if (isLoading)
		return (
			<div className='h-96'>
				<Fetching />
			</div>
		);
	else
		return (
			<div className=''>
				<TabNav action={setCurrentTab} tabs={tabs} />
				{currentTab == 'details' ? (
					<div>
						<div className=''>
							<DetailCardComponent id={id} allCards={allCards} />
						</div>
					</div>
				) : (
					<EditDetailCardComponent
						id={id}
						editCard={editCard}
						deleteCard={deleteCard}
						closeModal={closeModal}
						isFetching={isFetching}
						allCards={allCards}
						setSelectedDataToParent={setSelectedDataToParent}
					/>
				)}
			</div>
		);
};

export default EditCardContainer;

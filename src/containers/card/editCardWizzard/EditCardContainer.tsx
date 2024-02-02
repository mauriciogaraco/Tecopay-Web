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
import Loading from '../../../components/misc/Loading';

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
	deliverCard: Function;
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
	deliverCard,
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
			<div className='relative top-0'>
				<Loading />
			</div>
		);
	else
		return (
			<div className=''>
				<TabNav action={setCurrentTab} tabs={tabs} />
				{currentTab == 'details' ? (
					<div>
						<div className=''>
							<DetailCardComponent
								deliverCard={deliverCard}
								id={id}
								allCards={allCards.items}
							/>
						</div>
					</div>
				) : (
					<EditDetailCardComponent
						id={id}
						editCard={editCard}
						deleteCard={deleteCard}
						closeModal={closeModal}
						isFetching={isFetching}
						allCards={allCards.items}
						setSelectedDataToParent={setSelectedDataToParent}
					/>
				)}
			</div>
		);
};

export default EditCardContainer;

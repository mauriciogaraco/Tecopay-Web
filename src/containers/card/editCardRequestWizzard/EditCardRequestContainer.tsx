import { useState, createContext, useEffect } from 'react';
import Fetching from '../../../components/misc/Fetching';
import DetailCardComponent from './DetailCardRequestComponent';
import Button from '../../../components/misc/Button';
import EditDetailCardRequestComponent from './EditDetailCardRequestComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TabNav from '../../../components/navigation/TabNav';
import { faBoxesStacked } from '@fortawesome/free-solid-svg-icons';

import DetailCardRequestComponent from './DetailCardRequestComponent';
import {
	DocumentMagnifyingGlassIcon,
	InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface UserWizzardInterface {
	id: number | null;
	editCardRequest: Function;
	deleteCardRequest: Function;
	isFetching: boolean;
	closeModal: Function;
	allCardsRequests: any;
	cardRequest: any;
	getCardRequest: Function;
	isLoading: Boolean;
	setSelectedDataToParent: any;
	acceptRequest: Function;
	cardRequestRecords: any;
}

const EditCardRequestContainer = ({
	id,
	editCardRequest,
	deleteCardRequest,
	isFetching,
	closeModal,
	allCardsRequests,
	cardRequest,
	getCardRequest,
	isLoading,
	setSelectedDataToParent,
	acceptRequest,
	cardRequestRecords,
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
			icon: <InformationCircleIcon className='w-5' />,
			name: 'Reportes',
			href: 'Reportes',
			current: currentTab === 'Reportes',
		},
	];

	if (isLoading)
		return (
			<div className='h-96'>
				<Fetching />
			</div>
		);

	return (
		<div className=''>
			<TabNav action={setCurrentTab} tabs={tabs} />
			{currentTab == 'details' ? (
				<DetailCardRequestComponent
					acceptRequest={acceptRequest}
					id={id}
					editCardRequest={editCardRequest}
					deleteCardRequest={deleteCardRequest}
					closeModal={closeModal}
					isFetching={isFetching}
					allCardsRequests={allCardsRequests}
					setSelectedDataToParent={setSelectedDataToParent}
				/>
			) : (
				<EditDetailCardRequestComponent
					cardRequestRecords={cardRequestRecords}
					id={id}
					editCardRequest={editCardRequest}
					deleteCardRequest={deleteCardRequest}
					cardRequest={cardRequest}
					closeModal={closeModal}
					isFetching={isFetching}
					allCardsRequests={allCardsRequests}
					setSelectedDataToParent={setSelectedDataToParent}
				/>
			)}
		</div>
	);
};

export default EditCardRequestContainer;

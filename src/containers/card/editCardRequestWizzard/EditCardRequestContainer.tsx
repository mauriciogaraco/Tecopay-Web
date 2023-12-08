import { useState } from 'react';
import EditDetailCardRequestComponent from './EditDetailCardRequestComponent';
import TabNav from '../../../components/navigation/TabNav';

import DetailCardRequestComponent from './DetailCardRequestComponent';
import {
	DocumentMagnifyingGlassIcon,
	InformationCircleIcon,
} from '@heroicons/react/24/outline';
import Loading from '../../../components/misc/Loading';

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
	updateCardStatus: Function;
}

const EditCardRequestContainer = ({
	id,
	editCardRequest,
	deleteCardRequest,
	updateCardStatus,
	isFetching,
	closeModal,
	allCardsRequests,
	cardRequest,
	isLoading,
	setSelectedDataToParent,
	cardRequestRecords,
}: UserWizzardInterface) => {

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
			<div className=''>
				<Loading h={96} />
			</div>
		);

	return (
		<div className=''>
			<TabNav action={setCurrentTab} tabs={tabs} />
			{currentTab === 'details' ? (
				<DetailCardRequestComponent
					updateCardStatus={updateCardStatus}
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

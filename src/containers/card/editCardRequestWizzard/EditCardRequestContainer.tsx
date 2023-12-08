import Reports from './Reports';

import Details from './Details';

import Loading from '../../../components/misc/Loading';
import ChangeStateContainer from './ChangeStateContainer';

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
	active: string | null;
	status?: string | null;
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
	active,
	status
}: UserWizzardInterface) => {


	if (isLoading)
		return (
			<div className=''>
				<Loading h={96} />
			</div>
		);


	return (
		<div className=''>
			{active === 'details' ? (
				<Details
					updateCardStatus={updateCardStatus}
					id={id}
					editCardRequest={editCardRequest}
					deleteCardRequest={deleteCardRequest}
					closeModal={closeModal}
					isFetching={isFetching}
					allCardsRequests={allCardsRequests}
					setSelectedDataToParent={setSelectedDataToParent}
				/>
			) : active === 'reports' ? (
				<Reports
					cardRequestRecords={cardRequestRecords}
					isFetching={isFetching}
					setSelectedDataToParent={setSelectedDataToParent}
				/>
			) : active === 'changeStatus' && (
				<ChangeStateContainer
					isLoading={isFetching}
					cardRequest={status}
					closeModal={closeModal}
					id={id}
					updateCardStatus={updateCardStatus}
				></ChangeStateContainer>
			)}
		</div>
	);
};

export default EditCardRequestContainer;

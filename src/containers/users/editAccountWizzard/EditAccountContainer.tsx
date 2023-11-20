import { useState, createContext, useEffect } from 'react';
import DetailUserEditComponent from './DetailAccountEditComponent';
import Fetching from '../../../components/misc/Fetching';
import TabNav from '../../../components/navigation/TabNav';
import useServerAccounts from '../../../api/userServerAccounts';
import { redirect, useNavigate } from 'react-router-dom';
import useServerCards from '../../../api/userServerCards';
import DetailAccountEditComponent from './DetailAccountEditComponent';

interface UserWizzardInterface {
	id: number | null;
	editAccount: Function;
	deleteAccount: Function;
	isFetching: boolean;
	closeModal: Function;
	getAccount: Function;
	isLoading: Boolean;
	account: any;
	allAccounts: any;
}

const EditAccountContainer = ({
	id,
	editAccount,
	allAccounts,
	isFetching,
	closeModal,
	getAccount,
	isLoading,
	deleteAccount,
	account,
}: UserWizzardInterface) => {
	useEffect(() => {
		id && getAccount(id);
	}, []);

	//Tabs data --------------------------------------------------------------------------------------------

	{
		//currentTab === 'details' && (() => navigate('/Detalles'));
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
			{/*isFetching && <Fetching />}
      <TabNav tabs={tabs} action={action} />*/}

			<DetailAccountEditComponent
				allAccounts={allAccounts}
				id={id}
				editAccount={editAccount}
				deleteAccount={deleteAccount}
				account={account}
				closeModal={closeModal}
				isFetching={isFetching}
			/>
		</div>
	);
};

export default EditAccountContainer;

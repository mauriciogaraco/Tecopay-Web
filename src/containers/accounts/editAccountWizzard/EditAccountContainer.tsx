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
	setSelectedDataToParent: Function;
	allAccounts: any;
	selectedDataToParent: any;
	setSelectedDataToParentTwo: any;
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
	setSelectedDataToParent,
	selectedDataToParent,
	setSelectedDataToParentTwo,
}: UserWizzardInterface) => {
	useEffect(() => {
		id && getAccount(id);
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
				<DetailAccountEditComponent
					allAccounts={allAccounts}
					selectedDataToParent={selectedDataToParent}
					id={id}
					editAccount={editAccount}
					deleteAccount={deleteAccount}
					account={account}
					closeModal={closeModal}
					isFetching={isFetching}
					setSelectedDataToParent={setSelectedDataToParent}
					setSelectedDataToParentTwo={setSelectedDataToParentTwo}
				/>
			)}
		</div>
	);
};

export default EditAccountContainer;

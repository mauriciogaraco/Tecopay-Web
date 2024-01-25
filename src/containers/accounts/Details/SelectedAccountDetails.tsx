import { useState } from 'react';
import GenericList from '../../../components/misc/GenericList';
import { formatCalendar } from '../../../utils/helpersAdmin';
import SpinnerLoading from '../../../components/misc/SpinnerLoading';
import { formatCardNumber } from '../../../utils/helpers';
import { PiHandCoins } from 'react-icons/pi';
import { TbTransferIn } from 'react-icons/tb';
import Modal from '../../../components/modals/GenericModal';
import Transfer from './transactions/Transfer';
import Charge from './transactions/Charge';
import EditAccountContainer from '../editAccountWizzard/EditAccountContainer';
import StatusBadge from '../../../components/misc/badges/StatusBadge';
import {
	PencilSquareIcon,
} from '@heroicons/react/24/outline';

interface PropsInterface {
	isLoading: Boolean;
	account: any;
	charge: Function;
	transfer: Function;
	isFetching: boolean;
	deleteAccount: any;
	editAccount: any;
}

const SelectedAccountDetails = ({
	charge,
	isLoading,
	account,
	transfer,
	isFetching,
	deleteAccount,
	editAccount,
}: PropsInterface) => {
	const [transferModal, setTranferModal] = useState(false);
	const [rechargeModal, setRechargeModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	console.log('account');
	console.log(account);

	const actions = [
		{
			icon: <PencilSquareIcon className='w-10 h-5' />,
			title: 'Editar',
			action: () => {
				setEditModal(true);
			},
		},
		{
			icon: <TbTransferIn className='w-10 h-5' />,
			title: 'Transferir',
			action: () => {
				setTranferModal(true);
			},
		},
		{
			icon: <PiHandCoins className='w-10 h-5' />,
			title: 'Recargar',
			action: () => {
				setRechargeModal(true);
			},
		},

	];
	return isLoading ? (
		<div className='top-20'>
			<SpinnerLoading />
		</div>
	) : (
		<>
			{account && (
				<GenericList
					actions={actions}
					header={{ title: `Detalles de ${account.name}` }}
					body={{
						'Fecha de activación': `${formatCalendar(account?.createdAt ?? '-')}`,

						'No. cuenta': `${formatCardNumber(account?.address ?? '-')}`,

						'Propietario': account?.owner?.fullName ?? '-',

						'Entidad': account?.issueEntity.name ?? '-',

						'Negocio': account?.currency ?? '-',

						'Balance': account?.amount ?? '-',

						'Estado': <StatusBadge status={account.isActive ? 'ACTIVE' : "INACTIVE"} />,
					}}
				></GenericList>
			)}

			{transferModal && (
				<Modal state={transferModal} close={setTranferModal}>
					<Transfer
						Transfer={transfer}
						isFetching={isFetching}
						defaultAddress={parseInt(account?.address)}
						closeModal={() => setTranferModal(false)}
					></Transfer>
				</Modal>
			)}

			{rechargeModal && (
				<Modal state={rechargeModal} close={setRechargeModal}>
					<Charge
						Charge={charge}
						isFetching={isFetching}
						defaultAddress={parseInt(account?.address)}
						closeModal={() => setRechargeModal(false)}
					></Charge>
				</Modal>
			)}
			{editModal && (
				<Modal state={editModal} close={setEditModal} size='m' >
					<EditAccountContainer
						deleteAccount={deleteAccount}
						account={account}
						editAccount={editAccount}
						isFetching={isFetching}
						closeModal={() => setEditModal(false)}
					/>
				</Modal>
			)}
		</>
	);
};

export default SelectedAccountDetails;

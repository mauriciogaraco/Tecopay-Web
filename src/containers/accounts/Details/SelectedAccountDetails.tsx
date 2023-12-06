import React, { useEffect, useState } from 'react';
import GenericList from '../../../components/misc/GenericList';
import { useAppSelector } from '../../../store/hooks';
import { formatCalendar } from '../../../utils/helpersAdmin';
import Loading from '../../../components/misc/Loading';
import { formatCardNumber } from '../../../utils/helpers';
import { PiHandCoins } from 'react-icons/pi';
import { TbTransferIn } from 'react-icons/tb';
import Modal from '../../../components/modals/GenericModal';
import Transfer from './transactions/Transfer';
import Charge from './transactions/Charge';

interface PropsInterface {
	id: number | string | null;
	isLoading: Boolean;
	account: any;
	charge: Function;
	transfer: Function;
	isFetching: boolean;
	getAccount: Function;
}

const SelectedAccountDetails = ({
	id,
	charge,
	isLoading,
	account,
	transfer,
	isFetching,
	getAccount,
}: PropsInterface) => {
	const [transferModal, setTranferModal] = useState(false);
	const [rechargeModal, setRechargeModal] = useState(false);

	const actions = [
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
		<div className='relative bottom-20'>
			<Loading />
		</div>
	) : (
		<>
			{account && (
				<GenericList
					actions={actions}
					header={{ title: `Detalles de cuenta ${id}` }}
					body={{
						'No. cuenta': `${formatCardNumber(account?.address ?? '-')}`,

						'Fecha de emisión': `${formatCalendar(account?.createdAt ?? '-')}`,
						'Creada por': `${account?.createdBy.fullName ?? '-'}`,

						Código: `${account?.code ?? '-'}`,
						Moneda: account?.currency ?? '-',
						Balance: account?.amount ?? '-',
						Propietario: account?.owner?.fullName ?? '-',

						Entidad: account?.issueEntity.name ?? '-',

						Descripción: account?.description ?? '-',
					}}
				></GenericList>
			)}

			{transferModal && (
				<Modal state={transferModal} close={setTranferModal}>
					<Transfer
						getAccount={getAccount}
						id={id}
						Transfer={transfer}
						isFetching={isFetching}
						defaultAddress={parseInt(account?.address)}
					></Transfer>
				</Modal>
			)}

			{rechargeModal && (
				<Modal state={rechargeModal} close={setRechargeModal}>
					<Charge
						getAccount={getAccount}
						id={id}
						Charge={charge}
						isFetching={isFetching}
						defaultAddress={parseInt(account?.address)}
					></Charge>
				</Modal>
			)}
		</>
	);
};

export default SelectedAccountDetails;

import React, { useEffect, useState } from 'react';
import GenericList from '../../../components/misc/GenericList';
import { useAppSelector } from '../../../store/hooks';
import { formatDate } from '../../../utils/helpersAdmin';
import Loading from '../../../components/misc/Loading';
import { formatCardNumber } from '../../../utils/helpers';

interface PropsInterface {
	id: number | string | null;
	isLoading: Boolean;
	account: any;
}

const SelectedAccountDetails = ({
	id,

	isLoading,
	account,
}: PropsInterface) => {
	return isLoading ? (
		<div className='relative bottom-20'>
			<Loading />
		</div>
	) : (
		<>
			{account && (
				<GenericList
					header={{ title: `Detalles de cuenta ${id}` }}
					body={{
						'No. cuenta': `${formatCardNumber(account.address)}`,

						'Fecha de emisión': `${formatDate(account?.createdAt)}`,
						'Creada por': `${account?.createdBy.fullName ?? '-'}`,

						Código: `${account?.code ?? '-'}`,
						Moneda: account?.currency ?? '-',
						Propietario: account?.owner?.fullName,

						Entidad: account?.issueEntity.name,

						'Usuarios permitidos': account.allowedUsers ?? '-',
						Descripción: account.description,
					}}
				></GenericList>
			)}
		</>
	);
};

export default SelectedAccountDetails;

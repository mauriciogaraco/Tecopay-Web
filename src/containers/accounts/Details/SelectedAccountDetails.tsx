import React, { useEffect, useState } from 'react';
import GenericList from '../../../components/misc/GenericList';
import { useAppSelector } from '../../../store/hooks';
import { formatDate } from '../../../utils/helpersAdmin';
import Loading from '../../../components/misc/Loading';

interface PropsInterface {
	id: number | string | null;
	getAccount: Function;
	isLoading: Boolean;
	account: any;
}

const SelectedAccountDetails = ({
	id,
	getAccount,
	isLoading,
	account,
}: PropsInterface) => {
	return isLoading ? (
		<Loading />
	) : (
		<>
			{account && (
				<GenericList
					header={{ title: `Detalles de cuenta ${id}` }}
					body={{
						'No. cuenta': `${account.address}`,

						'Fecha de emisión': `${formatDate(account?.createdAt)}`,
						'Creada por': `${account?.createdById ?? '-'}`,
						Dirección: `${account?.address}`,
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

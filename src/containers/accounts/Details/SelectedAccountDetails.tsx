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
						'No. cuenta': `${account.data.address}`,

						'Fecha de emisión': `${formatDate(account?.data.createdAt)}`,
						'Creada por': `${account?.data.createdById}`,
						Dirección: `${account?.data.address}`,
						Código: `${account?.data.code}`,
						Moneda: account?.data.name,
						Propietario: '******** me retorna el ID',

						Entidad: '****** me retorna el ID',

						'Usuarios permitidos': '************** NO existe este campo',
						Descripción: account.data.description,
					}}
				></GenericList>
			)}
		</>
	);
};

export default SelectedAccountDetails;

import { useState } from 'react';
import Input from '../../../components/forms/Input';
import Button from '../../../components/misc/Button';
import { deleteUndefinedAttr, validateEmail } from '../../../utils/helpers';
import Toggle from '../../../components/forms/Toggle';
import { type SubmitHandler, useForm } from 'react-hook-form';
import useServerUser from '../../../api/userServerAccounts';
import {
	AccountData,
	UserInterface,
} from '../../../interfaces/ServerInterfaces';
import { TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../../../components/modals/GenericModal';
import AlertContainer from '../../../components/misc/AlertContainer';
import {
	type BasicType,
	type SelectInterface,
} from '../../../interfaces/InterfacesLocal';
import TextArea from '../../../components/forms/TextArea';
import Select from '../../../components/forms/Select';
import ComboBox from '../../../components/forms/Combobox';
import AsyncComboBox from '../../../components/forms/AsyncCombobox';
import useServerCards from '../../../api/userServerCards';
import GenericTable, {
	DataTableInterface,
} from '../../../components/misc/GenericTable';
import BlockedStateForTable from '../../../components/misc/BlockedStateForTable';
import CreatedStateForTable from '../../../components/misc/CreatedStateForTable';
import StatusForCardRequest from '../../../components/misc/StatusForCardRequest';
import { formatCalendar } from '../../../utils/helpersAdmin';

interface EditInterface {
	cardRequest: any;
	editCardRequest: Function;
	deleteCardRequest: Function;
	closeModal: Function;
	isFetching: boolean;
	id: number | null;
	allCardsRequests: any;
	setSelectedDataToParent: any;
	cardRequestRecords: any;
}

const EditDetailCardRequestComponent = ({
	editCardRequest,
	deleteCardRequest,
	cardRequest,
	closeModal,
	isFetching,
	id,
	allCardsRequests,
	cardRequestRecords,
}: EditInterface) => {
	//Data for table ------------------------------------------------------------------------
	const tableTitles = ['Fecha', 'Estado', 'Resgistrado Por'];
	const tableData: DataTableInterface[] = [];
	cardRequestRecords?.map((item: any) => {
		tableData.push({
			rowId: item.id,
			payload: {
				Fecha: formatCalendar(item.updatedAt),
				Estado: <StatusForCardRequest currentState={item.status} />,
				'Resgistrado Por': item?.issuedBy?.fullName ?? '-',
			},
		});
	});

	return (
		<>
			<GenericTable
				tableData={tableData}
				tableTitles={tableTitles}
				loading={isFetching}
				//searching={searching}
				//actions={actions}
				//rowAction={rowAction}
				//filterComponent={{ availableFilters, filterAction }}
			/>
		</>
	);
};

export default EditDetailCardRequestComponent;

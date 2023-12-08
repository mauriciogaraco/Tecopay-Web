import { SubmitHandler, useForm } from 'react-hook-form';
import { BasicType } from '../../../interfaces/InterfacesLocal';
import { deleteUndefinedAttr } from '../../../utils/helpers';
import Select from '../../../components/forms/Select';
import Button from '../../../components/misc/Button';
import { translateOrderState } from '../../../utils/translate';
import { useState } from 'react';

interface updateCardRequest {
	updateCardStatus: Function;
	id: number | null;
	closeModal: Function;
	cardRequest: any;
	isLoading: boolean;
}

const ChangeStateContainer = ({
	updateCardStatus,
	id,
	closeModal,
	cardRequest,
	isLoading,
}: updateCardRequest) => {

	const [selectedToParent, setSelectedToParent] = useState();
	const isDisabled = selectedToParent === 'Pedida';
	let dataToSend: any;
	const { control, handleSubmit, reset } = useForm();

	const onSubmit: SubmitHandler<BasicType> = (data) => {
		try {
			if (data.status === 'Aceptada') {
				dataToSend = { status: 'ACCEPTED' };
			} else if (data.status === 'Impresa') {
				dataToSend = { status: 'PRINTED' };
			} else {
				dataToSend = { status: 'DENIED' };
			}

			updateCardStatus(id, deleteUndefinedAttr(dataToSend), reset()).then(() =>
				closeModal(),
			);
		} catch (error) {}
	};

	return (
		<form className=' gap-4 flex flex-col' onSubmit={handleSubmit(onSubmit)}>
			<Select
				defaultValue={translateOrderState(cardRequest) ?? ''}
				// default={translateOrderState(cardRequest?.status)}
				control={control}
				setSelectedToParent={setSelectedToParent}
				name='status'
				label='Estado'
				data={[
					{ id: 1, name: translateOrderState('PRINTED') },
					{ id: 2, name: translateOrderState('ACCEPTED') },
					{ id: 3, name: translateOrderState('DENIED') },
					{ id: 4, name: translateOrderState('REQUESTED') },
				]}
			/>

			<Button
				disabled={isDisabled}
				name='Actualizar'
				color='slate-600'
				type='submit'
				loading={isLoading}
			/>
		</form>
	);
};

export default ChangeStateContainer;

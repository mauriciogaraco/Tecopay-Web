import { useForm, SubmitHandler } from "react-hook-form";
import { useState, createContext } from "react";
import Select from '../../../components/forms/Select';
import TextArea from '../../../components/forms/TextArea';
import Button from '../../../components/misc/Button';
import { TrashIcon } from '@heroicons/react/24/outline';
import { deleteUndefinedAttr } from '../../../utils/helpers';
import Input from '../../../components/forms/Input';
import { translateOrderState } from '../../../utils/translate';
import Modal from '../../../components/modals/GenericModal';
import AlertContainer from '../../../components/misc/AlertContainer';
import AsyncComboBox from '../../../components/forms/AsyncCombobox';
import GenericList from '../../../components/misc/GenericList';

interface propsDestructured {
	close: Function;
	CRUD: any;
	id: number
}

interface propsDestructured {
	CRUD: any;
	id: number;
	close: Function;
}

const contextData: any = {};
export const ProductContext = createContext(contextData);


const ModalCardRequest = ({ CRUD, id, close }: propsDestructured) => {

	const cardRequest: any = CRUD.allCardsRequests.find((item: any) => item.id === id);
	const [delAction, setDelAction] = useState(false);
	const [selectedToParent, setSelectedToParent] = useState();
	const isDisabled = selectedToParent === 'Denegada';

	const { control, handleSubmit, formState: { errors }, reset } = useForm<Record<string, string | number>>();

	let dataCardStatus: any;
	let dataToSend: any;

	const onSubmit: SubmitHandler<Record<string, string | number | null>> = (dataToSubmit) => {

		if (dataToSubmit.status === 'Aceptada') {
			dataToSend = { status: 'ACCEPTED' };
		} else if (dataToSubmit.status === 'Impresa') {
			dataToSend = { status: 'PRINTED' };
		} else {
			dataToSend = { status: 'DENIED' };
		}
		console.log(dataToSend)
		CRUD.updateCardStatus(id, deleteUndefinedAttr(dataToSend), () => { });

		if (dataToSubmit.priority === 'Expresa') {
			dataCardStatus = { ...dataToSubmit, priority: 'EXPRESS' };
		}
		if (dataToSubmit.priority === 'Normal') {
			dataCardStatus = { ...dataToSubmit, priority: 'NORMAL' };
		}
		console.log(dataCardStatus)
		CRUD.editCardRequest(id, deleteUndefinedAttr(dataCardStatus ?? []), () => { });

		close();
	};
	console.log(cardRequest)
	const priorityData = [
		{ id: 1, name: 'Normal', code: "NORMAL" },
		{ id: 2, name: 'Expresa', code: "EXPRESS" },
	]

	if (cardRequest?.status === 'PRINTED' || cardRequest?.status === "DENIED") {
		return (
			<>
				<GenericList
					header={{ title: `Detalles de solicitud impresa ${cardRequest?.queryNumber}` }}
					body={{
						'Nombre del propietario': cardRequest?.holderName ?? '-',

						'Prioridad': cardRequest?.priority,

						'Estado': translateOrderState(cardRequest?.status) ?? '',

						'Entidad': cardRequest?.issueEntity?.name ?? '-',

						'Categoría': cardRequest?.category?.name ?? '-',

						'Observaciones': cardRequest?.observations,

						'Código de barras': cardRequest?.card[0]?.barCode!,
					}}
				></GenericList>

			</>
		)
	} else {
		return (
			<>
				<p className='mb-4 font-semibold text-lg text-center'>
					Editar solicitud {cardRequest?.queryNumber}
				</p>
				{cardRequest?.quantity === 1 && (
					<p className='mb-4 font-semibold text-lg text-center'>
						Tipo de solicitud: Simple
					</p>
				)}
				{cardRequest?.quantity > 1 && (
					<>
						<p className='mb-4 font-semibold text-lg text-center'>
							Tipo de solicitud: Por bulto ( cantidad: <span>{cardRequest?.quantity}</span> )
						</p>
					</>
				)}
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-4">
						{cardRequest?.quantity === 1 && (
							<Input
								label='Nombre del propietario'
								name='holderName'
								defaultValue={cardRequest?.holderName ?? '-'}
								control={control}
							></Input>
						)}
						<div className="flex gap-4">
							<div className="w-1/2">
								<Select
									defaultValue={priorityData?.find((priority: any) => priority.code === cardRequest?.priority)?.name}
									control={control}
									name='priority'
									label='Prioridad'
									data={priorityData}
								></Select>
							</div>
							<div className="w-1/2">
								{cardRequest?.status == "ACCEPTED" &&
									(<Select
										defaultValue={translateOrderState(cardRequest?.status) ?? ''}
										control={control}
										setSelectedToParent={setSelectedToParent}
										name='status'
										label='Estado'
										disabled={isDisabled}
										data={[
											{ id: 1, name: translateOrderState('PRINTED') },
											{ id: 3, name: translateOrderState('DENIED') },
										]}
									/>)
								}
								{cardRequest?.status == "REQUESTED" &&
									(<Select
										defaultValue={translateOrderState(cardRequest?.status) ?? ''}
										control={control}
										setSelectedToParent={setSelectedToParent}
										name='status'
										label='Estado'
										disabled={isDisabled}
										data={[
											{ id: 2, name: translateOrderState('ACCEPTED') },
											{ id: 3, name: translateOrderState('DENIED') },
										]}
									/>)
								}

							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-1/2">
								<AsyncComboBox
									name='categoryId'
									normalizeData={{ id: 'id', name: 'name' }}
									control={control}
									label='Categoría'
									dataQuery={{ url: `/categories/${cardRequest?.issueEntity?.id}` }}
								></AsyncComboBox>

							</div>
							<div className="w-1/2">

							</div>
						</div>

						<TextArea
							name='observations'
							defaultValue={cardRequest?.observations}
							rules={{ required: 'Campo requerido' }}
							control={control}
							label='Observaciones'
						></TextArea>

						{
							cardRequest?.status !== "PRINTED" && (
								<div className="flex justify-between">
									<Button
										color="slate-500"
										action={() => {
											setDelAction(true);
										}}
										name="Eliminar solicitud"
										outline
										textColor="text-red-500"
										iconAfter={<TrashIcon className='text-red-500  w-4 h-4' />}
										type={'button'}
									/>
									<Button
										name='Actualizar'
										color='slate-600'
										type='submit'
										loading={CRUD.isLoading}
									/>
								</div>
							)
						}
					</div>
				</form>
				{delAction && (
					<Modal state={delAction} close={setDelAction}>
						<AlertContainer
							onAction={() => CRUD.deleteCardRequest(id, close)}
							onCancel={setDelAction}
							title={`Eliminar tarjeta ${cardRequest?.queryNumber}`}
							text='¿Seguro que desea eliminar esta tarjeta del sistema?'
							loading={CRUD.isFetching}
						/>
					</Modal>
				)}
			</>
		);
	}


};

export default ModalCardRequest;



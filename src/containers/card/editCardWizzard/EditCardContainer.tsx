import { useState, createContext, useEffect } from 'react';
import Fetching from '../../../components/misc/Fetching';
import EditDetailCardComponent from './EditDetailCardComponent';
import DetailCardComponent from './DetailCardComponent';
import Button from '../../../components/misc/Button';

interface UserWizzardInterface {
	id: number | null;
	editCard: Function;
	deleteCard: Function;
	isFetching: boolean;
	closeModal: Function;
	allCards: any;
	card: any;
	getCard: Function;
	isLoading: Boolean;
	setSelectedDataToParent: any;
}

const EditCardContainer = ({
	id,
	editCard,
	deleteCard,
	isFetching,
	closeModal,
	allCards,
	card,
	getCard,
	isLoading,
	setSelectedDataToParent,
}: UserWizzardInterface) => {
	useEffect(() => {
		id && getCard(id);
	}, []);
	const [editModal, setEditModal] = useState(false);

	if (isLoading)
		return (
			<div className='h-96'>
				<Fetching />
			</div>
		);
	else if (!editModal)
		return (
			<div className=''>
				<div className='flex items-center justify-around'>
					<h1 className='ml-2 text-lg'>Detalles de tarjeta {id}</h1>
					<Button
						action={() => setEditModal(!editModal)}
						name='Editar'
						outline={true}
						color='tecopay-400'
						textColor='black'
						value='Editar'
					></Button>
				</div>

				<DetailCardComponent id={id} allCards={allCards} Card={card} />
			</div>
		);
	else
		return (
			<div className=''>
				<div className='flex items-center justify-around'>
					<h1 className='ml-2 text-lg'>Editar tarjeta {id}</h1>
				</div>
				<Button
					action={() => setEditModal(!editModal)}
					name='Editar'
					outline={true}
					color='tecopay-400'
					textColor='black'
					value='Editar'
				></Button>

				<EditDetailCardComponent
					id={id}
					editCard={editCard}
					deleteCard={deleteCard}
					Card={card}
					closeModal={closeModal}
					isFetching={isFetching}
					allCards={allCards}
					setSelectedDataToParent={setSelectedDataToParent}
				/>
			</div>
		);
};

export default EditCardContainer;

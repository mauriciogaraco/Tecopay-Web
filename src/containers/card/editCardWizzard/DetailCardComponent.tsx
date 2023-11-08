const DetailCardComponent = (Card: any) => {
	return (
		<section>
			<ul className='grid gap-2 text-xl'>
				<li>No. Tarjeta: {Card?.data?.id}</li>
				{/*<li>Nombre: <span>{card.data.}</span></li>
				<li>Creada por: <span>{card.data.}</span></li>
				<li>Fecha de emisión: <span>{card.data.}</span></li>
				<li>Fecha de expiración: <span>{card.data.}</span></li>
				<li>Propietario: <span>{card.data.}</span></li>
				<li>Cuenta: <span>{card.data.}</span></li>
				<li>Moneda: <span>{card.data.}</span></li>
				<li>Monto mínimo sin confirmar: <span>{card.data.}</span></li>
				<li>Descripción: <span>{card.data.}</span></li>*/}
			</ul>
		</section>
	);
};

export default DetailCardComponent;

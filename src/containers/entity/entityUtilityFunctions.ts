import { FilterInterface } from "./EntityInterfaces"


export function findMessage(obj: any): string | null {
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const currentProperty = obj[key];

			if (typeof currentProperty === 'object' && currentProperty !== null) {
				const nestedMessage = findMessage(currentProperty);

				if (nestedMessage !== null) {
					return nestedMessage;
				}
			} else if (key === 'message' && typeof currentProperty === 'string') {
				return currentProperty;
			}
		}
	}

	return null;
}

export function propertyFilter(objeto: FilterInterface): FilterInterface {
	const propiedadesPermitidas: Array<keyof FilterInterface> = [
		'address',
		'allowCreateAccount',
		'businessId',
		'name',
		'ownerId',
		'phone',
		'responsable',
	];
	const resultado: Partial<FilterInterface> = {};
	Object.keys(objeto).forEach((clave) => {
		if (propiedadesPermitidas.includes(clave as keyof FilterInterface)) {
			resultado[clave as keyof FilterInterface] = objeto[clave];
		}
	});
	return resultado as FilterInterface;
}

export function reFormat(array: any, idAEliminar: number) {
	// Filtrar el array para excluir el objeto con el ID a eliminar
	const newArray = array.filter((objeto: any) => objeto.id !== idAEliminar);

	// Reorganizar los IDs para que sean secuenciales
	const nuevoArray = newArray.map((objeto: any, index: any) => ({
		...objeto,
		id: index,
	}));

	return nuevoArray;
}




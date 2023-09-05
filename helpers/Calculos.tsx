import { territorioInterface } from "../interfaces/interfaces";

export const esCaducado = (ter: territorioInterface) => {
	if (ter.ultimaFecha) {
		const fechaActual = new Date();
		const fechaSalida = ter.ultimaFecha.toDate();
		const diferenciaMeses = (fechaActual.getFullYear() - fechaSalida.getFullYear()) * 12 + (fechaActual.getMonth() - fechaSalida.getMonth())
		return diferenciaMeses >= 4;
	}
	return false;
}
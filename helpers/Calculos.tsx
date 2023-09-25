import { Timestamp } from "firebase/firestore";
import { territorioInterface } from "../interfaces/interfaces";
import { getHistorico } from "../services/getHistorico";

export const esCaducado = (ter: territorioInterface): boolean => {
	if (ter.ultimaFechaSalida) {
		const fechaActual = new Date();
		const fechaSalida = ter.ultimaFechaSalida.toDate();
		const diferenciaMeses = (fechaActual.getFullYear() - fechaSalida.getFullYear()) * 12 + (fechaActual.getMonth() - fechaSalida.getMonth())
		return diferenciaMeses >= 4;
	}
	return false;
}

export const obtenerUltimaEntrega = async (terID: string): Promise<Timestamp | undefined> => {
	const historico = await getHistorico(terID);
	let ultimaEntrega: Timestamp | undefined = undefined;
	historico.forEach((hist) => {
		if (hist.fechaEntrada && (!ultimaEntrega || hist.fechaEntrada.valueOf() > ultimaEntrega.valueOf())) {
			ultimaEntrega = hist.fechaEntrada;
		}
	});
	return ultimaEntrega;
}

export const ordenarPorTiempo = (a: territorioInterface, b: territorioInterface) => {
	return (b.ultimaFechaEntrega?.seconds || parseInt(a.numero)) - (a.ultimaFechaEntrega?.seconds || parseInt(b.numero));
}
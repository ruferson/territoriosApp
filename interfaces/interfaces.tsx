import { Timestamp } from "firebase/firestore";

export interface territorioInterface {
	'numero': string,
	'barrio': string,
	'activo': boolean,
	'negocios': boolean,
	'uid': string,
	'descripcion'?: string,
	'numViviendas'?: string,
	'enlace'?: string,
	'img'?: {
		path: string,
		url: string
	},
	'ultimaFechaSalida'?: Timestamp,
	'ultimaFechaEntrega'?: Timestamp,
	'id'?: string
}

export interface historicoInterface {
	'campaña': boolean,
	'fechaEntrada'?: Timestamp,
	'fechaSalida': Timestamp,
	'publicador': string,
	'terID': string,
	'uid': string,
	'id'?: string
}
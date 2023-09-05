import { Timestamp } from "firebase/firestore";

export interface territorioInterface {
	'numero': string,
	'barrio': string,
	'activo': boolean,
	'negocios': boolean,
	'descripcion'?: string,
	'numViviendas'?: string,
	'img'?: {
		path: string,
		url: string
	},
	'uid'?: string,
	'ultimaFecha'?: Timestamp,
	'id'?: string
}
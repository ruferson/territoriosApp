import { StorageReference } from "firebase/storage";

export interface territorioInterface {
	'barrio': string,
	'activo': boolean,
	'negocios': boolean,
	'descripcion'?: string,
	'numViviendas'?: string,
	'img'?: {
		path: string,
		url: string
	},
}
import { useEffect, useState } from 'react';
import { getTerritorios } from '../services/getTerritorios';
import { territorioInterface } from '../interfaces/interfaces';
import { ordenarPorTiempo } from '../helpers/Calculos';

const useTerritorios = (update: number, orden = 'numero') => {
	const [territorios, setTerritorios] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const obtenerTerritorios = () => {
		setLoading(true)
		getTerritorios().then((nextTerr: any[]) => {
			setLoading(false);
			switch (orden) {
				case 'numero':
					nextTerr.sort((a, b) => parseInt(a.numero) - parseInt(b.numero));
					break;
				case 'tiempo':
					nextTerr.sort((a, b) => ordenarPorTiempo(a, b));
					break;
				default:
					nextTerr.sort((a, b) => parseInt(a.numero) - parseInt(b.numero));
					break;
			}
			setTerritorios(nextTerr);
		});
	}
	useEffect(obtenerTerritorios, [update, orden]);

	return { territorios, loading }
}

export default useTerritorios;
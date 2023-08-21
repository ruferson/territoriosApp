import { useEffect, useState } from 'react';
import { getTerritorios } from '../services/getTerritorios';

const useTerritorios = (update: number) => {
	const [territorios, setTerritorios] = useState<any>([]);
	const [loading, setLoading] = useState(true);

	const obtainTerritorios = () => {
		setLoading(true)
		getTerritorios().then(nextTerr => {
			setLoading(false);
			setTerritorios(nextTerr);
		});
	}
	useEffect(obtainTerritorios, [update]);

	return { territorios, loading }
}

export default useTerritorios;
import { useEffect, useState } from 'react';
import { getTerritorio } from '../services/getTerritorio';

const useTerritorio = (territorioID: string) => {

	const [territorioData, setTerritorio] = useState();
	const [loadingTerritorio, setLoadingTerritorio] = useState(true)

	const obtenerTerritorio = () => {
		if (territorioID) {
			getTerritorio(territorioID).then((nextTerritorio: any) => {
				setTerritorio(nextTerritorio);
				setLoadingTerritorio(false)
			});
		} else {
			setLoadingTerritorio(false)
		}
	}
	useEffect(obtenerTerritorio, [territorioID]);

	return { territorioData, loadingTerritorio }
}

export default useTerritorio;
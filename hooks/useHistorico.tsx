import { useEffect, useState } from 'react';
import { getHistorico } from '../services/getHistorico';


const useHistorico = (id: string | null, update: number) => {
	const [historico, setHistorico] = useState<any[]>([]);
	const [loadingHistorico, setLoading] = useState(true);

	const obtainHistorico = () => {
		if (id) {
			setLoading(true)
			getHistorico(id).then(nextHist => {
				setLoading(false);
				setHistorico(nextHist);
			});
		}
	}
	useEffect(obtainHistorico, [id, update]);

	return { historico, loadingHistorico }
}

export default useHistorico;
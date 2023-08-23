import { useEffect, useState } from 'react';
import { getHistorico } from '../services/getHistorico';


const useHistorico = (id: string, update: number) => {
	const [historico, setHistorico] = useState<any[]>([]);
	const [loadingHistorico, setLoading] = useState(true);

	const obtainHistorico = () => {
		setLoading(true)
		getHistorico(id).then(nextHist => {
			setLoading(false);
			setHistorico(nextHist);
		});
	}
	useEffect(obtainHistorico, [id, update]);

	return { historico, loadingHistorico }
}

export default useHistorico;
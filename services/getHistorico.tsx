import { collection, getDocs, query, where } from 'firebase/firestore';

import { auth, db } from '../firebase/firebaseConfig';
import { historicoInterface } from '../interfaces/interfaces';

export const getHistorico = async (id: string): Promise<historicoInterface[]> => {
	try {
		if (auth.currentUser) {
			const collectionRef = collection(db, "territorios", id, 'historico');
			const docSnap = await getDocs(query(collectionRef, where("uid", "==", auth.currentUser.uid)));

			const historial: any = [];

			docSnap.forEach((doc) => {
				historial.push({ id: doc.id, ...doc.data() });
			});

			return historial;
		} else {
			throw new Error('¡No has iniciado sesión!');
		}
	} catch (error) {
		console.error("Error al obtener el historico:", error);
		return [];
	}
};
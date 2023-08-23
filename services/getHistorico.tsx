import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

import { db } from '../firebase/firebaseConfig';

export const getHistorico = async (id: string) => {
	try {
		const docRef = collection(db, "historicoTerritorios");
		const docSnap = await getDocs(query(docRef, where("idTerritorio", "==", id)));

		const historial: any = [];

		docSnap.forEach((doc) => {
			historial.push({ id: doc.id, ...doc.data() });
		});

		return historial;
	} catch (error) {
		console.error("Error al obtener el historico:", error);
		return null;
	}
};
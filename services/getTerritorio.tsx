import { doc, getDoc } from 'firebase/firestore';

import { db } from '../firebase/firebaseConfig';

export const getTerritorio = async (id: string) => {
	try {
		const docRef = doc(db, "territorios", id);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			return { id: docSnap.id, ...docSnap.data() };
		} else {
			console.log("No such document!");
			return null;
		}
	} catch (error) {
		console.error("Error al obtener el territorio:", error);
		return {};
	}
};
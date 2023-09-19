import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '../firebase/firebaseConfig';

export const getTerritorio = async (id: string) => {
	try {
		if (auth.currentUser) {
			const docRef = doc(db, "territorios", id);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				return { id: docSnap.id, ...docSnap.data() };
			} else {
				console.log("No such document!");
				return null;
			}
		} else {
			throw new Error('¡No has iniciado sesión!');
		}
	} catch (error) {
		console.error("Error al obtener el territorio:", error);
		return {};
	}
};
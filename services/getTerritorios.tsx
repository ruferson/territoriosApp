import { collection, getDocs, query, where } from '@firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export const getTerritorios = async () => {
	const collectionRef = collection(db, "territorios");

	try {
		if (auth.currentUser) {
			const querySnapshot = await getDocs(query(collectionRef, where("uid", "==", auth.currentUser.uid)));

			const territorios: any = [];

			await querySnapshot.forEach(async (doc) => {
				territorios.push({ id: doc.id, ...doc.data() });
			});

			return territorios;
		} else {
			throw new Error('¡No has iniciado sesión!');
		}
	} catch (error) {
		console.error("Error al obtener los territorios:", error);
		return [];
	}
};
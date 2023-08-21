import { collection, getDocs, query, where } from '@firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export const getTerritorios = async () => {
	const collectionRef = collection(db, "territorios");

	try {
		const querySnapshot = await getDocs(query(collectionRef));
		const territorios : any = [];

		querySnapshot.forEach((doc) => {
			territorios.push({ id: doc.id, ...doc.data() });
		});

		return territorios;
	} catch (error) {
		console.error("Error al obtener los territorios:", error);
		return [];
	}
};
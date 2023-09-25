import { collection, getDocs, query, where, QueryDocumentSnapshot } from '@firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { obtenerUltimaEntrega } from '../helpers/Calculos';
import { territorioInterface } from '../interfaces/interfaces';

// Cambiamos el tipo de retorno para hacerlo más específico.
export const getTerritorios = async (): Promise<territorioInterface[]> => {
  try {
    // Verificamos si el usuario está autenticado.
    if (!auth.currentUser) {
      throw new Error('¡No has iniciado sesión!');
    }

    const collectionRef = collection(db, "territorios");
    const querySnapshot = await getDocs(query(collectionRef, where("uid", "==", auth.currentUser.uid)));

    // Usamos Promise.all para paralelizar las llamadas a obtenerUltimaEntrega.
    const territoriosPromises: Promise<any>[] = [];

    querySnapshot.forEach((doc) => {
      const ultimaFechaEntregaPromise = obtenerUltimaEntrega(doc.id)
        .then(ultimaFechaEntrega => {
          const territorio = { id: doc.id, ...doc.data(), ultimaFechaEntrega };
          return territorio;
        });

      territoriosPromises.push(ultimaFechaEntregaPromise);
    });

    // Esperamos a que todas las promesas se resuelvan.
    const territorios: territorioInterface[] = await Promise.all(territoriosPromises);

    return territorios;
  } catch (error) {
    console.error("Error al obtener los territorios:", error);
    return [];
  }
};

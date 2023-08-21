// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import Config from "react-native-config";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: Config.FIREBASE_APIKEY,
	authDomain: Config.FIREBASE_AUTHDOMAIN,
	projectId: Config.FIREBASE_PROJECTID,
	storageBucket: Config.FIREBASE_STORAGEBUCKET,
	messagingSenderId: Config.FIREBASE_MESSAGINGSENDERID,
	appId: Config.FIREBASE_APPID,
	measurementId: Config.FIREBASE_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
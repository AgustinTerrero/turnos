// Firebase config and initialization for React
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBPh4uNWS-fub6lr4OzqhxF7KHL4EyaHzQ",
  authDomain: "turnos-14809.firebaseapp.com",
  projectId: "turnos-14809",
  storageBucket: "turnos-14809.appspot.com",
  messagingSenderId: "818695490074",
  appId: "1:818695490074:web:dfff46889bf0c729469fa3"
};

// Evita inicializar Firebase múltiples veces
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

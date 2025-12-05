import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyASyK64qipnwTcilzFDvqOropS1HzQx3NU",
    authDomain: "bormi-8997c.firebaseapp.com",
    projectId: "bormi-8997c",
    storageBucket: "bormi-8997c.firebasestorage.app",
    messagingSenderId: "325382534196",
    appId: "1:325382534196:web:d6504cb67cab7149828661",
    measurementId: "G-Z8804SP5EH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

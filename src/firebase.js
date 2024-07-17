import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyChHj4p7kAO_PI04SRmVA8E5h62M3CEg1E",
    authDomain: "budget-app-85de4.firebaseapp.com",
    projectId: "budget-app-85de4",
    storageBucket: "budget-app-85de4.appspot.com",
    messagingSenderId: "1015655208409",
    appId: "1:1015655208409:web:9ee53ddaef32e7a79bb5c8"
  };
  
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
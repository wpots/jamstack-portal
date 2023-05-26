// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDataBase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDtNMv9BYes2Ze1F_mwP-8JXUR1VR5y4Ls',
  authDomain: 'goed-gebekt-feedback.firebaseapp.com',
  projectId: 'goed-gebekt-feedback',
  storageBucket: 'goed-gebekt-feedback.appspot.com',
  messagingSenderId: '1060348121739',
  appId: '1:1060348121739:web:95cd70231b5850861cba8e',
  measurementId: 'G-25ZSVH59GC',
  databaseURL: 'https://goed-gebekt-feedback-default-rtdb.europe-west1.firebasedatabase.app/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
// export const database = getDataBase(app);

export default app;

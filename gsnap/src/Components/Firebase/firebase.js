import firebase from '@firebase/app';
require('@firebase/auth');
require('@firebase/firestore');
require('@firebase/storage');


const firebaseConfig = {
  apiKey: "AIzaSyDqN8efswxHYY2VvEP_lb0Q1rAzKOxJ4ME",
  authDomain: "react-application-3248d.firebaseapp.com",
  projectId: "react-application-3248d",
  storageBucket: "react-application-3248d.appspot.com",
  messagingSenderId: "244202426398",
  appId: "1:244202426398:web:8c0f99f39386bcf15a5e0f",
  measurementId: "G-SP7JPNZXZ9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
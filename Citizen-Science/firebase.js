// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA0OYAJpa_8kauF10SbdMJI-jwju_LdqYE",
    authDomain: "woope-citizen-science.firebaseapp.com",
    projectId: "woope-citizen-science",
    storageBucket: "woope-citizen-science.appspot.com",
    messagingSenderId: "214140770234",
    appId: "1:214140770234:web:c14daf28d4317a4ae46f83",
    measurementId: "G-M2ENJ7X9VN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
export {auth};
// js/config.js
export const firebaseConfig = {
    apiKey: "AIzaSyA-LjNBXrlKMjV4LlfRRHxouidJP3rLUHs", // Replace with your actual API key if different
    authDomain: "hackafriend-6eab8.firebaseapp.com",
    projectId: "hackafriend-6eab8",
    storageBucket: "hackafriend-6eab8.firebasestorage.app",
    messagingSenderId: "820027507765",
    appId: "1:820027507765:web:82fe291f47de7e8bc89d7c",
    measurementId: "G-HMFCMPK58B" // Optional
};

// Action URL - IMPORTANT: Replace with your deployed URL base for verify-email
// For local testing (using Live Server default port):
// export const actionCodeSettings = { url: 'http://127.0.0.1:5500/verify-email' };
// For deployment (example):
export const actionCodeSettings = { url: 'http://hackafriend.fun/action.html' };

// --- Application State Flags (using localStorage) ---
export const USERNAME_SET_FLAG = 'app_usernameSet';
export const DETAILS_SET_FLAG = 'app_detailsSet';
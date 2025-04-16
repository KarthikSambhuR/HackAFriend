// js/login.js
import { auth } from './auth.js'; // Import the auth instance

const loginForm = document.getElementById('login-form');
const loginButton = document.getElementById('login-button');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        showError("Please enter both email and password.");
        return;
    }

    // Disable button and show loading state (optional)
    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';
    hideError();

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("Login successful:", user);
            // Redirect is handled by the onAuthStateChanged listener in auth.js
            // No need to redirect manually here unless you have specific logic.
            // Example: You might clear the form, but redirect is preferred.
        })
        .catch((error) => {
            console.error("Login failed:", error);
            showError(mapAuthCodeToMessage(error.code));
        })
        .finally(() => {
            // Re-enable button
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
        });
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
}

// Helper to make Firebase errors more user-friendly
function mapAuthCodeToMessage(code) {
    switch (code) {
        case 'auth/invalid-email':
            return 'Invalid email address format.';
        case 'auth/user-disabled':
            return 'This user account has been disabled.';
        case 'auth/user-not-found':
            return 'No user found with this email address.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/invalid-credential':
             return 'Incorrect email or password.'; // More generic for newer SDK versions
        default:
            return 'An unexpected error occurred. Please try again.';
    }
}
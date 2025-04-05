// js/forgotPassword.js
import { auth } from './auth.js';
import { actionCodeSettings } from './config.js'; // Import custom action URL settings

const forgotPasswordForm = document.getElementById('forgot-password-form');
const resetButton = document.getElementById('reset-button');
const emailInput = document.getElementById('email');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    hideMessages();

    if (!email) {
        showError("Please enter your email address.");
        return;
    }

    resetButton.disabled = true;
    resetButton.textContent = 'Sending...';

    auth.sendPasswordResetEmail(email, actionCodeSettings) // Use custom action URL
        .then(() => {
            console.log("Password reset email sent to:", email);
            showSuccess("Password reset email sent! Check your inbox (and spam folder) for instructions.");
            forgotPasswordForm.reset(); // Clear the form
        })
        .catch((error) => {
            console.error("Password reset failed:", error);
            showError(mapAuthCodeToMessage(error.code));
        })
        .finally(() => {
            resetButton.disabled = false;
            resetButton.textContent = 'Send Reset Link';
        });
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

function hideMessages() {
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
}

// Helper to make Firebase errors more user-friendly
function mapAuthCodeToMessage(code) {
    switch (code) {
        case 'auth/invalid-email':
            return 'Invalid email address format.';
        case 'auth/user-not-found':
            return 'No user found with this email address.';
        default:
            return 'An error occurred. Please try again.';
    }
}
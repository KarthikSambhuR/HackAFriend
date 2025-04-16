// js/signup.js
import { auth } from './auth.js';
import { actionCodeSettings } from './config.js'; // Import custom action URL settings

const signupForm = document.getElementById('signup-form');
const signupButton = document.getElementById('signup-button');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // Clear previous messages
    hideMessages();

    // Basic Validation
    if (!email || !password || !confirmPassword) {
        showError("Please fill in all fields.");
        return;
    }
    if (password !== confirmPassword) {
        showError("Passwords do not match.");
        return;
    }
    if (password.length < 6) {
        showError("Password must be at least 6 characters long.");
        return;
    }

    // Disable button
    signupButton.disabled = true;
    signupButton.textContent = 'Signing Up...';

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("Signup successful:", user);

            // Send verification email
            user.sendEmailVerification(actionCodeSettings) // Use custom settings
                .then(() => {
                    console.log("Verification email sent.");
                    showSuccess("Account created successfully! Please check your email to verify your account. You can now log in.");
                    // Optionally redirect to login after a delay or let user click
                    // setTimeout(() => { window.location.href = 'login'; }, 5000);
                })
                .catch((error) => {
                    console.error("Error sending verification email:", error);
                    // User is created, but email failed. Show a message.
                    showError("Account created, but failed to send verification email. You can try logging in and resending it later.");
                })
                .finally(() => {
                    // Re-enable button here if not redirecting immediately
                     signupButton.disabled = false;
                     signupButton.textContent = 'Sign Up';
                });

            // Clear the form
            signupForm.reset();

            // NOTE: User is technically logged in at this point.
            // The onAuthStateChanged listener in auth.js will handle
            // the next step (redirecting to set-username) after verification email sent.

        })
        .catch((error) => {
            console.error("Signup failed:", error);
            showError(mapAuthCodeToMessage(error.code));
            // Re-enable button on error
            signupButton.disabled = false;
            signupButton.textContent = 'Sign Up';
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
        case 'auth/email-already-in-use':
            return 'This email address is already registered.';
        case 'auth/invalid-email':
            return 'Invalid email address format.';
        case 'auth/operation-not-allowed':
            return 'Email/password sign-up is not enabled.'; // Check Firebase console
        case 'auth/weak-password':
            return 'Password is too weak. Please choose a stronger password.';
        default:
            return 'An unexpected error occurred during sign up. Please try again.';
    }
}
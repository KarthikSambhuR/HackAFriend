// js/dashboard.js
import { auth, isUsernameSet, isDetailsSet } from './auth.js';
import { USERNAME_SET_FLAG, DETAILS_SET_FLAG } from './config.js'; // Import flags for logout


const logoutButton = document.getElementById('logout-button');
const welcomeMessage = document.getElementById('welcome-message');
const errorMessage = document.getElementById('error-message');

// Check auth state and profile completion on load
auth.onAuthStateChanged(async user => {
    if (user) {
        // User is signed in.
        welcomeMessage.textContent = `Welcome, ${user.email}!`; // Display email for now
        if (!(await isUsernameSet(user.uid)) || !(await isDetailsSet(user.uid))) {
            window.location.href = !(await isUsernameSet(user.uid)) ? 'set-username' : 'user-details';
        }

    } else {
        // Not signed in - redirect handled by auth.js
        welcomeMessage.textContent = 'You are not logged in.';
    }
});

// Logout Button
logoutButton.addEventListener('click', () => {
    hideError();
    logoutButton.disabled = true;
    logoutButton.textContent = 'Logging out...';

    // Clear app-specific flags on logout click
    localStorage.removeItem(USERNAME_SET_FLAG);
    localStorage.removeItem(DETAILS_SET_FLAG);
    console.log("Cleared profile flags from localStorage.");


    auth.signOut()
        .then(() => {
            console.log('User signed out successfully.');
            // Redirect is handled by onAuthStateChanged in auth.js
            // No need to manually redirect here.
        })
        .catch((error) => {
            console.error('Sign out error:', error);
            showError("Failed to log out. Please try again.");
            logoutButton.disabled = false;
            logoutButton.textContent = 'Logout';
        });
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}
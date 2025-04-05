// js/setUsername.js
import { auth } from './auth.js';
import { USERNAME_SET_FLAG } from './config.js';

const setUsernameForm = document.getElementById('set-username-form');
const setUsernameButton = document.getElementById('set-username-button');
const usernameInput = document.getElementById('username');
const errorMessage = document.getElementById('error-message');
const logoutButton = document.getElementById('logout-button-alt');

// Basic client-side validation (mirroring pattern attribute)
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

// Redirect if not logged in (handled by auth.js, but good practice)
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'login';
    }
    // If already set, move on (also handled by auth.js, defensive check)
    // else if (localStorage.getItem(USERNAME_SET_FLAG) === 'true') {
    //     window.location.href = 'user-details';
    // }
});


setUsernameForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const username = usernameInput.value.trim();

    // Client-side validation
    if (!usernameRegex.test(username)) {
        showError("Username must be 3-20 characters long and contain only letters, numbers, or underscores.");
        return;
    }

    setUsernameButton.disabled = true;
    setUsernameButton.textContent = 'Checking...';

    // --- Placeholder for Database Validation ---
    // In a real app, you would make an async call here to your backend/Cloud Function
    // to check if the username is already taken in your Cloudflare D1 database.
    try {
        const isAvailable = await checkUsernameAvailability(username); // Replace with actual check

        if (isAvailable) {
            console.log(`Username "${username}" is available.`);

            // --- Placeholder for Saving Username ---
            // Here you would save the username associated with the user's UID
            // in your D1 database. Let's simulate success.

            console.log("Simulating save to DB...");
            await saveUsername(auth.currentUser.uid, username); // Replace with actual save

            // Mark username as set in localStorage
            localStorage.setItem(USERNAME_SET_FLAG, 'true');
            console.log("Username set flag saved to localStorage.");

            // Redirect to the next step
            window.location.href = 'user-details';

        } else {
            showError(`Username "${username}" is already taken. Please choose another.`);
            setUsernameButton.disabled = false;
            setUsernameButton.textContent = 'Set Username & Continue';
        }
    } catch (error) {
        console.error("Error during username check/save:", error);
        showError("An error occurred while setting the username. Please try again.");
        setUsernameButton.disabled = false;
        setUsernameButton.textContent = 'Set Username & Continue';
    }
    // --- End Placeholder ---

});

// --- Placeholder Functions (Replace with actual D1 logic later) ---
async function checkUsernameAvailability(username) {
    console.warn(`Placeholder: Checking availability for "${username}". Assuming available.`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // In real app: query D1 database. Example:
    // const response = await fetch('/api/check-username', { method: 'POST', body: JSON.stringify({ username }) });
    // const data = await response.json();
    // return data.isAvailable;

    // For now, let's assume it's available unless it's 'testuser'
    return username !== 'testuser';
}

async function saveUsername(userId, username) {
     console.warn(`Placeholder: Saving username "${username}" for user ${userId}.`);
     // Simulate network delay
     await new Promise(resolve => setTimeout(resolve, 300));
    // In real app: send data to backend/Cloud Function to save in D1. Example:
    // await fetch('/api/save-profile', { method: 'POST', body: JSON.stringify({ userId, username }) });
    return true; // Indicate success
}
// --- End Placeholder Functions ---


function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
}

// Logout functionality
logoutButton.addEventListener('click', () => {
    auth.signOut().then(() => {
        console.log("User signed out.");
        // Redirect handled by onAuthStateChanged
    }).catch(error => {
        console.error("Sign out error", error);
        showError("Error signing out.");
    });
});
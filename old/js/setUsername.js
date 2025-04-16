import { auth } from './auth.js';
import { USERNAME_SET_FLAG } from './config.js';

const setUsernameForm = document.getElementById('set-username-form');
const setUsernameButton = document.getElementById('set-username-button');
const usernameInput = document.getElementById('username');
const errorMessage = document.getElementById('error-message');
const logoutButton = document.getElementById('logout-button-alt');

const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'login';
    }
});

setUsernameForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const username = usernameInput.value.trim();
    if (!usernameRegex.test(username)) {
        showError("Username must be 3-20 characters long and contain only letters, numbers, or underscores.");
        return;
    }

    setUsernameButton.disabled = true;
    setUsernameButton.textContent = 'Checking...';

    const user = auth.currentUser;

    if (!user) {
        showError("You must be logged in to set a username.");
        setUsernameButton.disabled = false;
        setUsernameButton.textContent = 'Set Username & Continue';
        return;
    }

    try {
        // Step 1: Check username availability
        const availabilityRes = await fetch(`https://hackafriend.pixelplayz.workers.dev/username-availability?username=${encodeURIComponent(username)}`);
        const availabilityData = await availabilityRes.json();

        if (availabilityData.status === 'taken') {
            showError("Username is already taken. Please choose another.");
            setUsernameButton.disabled = false;
            setUsernameButton.textContent = 'Set Username & Continue';
            return;
        }

        if (availabilityData.status !== 'ok') {
            showError("Unexpected error while checking availability.");
            setUsernameButton.disabled = false;
            setUsernameButton.textContent = 'Set Username & Continue';
            return;
        }

        // Step 2: Username available, now set it
        setUsernameButton.textContent = 'Saving...';

        const setRes = await fetch('https://hackafriend.pixelplayz.workers.dev/set-username', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                username: username,
                api_key: user.uid
            })
        });

        const setData = await setRes.json();

        if (setData.status === 'ok') {
            localStorage.setItem(USERNAME_SET_FLAG, 'true');
            window.location.href = 'user-details';
        } else {
            showError(setData.message || "Failed to set username.");
        }

    } catch (err) {
        console.error("Error setting username:", err);
        showError("An error occurred. Please try again.");
    } finally {
        setUsernameButton.disabled = false;
        setUsernameButton.textContent = 'Set Username & Continue';
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
}

logoutButton.addEventListener('click', () => {
    auth.signOut().then(() => {
        console.log("User signed out.");
    }).catch(error => {
        console.error("Sign out error", error);
        showError("Error signing out.");
    });
});

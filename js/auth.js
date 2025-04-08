// js/auth.js
import { firebaseConfig, USERNAME_SET_FLAG, DETAILS_SET_FLAG } from './config.js';

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Set persistence to LOCAL (default, but good to be explicit)
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
        console.log("Auth persistence set to LOCAL");
    })
    .catch((error) => {
        console.error("Failed to set auth persistence:", error);
    });



// Function to check profile completion status from localStorage
async function isUsernameSet(api_key) {
    const stored = localStorage.getItem(USERNAME_SET_FLAG);
    if (stored === 'true') {
        return true;
    }  
    try {
      const res = await fetch('https://hackafriend.pixelplayz.workers.dev/is-username-set', {
        method: 'GET',
        headers: {
          'api_key': api_key
        }
      });
      const data = await res.json();
      const isSet = data.status === 'ok';
      localStorage.setItem(USERNAME_SET_FLAG, isSet ? 'true' : 'false');
      return isSet;
    } catch (err) {
      console.error('Failed to check username status:', err);
      return false;
    }
}

async function isDetailsSet(api_key) {
    const stored = localStorage.getItem(DETAILS_SET_FLAG);
    if (stored === 'true') {
        return true;
    }
    try {
      const res = await fetch('https://hackafriend.pixelplayz.workers.dev/is-details-set', {
        method: 'GET',
        headers: {
          'api_key': api_key
        }
      });
      const data = await res.json();
      const isSet = data.status === 'ok';
      localStorage.setItem(DETAILS_SET_FLAG, isSet ? 'true' : 'false');
      return isSet;
    } catch (err) {
      console.error('Failed to check details status:', err);
      return false;
    }
}

// --- Central Authentication State Listener ---
auth.onAuthStateChanged(async user => {
    console.log("Auth state changed. User:", user);
    const currentPage = window.location.pathname.split("/").pop(); // Get current html file name

    if (user) {
        // User is signed in.
        console.log("User is logged in. Checking profile status.");
        const usernameSet = await isUsernameSet(user.uid);
        const detailsSet = await isDetailsSet(user.uid);

        // Redirection Logic
        if (!usernameSet && currentPage !== 'set-username') {
            console.log("Username not set, redirecting to set-username");
            window.location.href = 'set-username';
        } else if (usernameSet && !detailsSet && currentPage !== 'user-details') {
            console.log("Details not set, redirecting to user-details");
            window.location.href = 'user-details';
        } else if (usernameSet && detailsSet && (currentPage !== 'index' && currentPage !== '')) {
            console.log("User logged in and profile complete, redirecting to index");
            if (currentPage !== 'verify-email') {
                window.location.href = 'index';
            }
        } else {
            console.log("User logged in, staying on current page:", currentPage);
        }

    } else {
        // User is signed out.
        console.log("User is logged out.");
        localStorage.removeItem(USERNAME_SET_FLAG);
        localStorage.removeItem(DETAILS_SET_FLAG);

        // Define pages that require authentication
        const protectedPages = ['index', 'set-username', 'user-details', ''];

        if (protectedPages.includes(currentPage)) {
            console.log("User is on a protected page, redirecting to login");
            window.location.href = 'login';
        } else {
            console.log("User is logged out, staying on public page:", currentPage);
        }
    }
});

// Export auth instance for other modules
export { auth, isUsernameSet, isDetailsSet };

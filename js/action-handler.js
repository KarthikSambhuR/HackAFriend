import { firebaseConfig } from './config.js';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Get DOM elements
const infoEl = document.getElementById('info');
const successEl = document.getElementById('success');
const errorEl = document.getElementById('error');

// Helper function to display messages
function showMessage(type, message) {
    infoEl.style.display = 'none';
    successEl.style.display = 'none';
    errorEl.style.display = 'none';

    if (type === 'success') {
        successEl.style.display = 'block';
        successEl.textContent = message;
    } else if (type === 'error') {
        errorEl.style.display = 'block';
        errorEl.textContent = message;
    } else {
        infoEl.style.display = 'block';
        infoEl.textContent = message;
    }
}

// Get URL parameters
const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');
const actionCode = params.get('oobCode');
const continueUrl = params.get('continueUrl');

if (!mode || !actionCode) {
    showMessage('error', 'Invalid action URL. Please check the link or try again.');
    throw new Error('Missing mode or action code');
}

switch (mode) {
    case 'verifyEmail':
        auth.applyActionCode(actionCode)
            .then(() => {
                showMessage('success', 'Email successfully verified!');
                setTimeout(() => {
                    window.location.href = continueUrl || 'login';
                }, 3000);
            })
            .catch(err => {
                console.error(err);
                showMessage('error', 'The email verification link is invalid or expired.');
            });
        break;

    case 'resetPassword':
        // Redirect to custom reset page with the code
        window.location.href = `reset-password?oobCode=${actionCode}`;
        break;

    case 'recoverEmail':
        auth.checkActionCode(actionCode)
            .then(info => {
                return auth.applyActionCode(actionCode).then(() => {
                    showMessage('success', `Your email has been restored to ${info.data.email}.`);
                });
            })
            .catch(err => {
                console.error(err);
                showMessage('error', 'This link is invalid or has expired.');
            });
        break;

    default:
        showMessage('error', 'Unknown action. Please check the link or contact support.');
}

import { firebaseConfig } from './config.js';

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const params = new URLSearchParams(window.location.search);
const actionCode = params.get('oobCode');

const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const resetButton = document.getElementById('reset-btn');
const successEl = document.getElementById('success');
const errorEl = document.getElementById('error');

function showMessage(type, msg) {
    successEl.style.display = 'none';
    errorEl.style.display = 'none';
    if (type === 'success') {
        successEl.textContent = msg;
        successEl.style.display = 'block';
    } else {
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
    }
}

resetButton.addEventListener('click', () => {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!newPassword || newPassword.length < 6) {
        return showMessage('error', 'Password must be at least 6 characters long.');
    }

    if (newPassword !== confirmPassword) {
        return showMessage('error', 'Passwords do not match.');
    }

    auth.confirmPasswordReset(actionCode, newPassword)
        .then(() => {
            showMessage('success', 'Password has been reset successfully. Redirecting to login...');
            setTimeout(() => {
                window.location.href = 'login';
            }, 3000);
        })
        .catch(error => {
            console.error(error);
            showMessage('error', 'Failed to reset password. The link may be invalid or expired.');
        });
});

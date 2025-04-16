// js/verifyEmail.js
import { auth } from './auth.js';

const messageDiv = document.getElementById('message');
const loginLink = document.getElementById('login-link');
const resetPasswordForm = document.getElementById('reset-password-form');
const newPasswordInput = document.getElementById('new-password');
const confirmNewPasswordInput = document.getElementById('confirm-new-password');
const resetPwButton = document.getElementById('reset-pw-button');
const resetErrorMessage = document.getElementById('reset-error-message');

// Function to get URL query parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get action code and mode from URL
const mode = getQueryParam('mode');
const actionCode = getQueryParam('oobCode');
// const apiKey = getQueryParam('apiKey'); // apiKey is usually not needed for applyActionCode

function showMessage(text, type = 'info') {
     messageDiv.textContent = text;
     messageDiv.className = `${type}-message`; // Set class based on type
     messageDiv.style.display = 'block';

     if (type === 'success' || type === 'error') {
         loginLink.style.display = 'inline'; // Show login link on completion/error
     }
}

function showResetError(message) {
    resetErrorMessage.textContent = message;
    resetErrorMessage.style.display = 'block';
}
function hideResetError() {
    resetErrorMessage.style.display = 'none';
}


// Handle the action based on 'mode'
if (mode && actionCode) {
    switch (mode) {
        case 'verifyEmail':
            handleVerifyEmail(auth, actionCode);
            break;
        case 'resetPassword':
            handleResetPassword(auth, actionCode);
            break;
        // case 'recoverEmail': // Handle email recovery if needed
        //     handleRecoverEmail(auth, actionCode);
        //     break;
        default:
            showMessage('Invalid action mode.', 'error');
            console.error('Invalid mode:', mode);
    }
} else {
    showMessage('Invalid or missing action code/mode in URL.', 'error');
    console.error('Missing mode or actionCode');
}

// --- Action Handlers ---

function handleVerifyEmail(auth, actionCode) {
    auth.applyActionCode(actionCode)
        .then(() => {
            showMessage('Email verified successfully! You can now log in.', 'success');
            console.log('Email verified.');
            // Optional: Redirect to login or dashboard after a delay
            // setTimeout(() => { window.location.href = 'login'; }, 3000);
        })
        .catch((error) => {
            showMessage('Error verifying email: ' + mapActionCodeError(error.code), 'error');
            console.error('Email verification error:', error);
        });
}

function handleResetPassword(auth, actionCode) {
    // 1. Verify the code first to ensure it's valid and get the user's email
    auth.verifyPasswordResetCode(actionCode)
        .then((email) => {
            console.log('Password reset code is valid for email:', email);
            showMessage(`Resetting password for ${email}. Please enter your new password below.`, 'info');
            // Show the password reset form
            resetPasswordForm.style.display = 'block';

            // Add submit listener for the new password form
            resetPasswordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                hideResetError();
                const newPassword = newPasswordInput.value;
                const confirmNewPassword = confirmNewPasswordInput.value;

                if (newPassword.length < 6) {
                    showResetError("Password must be at least 6 characters long.");
                    return;
                }
                if (newPassword !== confirmNewPassword) {
                     showResetError("Passwords do not match.");
                     return;
                }

                resetPwButton.disabled = true;
                resetPwButton.textContent = 'Resetting...';

                // 2. Confirm the password reset with the new password
                auth.confirmPasswordReset(actionCode, newPassword)
                    .then(() => {
                        console.log('Password has been reset successfully.');
                        resetPasswordForm.style.display = 'none'; // Hide form
                        showMessage('Password reset successfully! You can now log in with your new password.', 'success');
                    })
                    .catch((error) => {
                        showResetError('Error resetting password: ' + mapActionCodeError(error.code));
                        console.error('Password reset confirmation error:', error);
                        resetPwButton.disabled = false;
                        resetPwButton.textContent = 'Reset Password';
                    });
            });
        })
        .catch((error) => {
            showMessage('Invalid or expired password reset code. Please request a new reset link.', 'error');
            console.error('Password reset code verification error:', error);
        });
}


function mapActionCodeError(code) {
    switch(code) {
        case 'auth/expired-action-code':
            return 'The action code has expired. Please try the action again.';
        case 'auth/invalid-action-code':
            return 'The action code is invalid. This might happen if the code is malformed or has already been used.';
        case 'auth/user-disabled':
            return 'The user account associated with this code has been disabled.';
        case 'auth/user-not-found':
             return 'There is no user corresponding to this action code.';
        case 'auth/weak-password':
            return 'The new password provided is too weak.';
        default:
            return 'An unknown error occurred.';
    }
}
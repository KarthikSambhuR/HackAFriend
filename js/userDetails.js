// js/userDetails.js
import { auth, isUsernameSet } from './auth.js';
import { DETAILS_SET_FLAG } from './config.js';

const userDetailsForm = document.getElementById('user-details-form');
const saveDetailsButton = document.getElementById('save-details-button');
const errorMessage = document.getElementById('error-message');
const logoutButton = document.getElementById('logout-button-alt');
const collegeSelect = document.getElementById('college');
const collegeOtherInput = document.getElementById('college_other');

// Skills input elements
const skillsInput = document.getElementById('skills');
const skillsDisplayArea = document.getElementById('skills-display-area');
const skillsHiddenInput = document.getElementById('skills-hidden');
let skillsList = []; // Array to hold the skills

// Redirect if not logged in or username not set
auth.onAuthStateChanged(async user => {
    console.log(user.uid);
    if (!user) {
        window.location.href = 'login';
    } else if (!(await isUsernameSet(user.uid))) {
         window.location.href = 'set-username';
    }
    // If details already set, redirect to dashboard (handled by auth.js, defensive)
    // else if (localStorage.getItem(DETAILS_SET_FLAG) === 'true') {
    //     window.location.href = 'dashboard.html';
    // }
});

// Show/hide 'Other College' input field
collegeSelect.addEventListener('change', () => {
    if (collegeSelect.value === 'other') {
        collegeOtherInput.style.display = 'block';
        collegeOtherInput.required = true;
    } else {
        collegeOtherInput.style.display = 'none';
        collegeOtherInput.required = false;
        collegeOtherInput.value = ''; // Clear if hidden
    }
});


// --- Skills Input Logic ---
function renderSkills() {
    // Clear current pills except the input itself
    skillsDisplayArea.querySelectorAll('.skill-pill').forEach(pill => pill.remove());

    // Add pills for each skill in the list
    skillsList.forEach((skill, index) => {
        const pill = document.createElement('span');
        pill.classList.add('skill-pill');
        pill.textContent = skill;

        const removeBtn = document.createElement('span');
        removeBtn.classList.add('remove-skill');
        removeBtn.textContent = 'x';
        removeBtn.onclick = () => removeSkill(index); // Pass index to remove function

        pill.appendChild(removeBtn);
        // Insert before the input element
        skillsDisplayArea.insertBefore(pill, skillsInput);
    });

    // Update hidden input value
    skillsHiddenInput.value = skillsList.join(',');
}

function addSkill(skill) {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skillsList.includes(trimmedSkill)) { // Avoid duplicates and empty skills
        skillsList.push(trimmedSkill);
        renderSkills();
    }
}

function removeSkill(index) {
    skillsList.splice(index, 1); // Remove skill at the given index
    renderSkills();
}

skillsInput.addEventListener('keyup', (e) => {
    if (e.key === ',' || e.key === 'Enter') {
        e.preventDefault(); // Prevent default comma/enter behavior
        const skillText = skillsInput.value.replace(/,/g, '').trim(); // Remove comma if present
        if (skillText) {
            addSkill(skillText);
            skillsInput.value = ''; // Clear input after adding
        }
    }
});

// Also add skill if input loses focus (blur) and has text
skillsInput.addEventListener('blur', () => {
    const skillText = skillsInput.value.trim();
     if (skillText) {
            addSkill(skillText);
            skillsInput.value = ''; // Clear input after adding
        }
});

// --- Form Submission ---
userDetailsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    // Basic validation check (HTML5 required should handle most)
    if (!userDetailsForm.checkValidity()) {
        showError("Please fill in all required fields.");
        // Trigger browser's built-in validation UI
        userDetailsForm.reportValidity();
        return;
    }

    saveDetailsButton.disabled = true;
    saveDetailsButton.textContent = 'Saving...';

    // Collect form data
    const formData = new FormData(userDetailsForm);
    const userDetails = {};
    formData.forEach((value, key) => {
        // Handle the 'other' college case
        if (key === 'college' && value === 'other') {
            userDetails[key] = formData.get('college_other') || 'Other'; // Use specified other value
        } else if (key !== 'college_other' && key !== 'skills_input') { // Exclude helper fields
             userDetails[key] = value.trim();
        }
    });

     // Add skills from our managed list
    userDetails.skills = skillsList; // Add the array directly


    // --- Placeholder for Saving User Details ---
    try {
        console.log("User Details to save:", userDetails);
        // In a real app, send 'userDetails' along with the user's UID
        // (auth.currentUser.uid) to your backend/Cloud Function to save in D1.
        await saveUserDetailsToDatabase(auth.currentUser.uid, userDetails); // Replace with actual save

        // Mark details as set in localStorage
        localStorage.setItem(DETAILS_SET_FLAG, 'true');
        console.log("Details set flag saved to localStorage.");

        // Redirect to dashboard
        window.location.href = 'index';

    } catch (error) {
        console.error("Error saving user details:", error);
        showError("An error occurred while saving your details. Please try again.");
        saveDetailsButton.disabled = false;
        saveDetailsButton.textContent = 'Save Details & Go to Dashboard';
    }
    // --- End Placeholder ---
});


async function saveUserDetailsToDatabase(userId, details) {
    const apiKey = userId;
    const genderMap = {
        'male': 1,
        'female': 2,
        'other': 3
    };

    // Convert data as per API spec
    const payload = {
        name: details.name,
        phone_number: details.phone,
        date_of_birth: details.dob,
        gender: genderMap[details.gender],
        college_id: getCollegeId(details.college),
        course_id: getCourseId(details.course, details),
        year_of_passing: parseInt(details.passing_year),
        skills: details.skills.join(', ')
    };

    const response = await fetch('https://hackafriend.pixelplayz.workers.dev/set-user-details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api_key': apiKey
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === 'ok') {
        return true;
    } else {
        throw new Error(result.error || 'Unknown error from server');
    }
}

function getCollegeId(collegeValue) {
    const map = {
        'ajce': 1
    };
    return map[collegeValue];
}

function getCourseId(courseValue, details) {
    const map = {
        'BCA': 1,
        'MCA': 2,
        'BTECH': 0,
        'MTECH': 0
    };

    if (courseValue === 'BTECH' || courseValue === 'MTECH') {
        return details['field_of_study'];
    }

    return map[courseValue];
}

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
    // Clear flags immediately on logout click if desired,
    // though onAuthStateChanged also handles this.
    // localStorage.removeItem(USERNAME_SET_FLAG);
    // localStorage.removeItem(DETAILS_SET_FLAG);

    auth.signOut().then(() => {
        console.log("User signed out.");
        // Redirect handled by onAuthStateChanged
    }).catch(error => {
        console.error("Sign out error", error);
        showError("Error signing out.");
    });
});
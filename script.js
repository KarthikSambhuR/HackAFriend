document.addEventListener('DOMContentLoaded', () => {

    // --- Interaction Logic ---

    // Example: Skill tag selection toggle
    const skillTags = document.querySelectorAll('.skill-tag, .filter-tag'); // Select all clickable tags
    skillTags.forEach(tag => {
        // Ensure the listener is only for tags meant to be toggled (like in setup/filters)
        if (tag.closest('.skills-page') || tag.closest('.filter-page')) {
             tag.addEventListener('click', () => {
                tag.classList.toggle('selected');
            });
        }
    });

    // Example: Follow button toggle (Simple visual toggle)
    // In a real app, you'd link profile-view.html and profile-view-following.html
    // or use JS to dynamically change the content and button state after a click.
    // This simple toggle works visually on *one* page if needed.
    const followButtons = document.querySelectorAll('.btn-follow, .btn-following');
    followButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Prevent default if it's inside a link card
            // event.preventDefault();

            if (button.classList.contains('btn-follow')) {
                button.classList.remove('btn-follow');
                button.classList.add('btn-following');
                button.textContent = 'Following';
                // In a real MPA, you might redirect here:
                // window.location.href = 'profile-view-following.html';
            } else if (button.classList.contains('btn-following')) {
                button.classList.remove('btn-following');
                button.classList.add('btn-follow');
                button.textContent = 'Follow';
                 // In a real MPA, you might redirect here:
                // window.location.href = 'profile-view.html';
            }
            // Add actual follow/unfollow logic here
        });
    });

    // Example: Hackathon List Tabs
    const tabButtons = document.querySelectorAll('.hackathon-list-page .tab-button');
    const tabContents = document.querySelectorAll('.hackathon-list-page .tab-content');

    if (tabButtons.length > 0 && tabContents.length > 0) { // Check if elements exist
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;

                // Update button active state
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update content active state
                tabContents.forEach(content => {
                    if (content.id === `tab-${tabId}`) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

    // Example: Search Clear Button
    const clearButton = document.querySelector('.search-bar .clear-button');
    const searchInput = document.querySelector('.search-bar #search-input');
    if (clearButton && searchInput) {
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            // Add logic here to clear results or trigger a new empty search if needed
        });
    }

}); // End DOMContentLoaded


document.addEventListener('DOMContentLoaded', () => {

    // --- Interaction Logic ---

    // Example: Skill tag selection toggle
    const skillTags = document.querySelectorAll('.skill-tag, .filter-tag'); // Select all clickable tags
    skillTags.forEach(tag => {
        // Ensure the listener is only for tags meant to be toggled (like in setup/filters)
        if (tag.closest('.skills-page') || tag.closest('.filter-page')) {
             tag.addEventListener('click', () => {
                tag.classList.toggle('selected');
            });
        }
    });

    // Example: Follow button toggle (Simple visual toggle)
    // In a real app, you'd link profile-view.html and profile-view-following.html
    // or use JS to dynamically change the content and button state after a click.
    // This simple toggle works visually on *one* page if needed.
    const followButtons = document.querySelectorAll('.btn-follow, .btn-following');
    followButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Prevent default if it's inside a link card
            // event.preventDefault();

            if (button.classList.contains('btn-follow')) {
                button.classList.remove('btn-follow');
                button.classList.add('btn-following');
                button.textContent = 'Following';
                // In a real MPA, you might redirect here:
                // window.location.href = 'profile-view-following.html';
            } else if (button.classList.contains('btn-following')) {
                button.classList.remove('btn-following');
                button.classList.add('btn-follow');
                button.textContent = 'Follow';
                 // In a real MPA, you might redirect here:
                // window.location.href = 'profile-view.html';
            }
            // Add actual follow/unfollow logic here
        });
    });

    // Example: Hackathon List Tabs
    const tabButtons = document.querySelectorAll('.hackathon-list-page .tab-button');
    const tabContents = document.querySelectorAll('.hackathon-list-page .tab-content');

    if (tabButtons.length > 0 && tabContents.length > 0) { // Check if elements exist
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;

                // Update button active state
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update content active state
                tabContents.forEach(content => {
                    if (content.id === `tab-${tabId}`) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

    // Example: Search Clear Button
    const clearButton = document.querySelector('.search-bar .clear-button');
    const searchInput = document.querySelector('.search-bar #search-input');
    if (clearButton && searchInput) {
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            // Add logic here to clear results or trigger a new empty search if needed
        });
    }


    // --- Aspect Ratio Check ---
    function createOverlayIfNeeded() {
        const overlayId = 'aspect-ratio-overlay';
        if (!document.getElementById(overlayId)) {
            const overlay = document.createElement('div');
            overlay.id = overlayId;
            overlay.className = 'aspect-ratio-overlay'; // Use a class for styling

            const content = document.createElement('div');
            content.className = 'overlay-content';
            content.innerHTML = '<p>This prototype is designed for mobile viewports.</p><p>Please use a mobile device or your browser\'s developer tools (toggle device toolbar) to simulate a mobile screen for the best experience.</p>';

            overlay.appendChild(content);
            document.body.appendChild(overlay);
            return overlay; // Return the newly created element
        }
        return document.getElementById(overlayId); // Return existing element
    }

    function checkAspectRatio() {
        const overlay = createOverlayIfNeeded(); // Ensure overlay exists
        const width = window.innerWidth;
        const height = window.innerHeight;
        // Threshold: If width is more than 1.1 times the height, consider it non-mobile
        const aspectRatioThreshold = 1.1;

        if (height > 0 && (width / height) > aspectRatioThreshold) {
            overlay.style.display = 'flex'; // Show overlay
        } else {
            overlay.style.display = 'none'; // Hide overlay
        }
    }

    // Initial check on load
    checkAspectRatio();

    // Re-check on window resize
    window.addEventListener('resize', checkAspectRatio);

});
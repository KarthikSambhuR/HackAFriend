document.addEventListener('DOMContentLoaded', () => {

	const skillTags = document.querySelectorAll('.skill-tag, .filter-tag');
	skillTags.forEach(tag => {

		if (tag.closest('.skills-page') || tag.closest('.filter-page')) {
			tag.addEventListener('click', () => {
				tag.classList.toggle('selected');
			});
		}
	});

	const followButtons = document.querySelectorAll('.btn-follow, .btn-following');
	followButtons.forEach(button => {
		button.addEventListener('click', (event) => {

			if (button.classList.contains('btn-follow')) {
				button.classList.remove('btn-follow');
				button.classList.add('btn-following');
				button.textContent = 'Following';

			} else if (button.classList.contains('btn-following')) {
				button.classList.remove('btn-following');
				button.classList.add('btn-follow');
				button.textContent = 'Follow';

			}

		});
	});

	const tabButtons = document.querySelectorAll('.hackathon-list-page .tab-button');
	const tabContents = document.querySelectorAll('.hackathon-list-page .tab-content');

	if (tabButtons.length > 0 && tabContents.length > 0) {
		tabButtons.forEach(button => {
			button.addEventListener('click', () => {
				const tabId = button.dataset.tab;

				tabButtons.forEach(btn => btn.classList.remove('active'));
				button.classList.add('active');

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

	const clearButton = document.querySelector('.search-bar .clear-button');
	const searchInput = document.querySelector('.search-bar #search-input');
	if (clearButton && searchInput) {
		clearButton.addEventListener('click', () => {
			searchInput.value = '';

		});
	}

});

document.addEventListener('DOMContentLoaded', () => {

	const skillTags = document.querySelectorAll('.skill-tag, .filter-tag');
	skillTags.forEach(tag => {

		if (tag.closest('.skills-page') || tag.closest('.filter-page')) {
			tag.addEventListener('click', () => {
				tag.classList.toggle('selected');
			});
		}
	});

	const followButtons = document.querySelectorAll('.btn-follow, .btn-following');
	followButtons.forEach(button => {
		button.addEventListener('click', (event) => {

			if (button.classList.contains('btn-follow')) {
				button.classList.remove('btn-follow');
				button.classList.add('btn-following');
				button.textContent = 'Following';

			} else if (button.classList.contains('btn-following')) {
				button.classList.remove('btn-following');
				button.classList.add('btn-follow');
				button.textContent = 'Follow';

			}

		});
	});

	const tabButtons = document.querySelectorAll('.hackathon-list-page .tab-button');
	const tabContents = document.querySelectorAll('.hackathon-list-page .tab-content');

	if (tabButtons.length > 0 && tabContents.length > 0) {
		tabButtons.forEach(button => {
			button.addEventListener('click', () => {
				const tabId = button.dataset.tab;

				tabButtons.forEach(btn => btn.classList.remove('active'));
				button.classList.add('active');

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

	const clearButton = document.querySelector('.search-bar .clear-button');
	const searchInput = document.querySelector('.search-bar #search-input');
	if (clearButton && searchInput) {
		clearButton.addEventListener('click', () => {
			searchInput.value = '';

		});
	}

	function createOverlayIfNeeded() {
		const overlayId = 'aspect-ratio-overlay';
		if (!document.getElementById(overlayId)) {
			const overlay = document.createElement('div');
			overlay.id = overlayId;
			overlay.className = 'aspect-ratio-overlay';

			const content = document.createElement('div');
			content.className = 'overlay-content';
			content.innerHTML = '<p>This prototype is designed for mobile viewports.</p><p>Please use a mobile device or your browser\'s developer tools (toggle device toolbar) to simulate a mobile screen for the best experience.</p>';

			overlay.appendChild(content);
			document.body.appendChild(overlay);
			return overlay;
		}
		return document.getElementById(overlayId);
	}

	function checkAspectRatio() {
		const overlay = createOverlayIfNeeded();
		const width = window.innerWidth;
		const height = window.innerHeight;

		const aspectRatioThreshold = 1.1;

		if (height > 0 && (width / height) > aspectRatioThreshold) {
			overlay.style.display = 'flex';
		} else {
			overlay.style.display = 'none';
		}
	}

	checkAspectRatio();

	window.addEventListener('resize', checkAspectRatio);

});
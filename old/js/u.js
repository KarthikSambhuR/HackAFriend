// js/dashboard.js
import { auth, isUsernameSet, isDetailsSet } from './auth.js';

auth.onAuthStateChanged(async user => {
    if (user) {
        if (!(await isUsernameSet(user.uid)) || !(await isDetailsSet(user.uid))) {
            window.location.href = !(await isUsernameSet(user.uid)) ? 'set-username' : 'user-details';
        }
        const path = window.location.pathname;
        const segments = path.split('/').filter(Boolean);
        const lastSegment = segments[segments.length - 1] || '(none)';
        const data = await fetchUserProfile(lastSegment, user.uid);
        document.getElementById('profile-name').textContent = data.name;
        insertSkills(data.skills);
        if(!data.profile_pic.startsWith('/assets/')) {
            document.getElementById('profile-pic').src = "https://hackafriend.sambhu.co/"+data.profile_pic;        
        }
        console.log(data);

/*
        bio:""
        is_self:"true"
        name: "Karthik Sambhu R"
        profile_pic:"/assets/default-profile.png"
        skills:"Python, Java, MySQL, C, HTML, CSS, Photoshop, Design, Figma, UI/UX, Hosting, Serverless, JavaScript, Cloudflare, Domain, Cloudflare Workers, Cloudflare D1, SQLite"
        status:"ok"
*/
        

    }
});

function insertSkills(skillsString) {
  const skillsListDiv = document.getElementById('skills-list');
  skillsListDiv.innerHTML = ''; // Clear any existing content

  const skills = skillsString.split(',').map(skill => skill.trim());

  skills.forEach(skill => {
    const span = document.createElement('span');
    span.className = 'skill-pill';
    span.textContent = skill;
    skillsListDiv.appendChild(span);
  });
}


async function fetchUserProfile(username, apiKey) {
  try {
    const response = await fetch(`https://hackafriend.pixelplayz.workers.dev/get-user?username=${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'api_key': apiKey
      }
    });

    const data = await response.json();

    if (data.status === 'ok') {
      return data;
    } else if (data.status === 'not_found') {
      console.warn('User not found');
      return null;
    } else {
      console.error('Unexpected response:', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const navBar = document.querySelector("nav");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuBtn.innerHTML = navLinks.classList.contains("active")
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        if (navBar.classList.contains("open")) {
            navBar.classList.remove("open");
            const icon = menuBtn.querySelector("i");
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    });
});

// Typewriter Effect
const roleElement = document.getElementById("role");
const roles = [
    "Frontend Developer",
    "UX/UI Designer",
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    if (!roleElement) return;
    const currentRole = roles[roleIndex];
    if (!isDeleting) {
        roleElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1500);
            return;
        }
    } else {
        roleElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            roleIndex++;
            if (roleIndex >= roles.length) {
                roleIndex = 0;
            }
        }
    }
    setTimeout(typeEffect, isDeleting ? 60 : 120);
}
typeEffect();

// Reveal sections sequentially when they enter viewport
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

sections.forEach(section => {
    sectionObserver.observe(section);
});

// --- Dynamic Data Fetching ---
async function loadPortfolioData() {
    try {
        // Make sure data.json path matches your project structure
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // 1. Render Skills Section
        const skillsContainer = document.querySelector('#skillsContainer') || document.querySelector('.skills-grid');
        if (skillsContainer && data.skills) {
            skillsContainer.innerHTML = data.skills.map(skill => `
                <div class="skill-card">
                    <img src="${skill.icon}" alt="${skill.name}">
                    <h3>${skill.name}</h3>
                    <span>${skill.level}</span>
                    <div class="progress">
                        <div class="progress-bar" style="width: ${skill.level}"></div>
                    </div>
                </div>
            `).join('');
        }

        // 2. Render Projects Section
        const projectsContainer = document.querySelector('#projectsContainer') || document.querySelector('.projects-grid');
        if (projectsContainer && data.projects) {
            projectsContainer.innerHTML = data.projects.map(project => `
                <div class="project-card">
                    <div class="project-image">
                        <img src="${project.image}" alt="${project.title}">
                        <span class="project-tag">${project.tag}</span>
                    </div>
                    <div class="project-content">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="tech-stack">
                            ${project.tech.map(t => `<span>${t}</span>`).join('')}
                        </div>
                        <div class="project-buttons">
                            <a href="${project.demo}" class="btn-demo" target="_blank">Live Demo</a>
                            <a href="${project.github}" class="btn-code" target="_blank">GitHub</a>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error("Error loading JSON data:", error);
    }
}

// Ensure function runs whether DOM is already loaded or still loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPortfolioData);
} else {
    loadPortfolioData();
}
// For Count the user that view my portfolio
async function updateVisitorCount() {
    try {
        // ប្តូរ 'linart-portfolio-website-2026' ទៅជា key តែមួយគត់របស់អ្នក
        const uniqueKey = 'https://smart-tourism-rho.vercel.app/';
        
        // ហៅ API ដើម្បីបូកលេខ +1 និងទាញយកទិន្នន័យ
        const response = await fetch(`https://countapi.mileshilliard.com/api/v1/hit/${uniqueKey}`);
        const data = await response.json();

        // បង្ហាញលេខនៅលើអេក្រង់
        const countElement = document.getElementById('visitCount');
        if (countElement && data.value) {
            countElement.innerText = Number(data.value).toLocaleString();
        }
    } catch (error) {
        console.error("មិនអាចទាញយកទិន្នន័យ Visitor Count បានទេ:", error);
    }
}

// ដំណើរការ Function ពេល Web បើករួចរាល់[cite: 3]
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateVisitorCount);
} else {
    updateVisitorCount();
}
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
// const navActions = document.getElementById("navActions");
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
// For Theme Toggle



// const themeBtn = document.getElementById("themeBtn");
// themeBtn.addEventListener("click", () => {
//     document.body.classList.toggle("dark");
//     const icon = themeBtn.querySelector("i");
//     if(document.body.classList.contains("dark")){
//         icon.classList.remove("fa-moon");
//         icon.classList.add("fa-sun");
//     }else{
//         icon.classList.remove("fa-sun");
//         icon.classList.add("fa-moon");
//     }
// });



// For Language Toggle
// let currentLang = "en";
// langBtn.addEventListener("click", () => {
//     currentLang = currentLang === "en" ? "kh" : "en";
//     langBtn.innerHTML =
//         currentLang === "en"
//         ? "KH"
//         : "EN";
//     document.querySelectorAll("[data-en]").forEach(el => {
//         el.innerHTML =
//             currentLang === "en"
//             ? el.dataset.en
//             : el.dataset.kh;
//     });

// });

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
    const currentRole = roles[roleIndex];
    if (!isDeleting) {

        roleElement.textContent =
            currentRole.substring(0, charIndex + 1);

        charIndex++;
        if (charIndex === currentRole.length) {

            isDeleting = true;
            setTimeout(typeEffect, 1500);
            return;
        }

    } else {
        roleElement.textContent =
            currentRole.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            roleIndex++;

            if (roleIndex >= roles.length) {
                roleIndex = 0;
            }
        }
    }
    setTimeout(
        typeEffect,
        isDeleting ? 60 : 120
    );
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

```javascript
// Initialize Feather Icons
document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
    
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || 
                         (prefersDarkScheme.matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', toggleTheme);
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        const icon = themeToggle.querySelector('i');
        icon.setAttribute('data-feather', newTheme === 'dark' ? 'moon' : 'sun');
        feather.replace();
    }
    
    // Language Toggle
    const languageToggle = document.querySelector('.language-toggle');
    let currentLanguage = localStorage.getItem('language') || 'en';
    
    updateLanguage(currentLanguage);
    
    languageToggle.addEventListener('click', function() {
        currentLanguage = currentLanguage === 'en' ? 'nl' : 'en';
        localStorage.setItem('language', currentLanguage);
        updateLanguage(currentLanguage);
    });
    
    function updateLanguage(lang) {
        document.querySelectorAll('[data-en], [data-nl]').forEach(element => {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                // Handle form inputs
                if (lang === 'en' && element.dataset.en) {
                    element.placeholder = element.dataset.en;
                } else if (lang === 'nl' && element.dataset.nl) {
                    element.placeholder = element.dataset.nl;
                }
            } else {
                // Handle all other elements
                if (lang === 'en' && element.dataset.en) {
                    element.textContent = element.dataset.en;
                } else if (lang === 'nl' && element.dataset.nl) {
                    element.textContent = element.dataset.nl;
                }
            }
        });
        
        // Update toggle button text
        if (languageToggle) {
            languageToggle.textContent = lang === 'en' ? 'EN' : 'NL';
        }
    }
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('show');
        });
    }
    
    // Accordion Functionality
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        
        header.addEventListener('click', function() {
            accordion.classList.toggle('active');
        });
    });
    
    // Fade-in Animation on Scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFadeIn() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    // Initialize fade-in elements
    fadeElements.forEach(element => {
        element.style.opacity = '0';
    });
    
    // Check on load and scroll
    checkFadeIn();
    window.addEventListener('scroll', checkFadeIn);
    
    // Workshop Form Handling (if on workshops page)
    const workshopForm = document.getElementById('workshop-form');
    if (workshopForm) {
        workshopForm.addEventListener('submit', handleWorkshopSubmit);
        loadWorkshops();
    }
});
// Workshop Functions
function handleWorkshopSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const titleEn = form.querySelector('[name="title_en"]').value;
    const titleNl = form.querySelector('[name="title_nl"]').value;
    const contentEn = form.querySelector('[name="content_en"]').value;
    const contentNl = form.querySelector('[name="content_nl"]').value;
    const studyFitEn = form.querySelector('[name="study_fit_en"]').value;
    const studyFitNl = form.querySelector('[name="study_fit_nl"]').value;
    const careerUseEn = form.querySelector('[name="career_use_en"]').value;
    const careerUseNl = form.querySelector('[name="career_use_nl"]').value;
    
    const workshop = {
        id: Date.now(),
        title: { en: titleEn, nl: titleNl },
        content: { en: contentEn, nl: contentNl },
        studyFit: { en: studyFitEn, nl: studyFitNl },
        careerUse: { en: careerUseEn, nl: careerUseNl },
        date: new Date().toISOString(),
        status: 'completed'
    };
    
    saveWorkshop(workshop);
    addWorkshopToDOM(workshop);
    form.reset();
}
function saveWorkshop(workshop) {
    let workshops = JSON.parse(localStorage.getItem('workshops')) || [];
    workshops.push(workshop);
    localStorage.setItem('workshops', JSON.stringify(workshops));
}
function loadWorkshops() {
    const workshops = JSON.parse(localStorage.getItem('workshops')) || [];
    const currentLanguage = localStorage.getItem('language') || 'en';
    
    workshops.forEach(workshop => {
        addWorkshopToDOM(workshop);
    });
}
function addWorkshopToDOM(workshop) {
    const workshopsList = document.getElementById('workshops-list');
    const currentLanguage = localStorage.getItem('language') || 'en';
    
    if (!workshopsList) return;
    
    const workshopElement = document.createElement('div');
    workshopElement.className = 'workshop-item';
    workshopElement.innerHTML = `
        <h3>${workshop.title[currentLanguage]}</h3>
        <p>${workshop.content[currentLanguage]}</p>
        <div class="workshop-meta">
            <span class="status completed">✓ ${currentLanguage === 'en' ? 'Completed' : 'Voltooid'}</span>
            <a href="workshop-${workshop.id}.html" class="btn-link">
                ${currentLanguage === 'en' ? 'Read more' : 'Lees meer'} 
                <i data-feather="arrow-right"></i>
            </a>
        </div>
    `;
    
    workshopsList.appendChild(workshopElement);
    feather.replace();
}
```
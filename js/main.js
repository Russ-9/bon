// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const quoteForm = document.getElementById('quote-form');
const contactForm = document.getElementById('contact-form');
const reviewsSlider = document.getElementById('reviews-slider');
const navDots = document.querySelectorAll('.nav-dot');
const modal = document.getElementById('modal');
const successMessage = document.getElementById('success-message');

// Service selection elements
const serviceRadios = document.querySelectorAll('input[name="service"]');
const mesureLabel = document.getElementById('mesure-label');

// Hero carousel elements
const heroSlides = document.querySelectorAll('.hero-slide');
const carouselDots = document.querySelectorAll('.carousel-dot');

// Navigation functionality
let currentSlide = 0;
let currentHeroSlide = 0;
const slides = document.querySelectorAll('.review-card');

// Variables for navbar scroll hide/show
let lastScrollTop = 0;
const scrollDelta = 10;
let isNavbarVisible = true;

// Fonction pour gérer le switch de services
function initializeServiceToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const serviceContents = document.querySelectorAll('.service-content');
    if (toggleBtns.length && serviceContents.length) {
        function showService(serviceId) {
            toggleBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.service === serviceId);
            });
            serviceContents.forEach(content => {
                content.classList.toggle('active', content.id === `${serviceId}-content`);
            });
        }
        toggleBtns.forEach(btn => {
            // Supprimer les anciens event listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            // Ajouter le nouveau event listener
            newBtn.addEventListener('click', () => showService(newBtn.dataset.service));
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeForms();
    initializeReviewsSlider();
    initializeHeroCarousel();
    initializeAnimations();
    initializeServiceSelection();
    initializeServiceToggle(); // Initialiser le switch de services
});

// Service selection handling
function initializeServiceSelection() {
    if (!serviceRadios.length || !mesureLabel) return;

    serviceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'chantier') {
                mesureLabel.textContent = 'Superficie m²';
            } else {
                mesureLabel.textContent = 'Nombre de panneaux';
            }
        });
    });
}

// Navigation
function initializeNavigation() {
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (navToggle) {
                navToggle.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Hero Carousel
function initializeHeroCarousel() {
    if (heroSlides.length === 0) return;

    // Auto-slide functionality
    setInterval(() => {
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
        showHeroSlide(currentHeroSlide);
    }, 4000); // Défilement plus rapide

    // Navigation dots
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentHeroSlide = index;
            showHeroSlide(currentHeroSlide);
        });
    });
}

// Show specific hero slide
function showHeroSlide(index) {
    heroSlides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
    
    carouselDots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === index) {
            dot.classList.add('active');
        }
    });
}

// Scroll effects
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        // Navbar background on scroll
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
                initializeServiceToggle(); // Réinitialiser le switch de services après le scroll
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll
            const currentScroll = window.pageYOffset;
            
            // Make sure they scroll more than scrollDelta
            if (Math.abs(lastScrollTop - currentScroll) <= scrollDelta) return;

            // If they scrolled down and are past the navbar
            if (currentScroll > lastScrollTop && currentScroll > navbar.offsetHeight) {
                // Scroll Down
                if (isNavbarVisible) {
                    navbar.style.transform = 'translateY(-100%)';
                    isNavbarVisible = false;
                }
            } else {
                // Scroll Up
                if (!isNavbarVisible || currentScroll < navbar.offsetHeight) {
                    navbar.style.transform = 'translateY(0)';
                    isNavbarVisible = true;
                }
            }

            lastScrollTop = currentScroll;
        }

        // Animate on scroll
        animateOnScroll();
    });
}

// Animate on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-aos]');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('aos-animate');
        }
    });
}

// Forms
function initializeForms() {
    // Quote form
    if (quoteForm) {
        const clientTypeRadios = document.querySelectorAll('input[name="client-type"]');
        const entrepriseGroup = document.getElementById('entreprise-group');
        const entrepriseInput = document.getElementById('entreprise');

        // Show/hide company field based on client type
        clientTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'professionnel') {
                    if (entrepriseGroup) {
                        entrepriseGroup.style.display = 'block';
                    }
                    if (entrepriseInput) {
                        entrepriseInput.setAttribute('required', 'required');
                    }
                } else {
                    if (entrepriseGroup) {
                        entrepriseGroup.style.display = 'none';
                    }
                    if (entrepriseInput) {
                        entrepriseInput.removeAttribute('required');
                        entrepriseInput.value = '';
                    }
                }
            });
        });

        // Form submission
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Simulate form submission
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                // In a real application, you would send this data to your server
                console.log('Quote form data:', data);
                
                // Show success message
                showSuccessMessage('Votre demande de devis a été envoyée avec succès !');
                
                // Reset form
                this.reset();
                
                // Hide company field if it was shown
                if (entrepriseGroup) {
                    entrepriseGroup.style.display = 'none';
                }
                if (entrepriseInput) {
                    entrepriseInput.removeAttribute('required');
                }
            }
        });
    }

    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Simulate form submission
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                // In a real application, you would send this data to your server
                console.log('Contact form data:', data);
                
                // Show success message
                showSuccessMessage('Votre message a été envoyé avec succès !');
                
                // Reset form
                this.reset();
            }
        });
    }

    // Set minimum date for date input
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#ef4444';
            field.style.backgroundColor = '#fef2f2';
        } else {
            field.style.borderColor = '#e5e7eb';
            field.style.backgroundColor = 'white';
        }
    });
    
    // Email validation
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            isValid = false;
            field.style.borderColor = '#ef4444';
            field.style.backgroundColor = '#fef2f2';
        }
    });
    
    // Phone validation
    const phoneFields = form.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
        if (field.value && !isValidPhone(field.value)) {
            isValid = false;
            field.style.borderColor = '#ef4444';
            field.style.backgroundColor = '#fef2f2';
        }
    });
    
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Reviews slider
function initializeReviewsSlider() {
    if (slides.length === 0) return;

    // Auto-slide functionality
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 6000); // Plus de temps pour lire les avis

    // Navigation dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
}

// Show specific slide
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
    
    navDots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === index) {
            dot.classList.add('active');
        }
    });
}

// Animations
function initializeAnimations() {
    // Trigger initial animations
    setTimeout(() => {
        animateOnScroll();
    }, 500);
}

// Success message
function showSuccessMessage(message) {
    if (successMessage) {
        const successText = document.getElementById('success-text');
        if (successText) {
            successText.textContent = message;
        }
        successMessage.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
}

// Modal functionality
function showModal(type) {
    const modal = document.getElementById('modal');
    if (!modal) return;
    
    const modalBody = document.querySelector('.modal-content');
    
    // Ajout des styles pour le défilement
    modalBody.style.maxHeight = '90vh';
    modalBody.style.overflowY = 'auto';
    modalBody.style.margin = '2% auto';
    
    if (type === 'legal') {
        modalBody.innerHTML = `
            <h2>📌 Mentions légales</h2>
            <div style="margin-top: 1rem; line-height: 1.6;">
                <p><strong>Nom du site :</strong> Ce que nos clients disent de nous</p>
                <p><strong>URL :</strong> http://localhost:5173 (à remplacer une fois le site en ligne)</p>
                <p><strong>Nom de l'entreprise :</strong> Bel'Air</p>
                <p><strong>Statut juridique :</strong> Entreprise individuelle (micro-entreprise)</p>
                <p><strong>Responsable de publication :</strong> Inès Bendekhil/Adam Bendekhil</p>
                <p><strong>Activité :</strong> Nettoyage de fin de chantier et nettoyage de panneaux photovoltaïques</p>
                <p><strong>Adresse e-mail :</strong> belair.services91@gmail.com</p>
                <p><strong>Adresse postale :</strong> disponible sur demande</p>
                <p><strong>SIRET :</strong> 92062008500018</p>
                
                <h3 style="margin-top: 1.5rem;">Hébergement :</h3>
                <p>Ce site est hébergé par un prestataire d'hébergement web professionnel.</p>
                <p>Les informations techniques sont disponibles sur demande à l'adresse : belair.services91@gmail.com</p>
            </div>
        `;
    } else if (type === 'privacy') {
        modalBody.innerHTML = `
            <h2>🔐 Politique de confidentialité</h2>
            <div style="margin-top: 1rem; line-height: 1.6;">
                <h3>1. Données collectées</h3>
                <p>Le site « Ce que nos clients disent de nous » ne collecte des données personnelles que si vous choisissez de nous les transmettre via un formulaire (ex. message, témoignage).</p>
                
                <p>Les données éventuellement collectées sont :</p>
                <ul>
                    <li>Nom ou prénom</li>
                    <li>Adresse e-mail</li>
                    <li>Contenu du message ou témoignage</li>
                </ul>
                <p>Elles ne sont utilisées que dans le cadre d'un échange ou pour affichage avec votre accord.</p>
                
                <h3>2. Utilisation des cookies analytiques</h3>
                <p>Ce site utilise uniquement des cookies analytiques via Google Analytics (ou équivalent), dans le but de :</p>
                <ul>
                    <li>Mesurer la fréquentation du site</li>
                    <li>Comprendre les pages les plus visitées</li>
                    <li>Améliorer l'expérience utilisateur</li>
                </ul>
                <p>Les données collectées sont anonymisées (adresse IP partiellement masquée) et ne permettent pas de vous identifier personnellement.</p>
                <p>Ces cookies ne sont activés qu'après votre consentement explicite, demandé via la bannière affichée à votre première visite.</p>
                
                <h3>3. Durée de conservation des données</h3>
                <p>Les données personnelles transmises via formulaire sont conservées au maximum 3 ans.</p>
                <p>Les cookies analytiques expirent automatiquement après une durée définie (en général 13 mois maximum).</p>
                
                <h3>4. Sécurité</h3>
                <p>Nous appliquons des mesures techniques adaptées pour protéger vos données et garantir leur confidentialité.</p>
                
                <h3>5. Vos droits</h3>
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul>
                    <li>Droit d'accès à vos données</li>
                    <li>Droit de rectification</li>
                    <li>Droit d'effacement</li>
                    <li>Droit d'opposition au traitement</li>
                </ul>
                <p>Pour exercer vos droits :<br>
                📧 belair.services91@gmail.com</p>
                
                <h3>6. Responsable du traitement</h3>
                <p>Bel'Air – Inès Bendekhil<br>
                📧 belair.services91@gmail.com</p>
                
                <h3>📝 Mise à jour</h3>
                <p>Cette politique est susceptible d'être modifiée à tout moment.<br>
                Dernière mise à jour : 17 juillet 2025</p>
            </div>
        `;
    }
    
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.style.display === 'block') {
        closeModal();
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const parallaxSpeed = 0.5;
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Form field focus effects
document.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    field.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
    });
});

// Intersection Observer for better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Make functions globally available for onclick handlers
window.showModal = showModal;
window.closeModal = closeModal;

// Gestion du scroll pour la navbar
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Retour en haut de page au clic sur le logo
document.querySelector('.nav-logo').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Gestion du slider des avis
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('reviewsSlider');
    const prevButton = document.getElementById('prevReview');
    const nextButton = document.getElementById('nextReview');
    
    if (slider && prevButton && nextButton) {
        let currentPosition = 0;
        const cardWidth = 350 + 32; // Largeur de la carte + gap
        const totalCards = slider.children.length;
        const containerWidth = slider.parentElement.offsetWidth;
        const maxPosition = -((totalCards * cardWidth) - containerWidth);

        // Fonction pour mettre à jour les boutons
        const updateButtons = () => {
            prevButton.disabled = currentPosition >= 0;
            nextButton.disabled = currentPosition <= maxPosition;
        };

        // Fonction pour déplacer le slider
        const moveSlider = (direction) => {
            const moveAmount = direction * cardWidth;
            currentPosition = Math.max(
                Math.min(currentPosition + moveAmount, 0),
                maxPosition
            );
            slider.style.transform = `translateX(${currentPosition}px)`;
            updateButtons();
        };

        // Écouteurs d'événements pour les boutons
        prevButton.addEventListener('click', () => moveSlider(1));
        nextButton.addEventListener('click', () => moveSlider(-1));

        // Initialisation
        updateButtons();

        // Gestion du redimensionnement
        window.addEventListener('resize', () => {
            const newContainerWidth = slider.parentElement.offsetWidth;
            const newMaxPosition = -((totalCards * cardWidth) - newContainerWidth);
            currentPosition = Math.max(currentPosition, newMaxPosition);
            slider.style.transform = `translateX(${currentPosition}px)`;
            updateButtons();
        });
    }
});

// Génération des avis clients
function generateReviews() {
    const reviewsData = [
        {
            content: "Service impeccable ! L'équipe est très professionnelle et minutieuse. Ma maison n'a jamais été aussi propre.",
            author: "Sophie Martin",
            date: "Il y a 2 jours",
            rating: 5
        },
        {
            content: "Je recommande vivement Bel'Air pour leur efficacité et leur ponctualité. Un travail de qualité à chaque intervention.",
            author: "Pierre Dubois",
            date: "Il y a 1 semaine",
            rating: 5
        },
        {
            content: "Excellent rapport qualité-prix. Le personnel est courtois et le résultat est toujours à la hauteur de mes attentes.",
            author: "Marie Lambert",
            date: "Il y a 2 semaines",
            rating: 5
        },
        {
            content: "Service très fiable et professionnel. Je suis cliente depuis 6 mois et je n'ai jamais été déçue.",
            author: "Julie Moreau",
            date: "Il y a 3 semaines",
            rating: 5
        },
        {
            content: "Une équipe sérieuse qui prend soin de nos locaux. Je recommande pour les professionnels.",
            author: "Thomas Bernard",
            date: "Il y a 1 mois",
            rating: 5
        },
        {
            content: "Très satisfaite de la prestation. L'équipe est ponctuelle et efficace. Les produits utilisés sont respectueux de l'environnement.",
            author: "Emma Petit",
            date: "Il y a 1 mois",
            rating: 5
        },
        {
            content: "Un service client exceptionnel. Ils s'adaptent parfaitement à nos besoins et horaires.",
            author: "Lucas Richard",
            date: "Il y a 1 mois",
            rating: 5
        },
        {
            content: "Entreprise très professionnelle. Le résultat est toujours impeccable et le personnel est agréable.",
            author: "Camille Durand",
            date: "Il y a 2 mois",
            rating: 5
        },
        {
            content: "Je fais appel à leurs services depuis plus d'un an. Jamais déçu, toujours aussi efficaces !",
            author: "Antoine Leroy",
            date: "Il y a 2 mois",
            rating: 5
        },
        {
            content: "Une équipe à l'écoute qui fait un travail remarquable. Je recommande sans hésitation.",
            author: "Sarah Cohen",
            date: "Il y a 2 mois",
            rating: 5
        },
        {
            content: "Prestations de qualité, personnel professionnel et sympathique. Un vrai plus pour notre entreprise.",
            author: "Marc Dupont",
            date: "Il y a 3 mois",
            rating: 5
        },
        {
            content: "Service de nettoyage exceptionnel. Attention aux détails et résultat parfait.",
            author: "Claire Rousseau",
            date: "Il y a 3 mois",
            rating: 5
        },
        {
            content: "Très satisfait de leur service de nettoyage de vitres. Travail minutieux et professionnel.",
            author: "Paul Martinez",
            date: "Il y a 3 mois",
            rating: 5
        },
        {
            content: "Une équipe réactive et efficace. Le suivi client est vraiment appréciable.",
            author: "Léa Simon",
            date: "Il y a 4 mois",
            rating: 5
        },
        {
            content: "Excellent service, personnel compétent et agréable. Je recommande vivement !",
            author: "Nicolas Girard",
            date: "Il y a 4 mois",
            rating: 5
        }
    ];

    // Multiplier les avis pour avoir un défilement continu
    const extendedReviews = [...Array(4)].flatMap(() => reviewsData);

    const reviewsSlider = document.querySelector('.reviews-slider');
    if (!reviewsSlider) return;

    // Vider le slider existant
    reviewsSlider.innerHTML = '';

    // Générer les cartes d'avis
    extendedReviews.forEach(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const initials = review.author.split(' ').map(n => n[0]).join('');
        
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="review-stars">${stars}</div>
            <div class="review-content">
                <p>${review.content}</p>
            </div>
            <div class="review-author">
                <div class="review-author-avatar">${initials}</div>
                <div class="review-author-info">
                    <div class="review-author-name">${review.author}</div>
                    <div class="review-author-date">${review.date}</div>
                </div>
            </div>
        `;
        
        reviewsSlider.appendChild(reviewCard);
    });

    // Ajouter une copie des premiers éléments à la fin pour un défilement infini fluide
    const firstCards = reviewsSlider.querySelectorAll('.review-card');
    const clonedCards = Array.from(firstCards).slice(0, 5).map(card => card.cloneNode(true));
    clonedCards.forEach(card => reviewsSlider.appendChild(card));
}

// Initialiser les avis au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    generateReviews();
});
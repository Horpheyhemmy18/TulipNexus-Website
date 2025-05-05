// Use strict mode
'use strict';

// Performance constants
const SLIDE_INTERVAL = 5000; 
const TRANSITION_DURATION = 400;
const ANIMATION_FRAME_RATE = 1000 / 60;

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Error boundary
window.addEventListener('error', function(e) {
  console.error('Global error handler:', e.error);
  // Prevent complete script failure
  return false;
});

// Slider functionality
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');
let currentSlide = 0;
let slideInterval;

function showSlide(n) {
    // Prevent transition stacking
    if (document.querySelector('.slide.transitioning')) {
        return;
    }
    
    stopSlideShow(); // Stop current interval
    
    // Remove classes from all slides
    slides.forEach(slide => {
        slide.classList.remove('active', 'transitioning');
    });
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    
    // Add transitioning class first
    slides[currentSlide].classList.add('transitioning');
    
    // Force a reflow to ensure transition happens
    slides[currentSlide].offsetHeight;
    
    // Add active class to trigger transition
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Clean up transitioning class
    setTimeout(() => {
        slides[currentSlide].classList.remove('transitioning');
        startSlideShow(); // Restart the slideshow after transition
    }, TRANSITION_DURATION);
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function startSlideShow() {
    stopSlideShow(); // Clear any existing interval first
    slideInterval = setInterval(nextSlide, SLIDE_INTERVAL);
}

function stopSlideShow() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

// Add transition end listener to each slide
slides.forEach(slide => {
    slide.addEventListener('transitionend', () => {
        if (slide.classList.contains('transitioning')) {
            slide.classList.remove('transitioning');
        }
    });
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        // No need to call startSlideShow here as it's handled in showSlide
    });
});

// Replace the DOMContentLoaded event listener with this updated version
document.addEventListener('DOMContentLoaded', () => {
    // Clear any existing states
    stopSlideShow();
    
    // Reset all slides and dots
    slides.forEach(slide => slide.classList.remove('active', 'transitioning'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show first slide
    slides[0].classList.add('active');
    dots[0].classList.add('active');
    currentSlide = 0;
    
    // Start the automatic slideshow after initial delay
    setTimeout(() => {
        startSlideShow();
    }, SLIDE_INTERVAL);
    
    // Add event listeners for controls
    const slider = document.querySelector('.slider');
    slider.addEventListener('mouseenter', stopSlideShow);
    slider.addEventListener('mouseleave', startSlideShow);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Simple tracking form handling
const trackingForm = document.querySelector('.tracking-form');
if (trackingForm) {
    trackingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const trackingNumber = this.querySelector('input').value;
        if (trackingNumber.trim() !== '') {
            alert(`Tracking number ${trackingNumber} is being processed`);
            this.querySelector('input').value = '';
        }
    });
}

// Stat counter animation
const countStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCount = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.round(current);
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target;
            }
        };
        
        // Start counting when the element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });
};

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', countStats);

// Optimize gallery filtering
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  const applyFilter = debounce((filterValue) => {
    requestAnimationFrame(() => {
      galleryItems.forEach(item => {
        const shouldShow = filterValue === 'all' || item.classList.contains(filterValue);
        item.style.display = shouldShow ? 'block' : 'none';
        if(shouldShow) {
          setTimeout(() => item.style.opacity = '1', ANIMATION_FRAME_RATE);
        } else {
          item.style.opacity = '0';
        }
      });
    });
  }, 100);

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      applyFilter(button.getAttribute('data-filter'));
    });
  });
});

// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Close menu when clicking a nav link
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});

// Whatapp Support Button

function toggleWhatsAppPopup() {
    const popup = document.getElementById('whatsappPopup');
    popup.classList.toggle('show');
}

// Close popup when clicking outside
document.addEventListener('click', (e) => {
    const popup = document.getElementById('whatsappPopup');
    const button = document.querySelector('.whatsapp-button');
    
    if (!popup.contains(e.target) && !button.contains(e.target)) {
        popup.classList.remove('show');
    }
});

// PDF Viewer functionality
let currentPage = 1;
let totalPages = 0;
let pdfViewer = null;

function togglePdfViewer() {
    const overlay = document.getElementById('pdf-viewer-overlay');
    if (overlay.style.display === 'block') {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    } else {
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        initPdfViewer();
    }
}

function initPdfViewer() {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
    
    const pdfUrl = '../docs/product-catalog.pdf';
    
    pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
        pdfViewer = pdf;
        totalPages = pdf.numPages;
        document.getElementById('total-pages').textContent = totalPages;
        renderPage(currentPage);
    });
}

function renderPage(pageNumber) {
    pdfViewer.getPage(pageNumber).then(page => {
        const canvas = document.getElementById('pdf-canvas');
        const context = canvas.getContext('2d');
        
        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = canvas.parentElement.clientWidth;
        const scale = containerWidth / viewport.width;
        
        const scaledViewport = page.getViewport({ scale });
        
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        
        page.render({
            canvasContext: context,
            viewport: scaledViewport
        });
    });
}

function goToPage(pageNum) {
    if (pageNum >= 1 && pageNum <= totalPages) {
        currentPage = pageNum;
        document.getElementById('current-page').textContent = currentPage;
        renderPage(currentPage);
    }
}

function previousPage() {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
}

// Handle manual page input
document.getElementById('page-input').addEventListener('change', (e) => {
    const pageNum = parseInt(e.target.value);
    if (pageNum >= 1 && pageNum <= totalPages) {
        goToPage(pageNum);
    } else {
        e.target.value = currentPage;
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (pdfViewer) {
        renderPage(currentPage);
    }
});

// Add touch swipe support for mobile
let touchStartX = 0;
const pdfContainer = document.querySelector('.pdf-viewer-container');

pdfContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

pdfContainer.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const difference = touchStartX - touchEndX;
    
    if (Math.abs(difference) > 50) { 
        if (difference > 0) {
            nextPage();
        } else {
            previousPage();
        }
    }
});

// Close PDF viewer when clicking outside
document.addEventListener('click', (e) => {
    const overlay = document.getElementById('pdf-viewer-overlay');
    if (e.target === overlay) {
        togglePdfViewer();
    }
});


// Toggle mobile navigation
function toggleNav() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
  
  // Navbar Scrolled Shadow
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Active Nav Link Highlighting
  const links = document.querySelectorAll('.nav-links a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  links.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath === linkPath) {
      link.classList.add('active');
    }
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const scrollElems = document.querySelectorAll('.animate-on-scroll');
  scrollElems.forEach(el => observer.observe(el));

  // Product Image Gallery logic
  const thumbs = document.querySelectorAll('.thumb-img');
  const mainImg = document.getElementById('mainImg');
  
  if (thumbs.length > 0 && mainImg) {
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', function() {
        // Remove active class from all
        thumbs.forEach(t => t.classList.remove('active'));
        // Add to clicked
        this.classList.add('active');
        // Update main image source
        // Fade effect could be added here by toggling an opacity class
        mainImg.style.opacity = '0';
        setTimeout(() => {
            mainImg.src = this.src;
            mainImg.style.opacity = '1';
        }, 150);
      });
    });
  }

  // Contact Form Logic (for contact.html)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const successMsg = document.getElementById('contactSuccess');
      successMsg.innerText = "Thank you! We'll get back to you within 24 hours.";
      successMsg.style.display = 'block';
      successMsg.style.color = 'var(--green)';
      successMsg.style.marginTop = '16px';
      successMsg.style.fontWeight = 'bold';
      this.reset();
    });
  }

});

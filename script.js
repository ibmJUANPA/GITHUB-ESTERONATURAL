/**
 * Estero Natural - JavaScript
 * Funcionalidades: Header scroll, menú móvil, scroll to top, navegación entre páginas
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================
  // ELEMENTOS DEL DOM
  // ===================================
  const header = document.getElementById('header');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const scrollToTopBtn = document.getElementById('scrollToTop');
  const navLinks = document.querySelectorAll('.nav-list a, .mobile-menu a');
  const logoImg = document.querySelector('.logo-img');

  // Detectar si estamos en una página interior
  const isInteriorPage = document.body.classList.contains('page-interior');

  // ===================================
  // HEADER SCROLL EFFECT
  // ===================================
  function updateHeaderLogo(useLightLogo) {
    if (!logoImg) return;

    const lightLogo = logoImg.dataset.logoLight;
    const darkLogo = logoImg.dataset.logoDark;

    if (!lightLogo || !darkLogo) return;

    logoImg.src = useLightLogo ? lightLogo : darkLogo;
  }

  function handleScroll() {
    const scrollY = window.scrollY;
    
    // Solo aplicar efecto scroll en la página de inicio (no en interiores)
    if (!isInteriorPage) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
        updateHeaderLogo(false);
      } else {
        header.classList.remove('scrolled');
        updateHeaderLogo(true);
      }
    } else {
      header.classList.add('header-interior');
      updateHeaderLogo(false);
    }
    
    // Mostrar/ocultar botón scroll to top
    if (scrollY > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }

  // Ejecutar al cargar y al hacer scroll
  handleScroll();
  window.addEventListener('scroll', handleScroll);

  // ===================================
  // MENÚ MÓVIL
  // ===================================
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      this.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace (excepto el toggle del dropdown)
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        if (!this.classList.contains('mobile-dropdown-toggle')) {
          mobileMenu.classList.remove('active');
          mobileMenuBtn.classList.remove('active');
        }
      });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
      if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      }
    });
  }

  // ===================================
  // DROPDOWN EXPERIENCIAS (DESKTOP)
  // ===================================
  const navDropdown = document.querySelector('.nav-dropdown');
  const navDropdownToggle = document.querySelector('.nav-dropdown-toggle');

  if (navDropdown && navDropdownToggle) {
    navDropdownToggle.addEventListener('click', function(e) {
      e.preventDefault();
      navDropdown.classList.toggle('open');
      this.setAttribute('aria-expanded', navDropdown.classList.contains('open'));
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function(e) {
      if (!navDropdown.contains(e.target)) {
        navDropdown.classList.remove('open');
        navDropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Cerrar al pulsar Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        navDropdown.classList.remove('open');
        navDropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===================================
  // DROPDOWN EXPERIENCIAS (MÓVIL)
  // ===================================
  const mobileDropdown = document.querySelector('.mobile-dropdown');
  const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');

  if (mobileDropdown && mobileDropdownToggle) {
    mobileDropdownToggle.addEventListener('click', function(e) {
      e.preventDefault();
      mobileDropdown.classList.toggle('open');
      this.setAttribute('aria-expanded', mobileDropdown.classList.contains('open'));
    });
  }

  // ===================================
  // SCROLL TO TOP
  // ===================================
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===================================
  // SMOOTH SCROLL PARA ENLACES INTERNOS (solo #)
  // ===================================
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Solo procesar enlaces que son anclas puras (#algo)
      if (href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerHeight = header.offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ===================================
  // ANIMACIÓN DE ELEMENTOS AL SCROLL
  // ===================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar elementos que queremos animar
  const animateElements = document.querySelectorAll(
    '.about-content, .gallery-item, .event-card, .experience-card, .contact-item'
  );
  
  animateElements.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(15px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // Agregar estilos de animación
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    
    /* Animación del menú hamburguesa */
    .mobile-menu-btn.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    .mobile-menu-btn.active span:nth-child(2) {
      opacity: 0;
    }
    .mobile-menu-btn.active span:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }
  `;
  document.head.appendChild(styleSheet);

});
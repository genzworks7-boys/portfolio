/**
 * NEXUS STUDIOS - Main Client-Side JavaScript
 * Modular interactive script handling navigation, form validation, project filters, and modals
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initActiveNavLink();
  initProjectFilters();
  initProjectModal();
  initTeamProfiles();
  initFeedbackForm();
  initServiceUrlParam();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. Navbar & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Handle scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('is-open');
      hamburger.classList.toggle('is-active', !isOpen);
      navLinks.classList.toggle('is-open', !isOpen);
      document.body.style.overflow = !isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', !isOpen);
    });

    // Close mobile menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-active');
        navLinks.classList.remove('is-open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. Active Link Detection
   -------------------------------------------------------------------------- */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   3. Service URL Query Parameter Pre-selection
   -------------------------------------------------------------------------- */
function initServiceUrlParam() {
  const serviceSelect = document.getElementById('service_interest');
  if (!serviceSelect) return;

  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');

  if (serviceParam) {
    const mapping = {
      'web': 'Web Development',
      'web-dev': 'Web Development',
      'web-development': 'Web Development',
      'academic': 'College & Academic Projects',
      'academic-projects': 'College & Academic Projects',
      'college': 'College & Academic Projects',
      'college-projects': 'College & Academic Projects',
      'poster': 'Poster & Graphic Design',
      'poster-design': 'Poster & Graphic Design',
      'graphic-design': 'Poster & Graphic Design',
      'graphics': 'Poster & Graphic Design',
      'video': 'Video Editing',
      'video-editing': 'Video Editing',
      'motion-graphics': 'Video Editing',
      'content': 'Content Writing',
      'content-writing': 'Content Writing',
      'copywriting': 'Content Writing',
      'content-creation': 'Content Writing'
    };

    const targetService = mapping[serviceParam.toLowerCase()];
    if (targetService) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value === targetService) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
  }
}

/* --------------------------------------------------------------------------
   4. Portfolio Projects Filtering (projects.html)
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategories = (card.getAttribute('data-category') || '').toLowerCase().split(/\s+/);
        if (filterValue === 'all' || cardCategories.includes(filterValue.toLowerCase())) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Project Preview Modal
   -------------------------------------------------------------------------- */
function initProjectModal() {
  const modalBackdrop = document.getElementById('projectModal');
  const closeBtn = document.querySelector('.modal-close');
  const previewBtns = document.querySelectorAll('.view-project-btn');

  if (!modalBackdrop) return;

  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalCategory = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDesc');
  const modalTools = document.getElementById('modalTools');

  previewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.project-card');
      if (!card) return;

      const title = card.querySelector('.project-title')?.innerText || '';
      const desc = card.querySelector('.project-desc')?.innerText || '';
      const imgSrc = card.querySelector('.project-thumb')?.getAttribute('src') || '';
      const catText = card.querySelector('.project-category-badge')?.innerText || '';
      const tools = Array.from(card.querySelectorAll('.tool-badge')).map(t => t.innerText);

      if (modalTitle) modalTitle.innerText = title;
      if (modalDesc) modalDesc.innerText = desc;
      if (modalImage) modalImage.setAttribute('src', imgSrc);
      if (modalCategory) modalCategory.innerText = catText;
      
      if (modalTools) {
        modalTools.innerHTML = tools.map(tool => `<span class="tool-badge">${tool}</span>`).join('');
      }

      modalBackdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modalBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   6. Team Member Profiles (team.html)
   -------------------------------------------------------------------------- */
function initTeamProfiles() {
  const modal = document.getElementById('teamProfileModal');
  const cards = document.querySelectorAll('.team-photo-card[aria-haspopup="dialog"]');

  if (!modal || !cards.length) return;

  const dialog = modal.querySelector('.team-profile-dialog');
  const closeButton = modal.querySelector('.team-profile-close');
  const title = document.getElementById('teamProfileTitle');
  const role = document.getElementById('teamProfileRole');
  const department = document.getElementById('teamProfileDepartment');
  const description = document.getElementById('teamProfileDescription');
  const responsibilities = document.getElementById('teamProfileResponsibilities');
  const instagramLink = document.getElementById('teamProfileInstagram');
  let activeCard = null;
  let previousBodyOverflow = '';

  if (!dialog || !closeButton || !title || !role || !department || !description || !responsibilities || !instagramLink) return;

  const closeProfile = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousBodyOverflow;
    activeCard?.setAttribute('aria-expanded', 'false');
    activeCard?.focus();
    activeCard = null;
  };

  const openProfile = (card) => {
    const name = card.querySelector('.team-photo-name')?.textContent?.trim();
    const memberRole = card.querySelector('.team-photo-role')?.textContent?.trim();
    const memberDepartment = card.querySelector('.team-photo-department')?.textContent?.trim();
    const bio = card.querySelector('.team-photo-bio')?.textContent?.trim();
    const instagramUrl = card.dataset.instagram;
    const duties = Array.from(card.querySelectorAll('.team-responsibilities li'))
      .map((item) => item.textContent.trim())
      .filter(Boolean);

    if (!name || !memberRole || !memberDepartment || !bio || !instagramUrl || !duties.length) return;

    title.textContent = name;
    role.textContent = memberRole;
    department.textContent = memberDepartment;
    description.textContent = bio;
    instagramLink.href = instagramUrl;
    instagramLink.textContent = `Instagram · @${new URL(instagramUrl).pathname.replace(/^\/|\/$/g, '')}`;
    responsibilities.replaceChildren(...duties.map((duty) => {
      const item = document.createElement('li');
      item.textContent = duty;
      return item;
    }));

    activeCard = card;
    activeCard.setAttribute('aria-expanded', 'true');
    previousBodyOverflow = document.body.style.overflow;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => openProfile(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProfile(card);
      }
    });
  });

  closeButton.addEventListener('click', closeProfile);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeProfile();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      event.preventDefault();
      closeProfile();
    }
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusableElements = Array.from(dialog.querySelectorAll('a[href], button:not([disabled])'));
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

/* --------------------------------------------------------------------------
   7. Feedback Form Validation & AJAX Submission
   -------------------------------------------------------------------------- */
function initFeedbackForm() {
  const form = document.getElementById('feedbackForm');
  if (!form) return;

  const nameInput = document.getElementById('client_name');
  const emailInput = document.getElementById('client_email');
  const serviceInput = document.getElementById('service_interest');
  const messageInput = document.getElementById('message');
  const charCounter = document.getElementById('charCount');
  const submitBtn = document.getElementById('submitBtn');
  const alertBox = document.getElementById('formAlert');

  const ratingContainer = document.getElementById('ratingContainer');
  const starBtns = document.querySelectorAll('#starRating .star-btn');
  const ratingScoreInput = document.getElementById('feedbackRating');
  const starRatingLabel = document.getElementById('starRatingLabel');
  const submitBtnText = submitBtn?.querySelector('span');

  if (submitBtnText) submitBtnText.textContent = 'Send via WhatsApp';
  if (ratingContainer) ratingContainer.style.display = 'block';

  // Star Rating Interaction
  const ratingDescriptions = {
    1: '1.0 / 5.0 (Poor)',
    2: '2.0 / 5.0 (Fair)',
    3: '3.0 / 5.0 (Good)',
    4: '4.0 / 5.0 (Very Good)',
    5: '5.0 / 5.0 (Excellent)'
  };

  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedVal = parseInt(btn.getAttribute('data-val'), 10) || 5;
      if (ratingScoreInput) ratingScoreInput.value = selectedVal;
      if (starRatingLabel) starRatingLabel.textContent = ratingDescriptions[selectedVal] || `${selectedVal}.0 / 5.0`;

      starBtns.forEach(b => {
        const val = parseInt(b.getAttribute('data-val'), 10);
        if (val <= selectedVal) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
        b.setAttribute('aria-pressed', String(val === selectedVal));
      });
    });
  });

  // Character counter for message textarea
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const currentLength = messageInput.value.length;
      charCounter.textContent = `${currentLength}/3000`;
      if (currentLength > 2800) {
        charCounter.style.color = 'var(--accent-rose)';
      } else {
        charCounter.style.color = 'var(--text-dim)';
      }
    });
  }

  // Remove error state on input
  [nameInput, emailInput, serviceInput, messageInput].forEach(field => {
    if (!field) return;
    const group = field.closest('.form-group');

    field.addEventListener('input', () => {
      if (group && group.classList.contains('has-error')) {
        validateField(field);
      }
    });

    field.addEventListener('blur', () => {
      validateField(field);
    });
  });

  // Individual Field Validator
  function validateField(field) {
    const group = field.closest('.form-group');
    if (!group) return true;

    const errorMsg = group.querySelector('.error-message');
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    if (field === nameInput) {
      if (!value) {
        isValid = false;
        message = 'Please enter your full name.';
      } else if (value.length < 2) {
        isValid = false;
        message = 'Name must be at least 2 characters.';
      }
    } else if (field === emailInput) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        isValid = false;
        message = 'Please enter your email address.';
      } else if (!emailRegex.test(value)) {
        isValid = false;
        message = 'Please enter a valid email address (e.g. name@domain.com).';
      }
    } else if (field === serviceInput) {
      if (!value || value === '') {
        isValid = false;
        message = 'Please select a feedback or inquiry topic.';
      }
    } else if (field === messageInput) {
      if (!value) {
        isValid = false;
        message = 'Please enter your message.';
      }
    }

    if (!isValid) {
      group.classList.add('has-error');
      if (errorMsg) errorMsg.textContent = message;
    } else {
      group.classList.remove('has-error');
      if (errorMsg) errorMsg.textContent = '';
    }

    return isValid;
  }

  // WhatsApp Form Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (alertBox) {
      alertBox.className = 'form-alert';
      alertBox.textContent = '';
    }

    const isNameValid = validateField(nameInput);
    const isEmailValid = validateField(emailInput);
    const isServiceValid = validateField(serviceInput);
    const isMessageValid = validateField(messageInput);

    if (!isNameValid || !isEmailValid || !isServiceValid || !isMessageValid) {
      showAlert('error', 'Please fill in all required fields before sending to WhatsApp.');
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const topic = serviceInput.value;
    const message = messageInput.value.trim();
    const ratingScore = ratingScoreInput?.value || '0';
    const ratingSummary = Number(ratingScore) > 0
      ? `${'★'.repeat(Number(ratingScore))}${'☆'.repeat(5 - Number(ratingScore))} (${ratingScore}/5)`
      : 'Not provided';

    const formattedText =
      `*Feedback / Inquiry - GEN-Z'WORKS*\n\n` +
      `Rating: ${ratingSummary}\n` +
      `Client Name: ${name}\n` +
      `Email: ${email}\n` +
      `Feedback / Inquiry Topic: ${topic}\n\n` +
      `Message:\n` +
      `${message}\n\n` +
      `Sent directly via GEN-Z'WORKS Website`;

    const whatsappNumber = '918754277982';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(formattedText)}`;

    showAlert('success', `Opening WhatsApp to send your message! If it didn't open automatically, <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" style="color:inherit; text-decoration:underline; font-weight:700; margin-left:4px;">Click here to send on WhatsApp &rarr;</a>`);

    window.open(whatsappUrl, '_blank');

    form.reset();
    if (charCounter) charCounter.textContent = '0/3000';
    if (ratingScoreInput) ratingScoreInput.value = '0';
    if (starRatingLabel) starRatingLabel.textContent = 'Choose a rating (optional)';
    starBtns.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
  });

  function showAlert(type, message) {
    if (!alertBox) return;
    alertBox.className = `form-alert is-visible form-alert-${type}`;
    
    const iconSvg = type === 'success' 
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    alertBox.innerHTML = `${iconSvg}<span>${message}</span>`;
  }
}

/* --------------------------------------------------------------------------
   7. Scroll Reveal — Word / Block Appear Animation (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-word');
  if (!revealEls.length) return;

  // Fallback for very old browsers: just show all
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          el.style.transitionDelay = delay + 'ms';
          el.classList.add('is-visible');
          observer.unobserve(el); // Fire once — no re-hiding on scroll back up
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealEls.forEach(el => {
    // Hero elements: animate on page load, not on scroll
    if (el.closest('#hero-section')) {
      const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(() => {
        el.classList.add('is-visible');
      }, 200 + delay);
    } else {
      observer.observe(el);
    }
  });
}

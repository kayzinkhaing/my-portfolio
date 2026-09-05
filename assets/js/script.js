$(document).ready(function () {

  // Toggle navbar on mobile
  $('#menu').click(function () {
    $(this).toggleClass('fa-times');
    $('.navbar').toggleClass('active');
  });

  // Close navbar on scroll or load
  $(window).on('scroll load', function () {
    $('#menu').removeClass('fa-times');
    $('.navbar').removeClass('active');

    // Scroll-top button show/hide
    if (window.scrollY > 60) {
      $('#scroll-top').addClass('active');
    } else {
      $('#scroll-top').removeClass('active');
    }

    // Scroll spy for nav highlighting
    $('section').each(function () {
      let height = $(this).height();
      let offset = $(this).offset().top - 200;
      let top = $(window).scrollTop();
      let id = $(this).attr('id');

      if (top > offset && top < offset + height) {
        $('.navbar ul li a').removeClass('active');
        $('.navbar').find(`[href="#${id}"]`).addClass('active');
      }
    });
  });

  // Smooth scroll behavior
  $('a[href^="#"]').on('click', function (e) {
    const target = document.querySelector($(this).attr('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });

    // Close mobile menu after clicking a link
    $('#menu').removeClass('fa-times');
    $('.navbar').removeClass('active');
  });

  // EmailJS init and form handling
  emailjs.init('IPG4bAYNz2xa__a9L');

  $('#contact-form').submit(function (e) {
    e.preventDefault();
    $('#hidden-time').val(new Date().toLocaleString());
    $('#loading-spinner').css('display', 'flex');

    emailjs.sendForm('service_lqy01yh', 'template_jsx4qqo', '#contact-form')
      .then(function () {
        $('#loading-spinner').hide();
        $('#success-modal').css('display', 'flex');
        $('#contact-form')[0].reset();
      })
      .catch(function (error) {
        console.error('Email failed:', error);
        $('#loading-spinner').hide();
      });
  });

  // Close modal logic
  $('#close-modal').click(function () {
    $('#success-modal').hide();
  });

  $(window).click(function (event) {
    if ($(event.target).is('#success-modal')) {
      $('#success-modal').hide();
    }
  });

});


document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Kay Zin Khaing";
            $("#favicon").attr("href", "assets/images/profile1.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
    });


// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: ["frontend development", "backend development", "web designing", "web development" , "full stack development"],
    loop: true,
    typeSpeed: 80,
    backSpeed: 50,
    backDelay: 800,
});

async function fetchProjects() {
  const response = await fetch('./projects/projects.json');
  if (!response.ok) throw new Error('Unable to load projects');
  return response.json();
}

async function fetchSkills() {
  const response = await fetch('./skills.json');
  if (!response.ok) throw new Error('Unable to load skills');
  return response.json();
}

function showSkills(skills) {
  const container = document.getElementById('skillsContainer');
  if (!container) return;
  container.innerHTML = skills.map(skill => `
    <div class="bar">
      <div class="info">
        <img src="${skill.icon}" alt="${skill.name} icon" loading="lazy" onerror="this.hidden = true">
        <span>${skill.name}</span>
      </div>
    </div>
  `).join('');
}

// The modern initializer below is the only active homepage carousel.

// disable developer mode
document.onkeydown = function (e) {
  if (e.keyCode == 123) return false;
  if (e.ctrlKey && e.shiftKey && [73, 67, 74].includes(e.keyCode)) return false;
  if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
};

fetchSkills().then(showSkills).catch(error => console.error('Skills could not be loaded:', error));

// Tilt js fallback
VanillaTilt.init(document.querySelectorAll(".tilt"), {
  max: 15,
});



// pre loader start
// function loader() {
//     document.querySelector('.loader-container').classList.add('fade-out');
// }
// function fadeOut() {
//     setInterval(loader, 500);
// }
// window.onload = fadeOut;
// pre loader end

// disable developer mode
document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}

async function initModernProjectCarousel() {
  const viewport = document.querySelector('.project-carousel-viewport');
  const track = document.querySelector('#work .project-grid');
  const dots = document.querySelector('.project-dots');
  const previous = document.querySelector('.project-prev');
  const next = document.querySelector('.project-next');
  if (!viewport || !track || !dots || !previous || !next) return;

  let projects;
  try {
    projects = await fetchProjects();
  } catch (error) {
    console.error('Projects could not be loaded:', error);
    return;
  }

  if (!projects.length) {
    console.error('No projects are available for the carousel.');
    return;
  }
  track.innerHTML = projects.map(project => `
    <article class="project-card" tabindex="0" aria-label="${project.name} project">
      <div class="project-card-image">
        <img src="./assets/images/projects/${project.image}" alt="${project.name} project image" draggable="false" loading="lazy">
      </div>
      <div class="project-card-body">
        <h3>${project.name}</h3>
        <p>${project.desc}</p>
        <div class="project-card-tags">
          ${project.technologies.map(technology => `<span>${technology}</span>`).join('')}
        </div>
        <div class="project-card-links">
          <a href="${project.links.view}" target="_blank" rel="noopener"><i class="fas fa-eye"></i> View</a>
          <a href="${project.links.code}" target="_blank" rel="noopener"><i class="fas fa-code"></i> Code</a>
        </div>
      </div>
    </article>
  `).join('');

  const cards = [...track.querySelectorAll('.project-card')];
  let current = 0;
  let isModalOpen = false;

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const baseTransform = card.style.transform;
      card.animate([
        { transform: baseTransform },
        { transform: `${baseTransform} rotate(0.8deg)` },
        { transform: `${baseTransform} rotate(-0.8deg)` },
        { transform: baseTransform }
      ], {
        duration: 360,
        easing: 'ease-in-out'
      });
    });
  });

  dots.innerHTML = cards.map((_, index) => `
    <button class="project-dot${index === 0 ? ' active' : ''}" type="button" role="tab" aria-label="Show project ${index + 1}" aria-selected="${index === 0}"></button>
  `).join('');

  function getOffset(index) {
    let offset = index - current;
    if (offset > cards.length / 2) offset -= cards.length;
    if (offset < -cards.length / 2) offset += cards.length;
    return offset;
  }

  function layout() {
    const isMobile = window.innerWidth <= 600;
    const spacing = isMobile ? 190 : window.innerWidth <= 1000 ? 210 : Math.min(360, window.innerWidth * 0.25);
    const visibleRange = isMobile ? 1 : 2;

    cards.forEach((card, index) => {
      const offset = getOffset(index);
      const distance = Math.abs(offset);
      const visible = distance <= visibleRange;
      const scale = distance === 0 ? 1 : distance === 1 ? (isMobile ? 0.78 : 0.86) : 0.72;
      const opacity = distance === 0 ? 1 : distance === 1 ? 0.84 : 0;
      card.style.transform = `translate(-50%, -50%) translateX(${offset * spacing}px) scale(${scale}) rotateY(${offset * -8}deg)`;
      card.style.opacity = opacity;
      card.style.zIndex = String(20 - distance);
      card.style.pointerEvents = visible && !isModalOpen ? 'auto' : 'none';
      card.classList.toggle('is-active', distance === 0);
    });

    viewport.classList.toggle('is-modal-open', isModalOpen);
    previous.disabled = isModalOpen;
    next.disabled = isModalOpen;

    dots.querySelectorAll('.project-dot').forEach((dot, index) => {
      const active = index === current;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', String(active));
      dot.disabled = isModalOpen;
    });
  }

  function move(step) {
    if (isModalOpen) return;
    current = (current + step + cards.length) % cards.length;
    layout();
  }

  const modal = document.querySelector('#project-modal');
  const modalImage = document.querySelector('#project-modal-image');
  const modalTitle = document.querySelector('#project-modal-title');
  const modalDescription = document.querySelector('#project-modal-description');
  const modalTags = document.querySelector('#project-modal-tags');
  const modalView = document.querySelector('#project-modal-view');
  const modalCode = document.querySelector('#project-modal-code');
  const closeModalButtons = modal ? modal.querySelectorAll('[data-modal-close]') : [];

  function setModalLink(link, url) {
    link.href = url || '#';
    link.classList.toggle('is-disabled', !url || url === '#');
    link.setAttribute('aria-disabled', String(!url || url === '#'));
  }

  function openModal(index) {
    const project = projects[index];
    if (!modal || !project) return;
    const cardImage = cards[index]?.querySelector('.project-card-image img');
    const imageSource = cardImage?.currentSrc || cardImage?.getAttribute('src') || `./assets/images/projects/${project.image}`;
    modalImage.removeAttribute('src');
    modalImage.loading = 'eager';
    modalImage.decoding = 'async';
    modalImage.src = imageSource;
    modalImage.alt = `${project.name} project image`;
    modalTitle.textContent = project.name;
    modalDescription.textContent = project.desc;
    modalTags.innerHTML = project.technologies.map(technology => `<span>${technology}</span>`).join('');
    setModalLink(modalView, project.links.view);
    setModalLink(modalCode, project.links.code);
    isModalOpen = true;
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('project-modal-open');
    layout();
    modal.querySelector('.project-modal-close').focus();
  }

  function closeModal() {
    if (!modal || !isModalOpen) return;
    isModalOpen = false;
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('project-modal-open');
    layout();
  }

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  dots.querySelectorAll('.project-dot').forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (isModalOpen) return;
      current = index;
      layout();
    });
  });
  track.addEventListener('click', event => {
    const card = event.target.closest('.project-card');
    if (!card) return;
    const index = cards.indexOf(card);
    if (isModalOpen || event.target.closest('a')) return;
    if (index !== current) {
      current = index;
      layout();
    } else {
      openModal(index);
    }
  });
  closeModalButtons.forEach(button => button.addEventListener('click', closeModal));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
  });
  window.addEventListener('resize', layout);
  layout();
}

initModernProjectCarousel();



/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

/* SCROLL HOME */
srtop.reveal('.home .content h3', { delay: 200 });
srtop.reveal('.home .content p', { delay: 200 });
srtop.reveal('.home .content .btn', { delay: 200 });

srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.home .linkedin', { interval: 600 });
srtop.reveal('.home .github', { interval: 800 });
srtop.reveal('.home .twitter', { interval: 1000 });
srtop.reveal('.home .telegram', { interval: 600 });
srtop.reveal('.home .instagram', { interval: 600 });
srtop.reveal('.home .dev', { interval: 600 });

/* SCROLL ABOUT */
srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 200 });
srtop.reveal('.about .content p', { delay: 200 });
srtop.reveal('.about .content .box-container', { delay: 200 });
srtop.reveal('.about .content .resumebtn', { delay: 200 });


/* SCROLL SKILLS */
srtop.reveal('.skills .container', { interval: 200 });
srtop.reveal('.skills .container .bar', { delay: 400 });

/* SCROLL EDUCATION */
srtop.reveal('.education .box', { interval: 200 });

/* SCROLL PROJECTS */
srtop.reveal('.work .project-card', { interval: 200 });

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.experience .timeline .container', { interval: 400 });

/* SCROLL CONTACT */
srtop.reveal('.contact .container', { delay: 400 });
srtop.reveal('.contact .container .form-group', { delay: 400 });



document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.toggle-details-btn');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Find the parent project-content container
            const projectContent = button.closest('.project-content');
            
            // Find the collapsible section within that project
            const details = projectContent.querySelector('.collapsible-details');

            // Toggle the state attribute
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                // Collapse the details
                details.setAttribute('data-state', 'collapsed');
                button.setAttribute('aria-expanded', 'false');
                button.innerHTML = '<i class="fas fa-chevron-down"></i> View Details';
            } else {
                // Expand the details
                details.setAttribute('data-state', 'expanded');
                button.setAttribute('aria-expanded', 'true');
                button.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Details';
            }
        });
    });
});
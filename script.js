// Store config data globally
let siteConfig = {};

// Function to load all JSON data
async function loadAllData() {
  try {
    // 1. Fetch Configuration (CV & Socials)
    const configResponse = await fetch('details/config.json');
    siteConfig = await configResponse.json();
    renderConfig(siteConfig);

    // 2. Fetch Projects
    const projectsResponse = await fetch('details/projects.json');
    const projectsData = await projectsResponse.json();
    renderProjects(projectsData);

    // 3. Fetch Skills
    const skillsResponse = await fetch('details/skills.json');
    const skillsData = await skillsResponse.json();
    renderSkills(skillsData);

    // 4. Fetch About
    const aboutResponse = await fetch('details/about.json');
    const aboutData = await aboutResponse.json();
    renderAbout(aboutData);

    // 5. Initialize animations & filters
    initAnimations();
    initFilters();

  } catch (error) {
    console.error('Error loading JSON data. Make sure files are in the "details" folder:', error);
  }
}

// Render Configurations (Socials & CV Buttons)
function renderConfig(data) {
  // A. Render Social Links (Hero & Footer)
  const heroSocials = document.getElementById('hero-socials');
  const footerSocials = document.getElementById('footer-socials');
  
  // Create HTML for social icons
  const socialHtml = data.socials.map(social => 
    `<a href="${social.url}" target="_blank" aria-label="${social.name}"><i class="${social.iconClass}"></i></a>`
  ).join('');

  if(heroSocials) heroSocials.innerHTML = socialHtml;
  if(footerSocials) footerSocials.innerHTML = socialHtml;

  // B. Update "View Online" CV Button
  const viewCvBtn = document.getElementById('viewCvBtn');
  if (viewCvBtn) {
    viewCvBtn.href = data.cv.fileUrl;
  }
}

// Render Projects
function renderProjects(projects) {
  const container = document.getElementById('projects-grid');
  let html = '';

  projects.forEach(project => {
    let buttonsHtml = '';
    if (project.buttons) {
      buttonsHtml = project.buttons.map(btn => 
        `<a href="${btn.url}" class="git-btn" target="_blank"> ${btn.text} <i class="${btn.icon}"></i></a>`
      ).join('');
    }

    html += `
      <div class="card" data-category="${project.category}">
          <img src="${project.image}" class="card-img" alt="${project.tech}">
          <div class="card-body">
              <h4 class="tech">${project.tech}</h4>
              <p>${project.description}</p>
              <div class="button-group">
                  ${buttonsHtml}
              </div>
          </div>
      </div>
    `;
  });

  container.innerHTML = html;
  
  const projectCountEl = document.getElementById('projectCount');
  if (projectCountEl) {
    projectCountEl.setAttribute('data-target', projects.length);
  }
}

// Render Skills
function renderSkills(skills) {
  const container = document.getElementById('skills-container');
  let html = '';

  skills.forEach(skill => {
    html += `
      <div class="skill" data-category="${skill.category}">
          <div class="circle" data-percent="${skill.percent}">
            <i class="${skill.icon} fa-2x icon"></i>
          </div>
          <div class="meta">
            <div class="value">0%</div>
            <div class="label">${skill.label}</div>
          </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Render About Section
function renderAbout(data) {
  document.getElementById('about-bio').innerHTML = data.bio;

  const eduContainer = document.getElementById('education-list');
  eduContainer.innerHTML = data.education.map(item => `
    <div class="timeline-item">
        <div class="role">${item.role}</div>
        <div>${item.place}</div>
        <div class="date">${item.date}</div>
    </div>
  `).join('');

  const expContainer = document.getElementById('experience-list');
  expContainer.innerHTML = data.experience.map(item => `
    <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="role">${item.role}</div>
        <div class="date">${item.date}</div>
    </div>
  `).join('');

  const keySkillsContainer = document.getElementById('key-skills-list');
  keySkillsContainer.innerHTML = data.keySkills.map(skill => `
    <div class="skill-tag">
        <i class="${skill.icon}"></i> ${skill.name}
    </div>
  `).join('');
}

// Initialize Filters
function initFilters() {
  const projectFilterButtons = document.querySelectorAll("#Projects .filter-btn");
  const projectCards = document.querySelectorAll(".card");

  projectFilterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
          projectFilterButtons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          const category = btn.getAttribute("data-filter");
          projectCards.forEach(card => {
              if (category === "all" || card.getAttribute("data-category") === category) {
                  card.style.display = "block";
              } else {
                  card.style.display = "none";
              }
          });
      });
  });

  const skillFilterButtons = document.querySelectorAll("#Skills .filter-btn");
  const skillItems = document.querySelectorAll(".skill");

  skillFilterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
          skillFilterButtons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          const category = btn.getAttribute("data-filter");
          skillItems.forEach(skill => {
              if (category === "all" || skill.getAttribute("data-category") === category) {
                  skill.style.display = "block";
              } else {
                  skill.style.display = "none";
              }
          });
      });
  });
}

// Initialize Animations
function initAnimations() {
  const statElements = document.querySelectorAll('[data-target]');
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        animateCounter(entry.target);
        entry.target.dataset.animated = 'true';
      }
    });
  }, { threshold: 0.5 });
  statElements.forEach(el => statsObserver.observe(el));

  const skills = Array.from(document.querySelectorAll(".skill"));
  const skillsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillEl = entry.target;
        if (!skillEl.dataset.animated) {
          animateSkill(skillEl);
          skillEl.dataset.animated = "true";
        }
      }
    });
  }, { threshold: 0.55 });
  skills.forEach(s => skillsObserver.observe(s));

  const animatedElements = document.querySelectorAll('[data-animate]');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible'); 
        }
    });
  }, { threshold: 0.1 });
  animatedElements.forEach(el => cardObserver.observe(el));
}

// Animation Helpers
function animateSkill(skillEl) {
  const circle = skillEl.querySelector(".circle");
  const valueEl = skillEl.querySelector(".value");
  const percent = Math.max(0, Math.min(100, Number(circle.getAttribute("data-percent") || 0)));
  const duration = 1200 + Math.random() * 600;
  const start = performance.now();
  const startPercent = 0; 

  skillEl.style.opacity = '0';
  skillEl.style.transform = 'scale(0.8) translateY(20px)';
  
  function step(now) {
    const elapsed = now - start;
    const t = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const current = startPercent + (percent - startPercent) * eased;
    const angle = current * 3.6;
    
    circle.style.setProperty("--angle", angle + "deg");
    valueEl.textContent = Math.round(current) + "%";
    
    skillEl.style.opacity = eased;
    skillEl.style.transform = `scale(${0.8 + eased * 0.2}) translateY(${20 - eased * 20}px)`;
    
    if (eased > 0.3) {
      circle.style.boxShadow = `
        inset 0 4px 8px rgba(255, 255, 255, 0.2),
        inset 0 -4px 8px rgba(0, 0, 0, 0.4),
        0 8px 20px rgba(0, 0, 0, 0.4),
        0 0 ${20 * eased}px rgba(253, 111, 0, ${0.3 * eased})
      `;
    }

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      circle.style.setProperty("--angle", (percent * 3.6) + "deg");
      valueEl.textContent = percent + "%";
      skillEl.style.opacity = '1';
      skillEl.style.transform = 'scale(1) translateY(0px)';
      circle.style.boxShadow = ''; 
    }
  }
  requestAnimationFrame(step);
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'), 10);
  const duration = 1500;
  const start = performance.now();
  
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    element.textContent = current + '+';
    if (progress < 1) requestAnimationFrame(step);
    else element.textContent = target + '+';
  }
  requestAnimationFrame(step);
}

// UI Interactions
document.addEventListener("DOMContentLoaded", () => {
  loadAllData();
  setupUIInteractions();
});

function setupUIInteractions() {
  // Progress Bar
  document.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolledPercentage = Math.max(0, Math.min(100, (scrollTop / scrollHeight) * 100));
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.width = scrollHeight > 0 ? scrolledPercentage + '%' : '100%';
  });

  // Dynamic CV Download Function
  function downloadCV() {
    if (!siteConfig.cv) {
        console.error("Config not loaded yet");
        return;
    }
    const link = document.createElement("a");
    link.href = siteConfig.cv.fileUrl; 
    link.download = siteConfig.cv.downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  const cvBtn1 = document.getElementById("cvBtn");
  const cvBtn2 = document.getElementById("cvBtn2");
  if(cvBtn1) cvBtn1.addEventListener("click", downloadCV);
  if(cvBtn2) cvBtn2.addEventListener("click", downloadCV);

  // Mobile menu
  const togglebtn = document.querySelector('.togglebtn');
  const nav = document.querySelector('.navlinks');
  const navLinksItems = document.querySelectorAll('.navlinks li a'); 

  if (togglebtn && nav) {
    togglebtn.addEventListener('click', function () {
      this.classList.toggle('click');
      nav.classList.toggle('open');
    });
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                nav.classList.remove('open');
                togglebtn.classList.remove('click');
            }
        });
    });
  }

  // Typed.js
  if (window.Typed) {
    new Typed('.input', {
      strings: ['Frontend Developer', 'UI/UX Designer', 'App Developer'],
      typeSpeed: 50,
      backSpeed: 80,
      loop: true
    });
  }

  // Theme Toggle
  const themeSwitch = document.getElementById('themeSwitch');
  const icon = themeSwitch.querySelector('i');
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
  themeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
  });

  initCanvas();
  initContactForm();
}

// Background Canvas
function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x; this.y = y;
            this.directionX = directionX; this.directionY = directionY;
            this.size = size; this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = '#e26403ff'; 
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.5) - 0.25;
            let directionY = (Math.random() * 0.5) - 0.25;
            let color = '#FD6F00';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                    + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(253, 111, 0,' + opacityValue * 0.2 + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    initParticles();
    animateParticles();
}

// Updated Contact Form - Sends 2 Emails (Admin + Auto-Reply)
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    function showFormMessage(msg, isError = false) {
        let el = document.querySelector('.form-success');
        if (!el) {
            el = document.createElement('div');
            el.className = 'form-success';
            el.style.position = 'fixed';
            el.style.top = '20px';
            el.style.left = '50%';
            el.style.transform = 'translateX(-50%)';
            el.style.background = isError ? '#ff4444' : 'var(--accent-color)';
            el.style.color = '#fff';
            el.style.padding = '12px 24px';
            el.style.borderRadius = '8px';
            el.style.zIndex = '11000';
            el.style.boxShadow = '0 6px 18px rgba(0,0,0,0.35)';
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.style.background = isError ? '#ff4444' : 'var(--accent-color)';
        el.style.opacity = '1';
        
        setTimeout(() => { el.style.opacity = '0'; }, 3000);
        setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 3500);
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        
        // 1. Loading State
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

        const serviceID = 'service_quhso05';   
        const adminTemplate = 'template_ukrly1m'; 
        const userTemplate = 'template_oem5i4b';  

        emailjs.sendForm(serviceID, adminTemplate, this)
            .then(() => {
                emailjs.sendForm(serviceID, userTemplate, this);

                showFormMessage('Message sent. I\'ll get back to you soon.');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            })
            .catch((error) => {
                console.error('FAILED...', error);
                showFormMessage('Failed to send. Please try again.', true);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
    });
}
//progress bar
document.addEventListener('scroll', updateProgressBar);

function updateProgressBar() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolledPercentage = Math.max(0, Math.min(100, (scrollTop / scrollHeight) * 100));
    const progressBar = document.getElementById('progressBar');
    
    if (progressBar && scrollHeight > 0) {
        progressBar.style.width = scrolledPercentage + '%';
    } else if (progressBar) {
        progressBar.style.width = '100%'; 
    }
}

//Scroll smooth
function scrollToSection(elementId) {
    const targetElement = document.getElementById(elementId);
    
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth', 
            block: 'start'      
        });
    }
}

//cv
document.getElementById("cvBtn").addEventListener("click", function() {
    const link = document.createElement("a");
    // Make sure this path is correct relative to your HTML file
    link.href = "resources/cv.pdf"; 
    link.download = "Supethum_Pathirana_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
//Animated skills
document.addEventListener("DOMContentLoaded", () => {
  const projectCount = document.querySelectorAll('.projects-grid .card').length;
  const projectCountEl = document.getElementById('projectCount');
  if (projectCountEl) {
    projectCountEl.setAttribute('data-target', projectCount);
  }

  // Counter animation for stats
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

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillEl = entry.target;
        if (!skillEl.dataset.animated) {
          animateSkill(skillEl);
          skillEl.dataset.animated = "true";
        }
      }
    });
  }, {
    threshold: 0.55
  });

  skills.forEach(s => observer.observe(s));
});


function animateSkill(skillEl) {
  const circle = skillEl.querySelector(".circle");
  const valueEl = skillEl.querySelector(".value");

  const percent = Math.max(0, Math.min(100, Number(circle.getAttribute("data-percent") || 0)));

  const duration = 1200 + Math.random() * 600;
  const start = performance.now();
  const startPercent = 0; 

  // Add entrance animation
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
    
    // Animate entrance: opacity and scale
    skillEl.style.opacity = eased;
    skillEl.style.transform = `scale(${0.8 + eased * 0.2}) translateY(${20 - eased * 20}px)`;
    
    // Add glow effect during animation
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

// Counter animation function
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'), 10);
  const duration = 1500;
  const start = performance.now();
  
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(1, elapsed / duration);
    
    // Easing function for smooth animation
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    
    element.textContent = current + '+';
    
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = target + '+';
    }
  }
  
  requestAnimationFrame(step);
}

//education and experience tabs
const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible'); 
                }
            });
        }, {
            threshold: 0.1
        });
        
const animatedElements = document.querySelectorAll('[data-animate]');
animatedElements.forEach(el => observer.observe(el));

// --------- UPDATED FILTER LOGIC -----------

// 1. Projects Filter Logic (Only selects buttons inside #Projects)
const projectFilterButtons = document.querySelectorAll("#Projects .filter-btn");
const projectCards = document.querySelectorAll(".card");

projectFilterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove active class from only project buttons
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

// 2. Skill Filter Logic (Only selects buttons inside #Skills)
const skillFilterButtons = document.querySelectorAll("#Skills .filter-btn");
const skillItems = document.querySelectorAll(".skill");

skillFilterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove active class from only skill buttons
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

// --------- END UPDATED FILTER LOGIC -----------


// Menu toggle & Typed intro & Canvas particle animation
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const togglebtn = document.querySelector('.togglebtn');
  const nav = document.querySelector('.navlinks');
  const navLinksItems = document.querySelectorAll('.navlinks li a'); 

  if (togglebtn && nav) {
    togglebtn.addEventListener('click', function () {
      this.classList.toggle('click');
      nav.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                nav.classList.remove('open');
                togglebtn.classList.remove('click');
            }
        });
    });
  }

  // Typed.js intro animation
  if (window.Typed) {
    new Typed('.input', {
      strings: ['Frontend Developer', 'UI/UX Designer', 'App Developer'],
      typeSpeed: 50,
      backSpeed: 80,
      loop: true
    });
  }
  
  // --- THEME TOGGLE LOGIC ---
  const themeSwitch = document.getElementById('themeSwitch');
  const icon = themeSwitch.querySelector('i');
  
  // Check for saved preference
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


});

// --- BACKGROUND PARTICLE ANIMATION ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;

// Resize canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    // Method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#e26403ff'; 
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// Create particle pool
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

// Check if particles are close enough to draw a line between them
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

// Animation loop
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

// Contact form: submit via AJAX, show success message and scroll to Home
(function() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  function showFormMessage(msg) {
    let el = document.querySelector('.form-success');
    if (!el) {
      el = document.createElement('div');
      el.className = 'form-success';
      el.style.position = 'fixed';
      el.style.top = '16px';
      el.style.left = '50%';
      el.style.transform = 'translateX(-50%)';
      el.style.background = 'var(--accent-color)';
      el.style.color = '#fff';
      el.style.padding = '10px 16px';
      el.style.borderRadius = '8px';
      el.style.zIndex = '11000';
      el.style.boxShadow = '0 6px 18px rgba(0,0,0,0.35)';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    el.style.transition = 'opacity 0.4s ease';
    setTimeout(() => { el.style.opacity = '0'; }, 2200);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 3000);
  }

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.submit-btn');
    if (submitBtn) submitBtn.disabled = true;

    const action = contactForm.getAttribute('action') || window.location.href;
    const method = (contactForm.getAttribute('method') || 'POST').toUpperCase();
    const formData = new FormData(contactForm);

    try {
      const res = await fetch(action, {
        method: method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        showFormMessage('Sent successfully — thank you!');
        contactForm.reset();
        // scroll to Home section (small delay so message is visible)
        setTimeout(() => scrollToSection('Home'), 300);
      } else {
        // Fallback to normal submit if server didn't accept AJAX
        contactForm.submit();
      }
    } catch (err) {
      // Network/CORS fallback: submit the form normally
      contactForm.submit();
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
})();
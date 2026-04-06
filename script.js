/* ============================================
   NAV — scroll state + active link
   ============================================ */
const nav      = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', onScroll, { passive: true });

function onScroll() {
  // Scrolled state
  nav.classList.toggle('scrolled', window.scrollY > 60);

  // Active node + nav link
  updateActiveSection();
}

/* ============================================
   SPINE — node positioning
   ============================================ */
const sectionIds = ['about', 'skills', 'projects', 'achievements', 'beyond', 'contact'];
const spineNodes = document.querySelectorAll('.spine-node');
const spineEl    = document.getElementById('spineLine');

function positionSpineNodes() {
  if (!spineEl) return;

  const spineTop = spineEl.getBoundingClientRect().top + window.scrollY;

  sectionIds.forEach((id, i) => {
    const section = document.getElementById(id);
    const node    = spineNodes[i];
    if (!section || !node) return;

    // Place node at vertical midpoint of its section
    const mid = section.offsetTop + section.offsetHeight * 0.5;
    node.style.top = (mid - spineTop) + 'px';
  });
}

/* ============================================
   ACTIVE SECTION — spine + nav
   ============================================ */
function updateActiveSection() {
  // Use 40% from top as the trigger line — feels natural
  const triggerY = window.scrollY + window.innerHeight * 0.4;

  let activeId = sectionIds[0];

  sectionIds.forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;
    if (section.offsetTop <= triggerY) {
      activeId = id;
    }
  });

  // Update spine nodes
  spineNodes.forEach((node, i) => {
    node.classList.toggle('active', sectionIds[i] === activeId);
  });

  // Update nav links
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#${activeId}`);
  });
}

/* ============================================
   SCROLL FADE-IN — Intersection Observer
   ============================================ */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Unobserve after triggering — no need to watch further
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.section').forEach(s => fadeObserver.observe(s));

/* ============================================
   INIT
   ============================================ */
window.addEventListener('load', () => {
  positionSpineNodes();
  updateActiveSection();
});

window.addEventListener('resize', () => {
  positionSpineNodes();
  updateActiveSection();
}, { passive: true });

/* Montage page — camera-style slideshow (up to 20 photos) */

const captions = [
  'Us, always 💕',
  'My favorite person',
  'Forever with you, Baby',
  'Every moment matters',
  'Nervy, my love',
  'Best days with you',
  '360 km apart, heart together',
  'My whole world',
  'Smiles with you',
  'Unforgettable',
  'Always on my mind',
  'My reason why',
  'Together in memory',
  'Love you, Baby',
  'Our story',
  'Perfect moments',
  'Held in my heart',
  'My beautiful Nervy',
  'Counting down to us',
  'Always yours'
];

let currentIndex = 0;
let scrollTimeout = null;

function buildSlides() {
  const stage = document.getElementById('photoStage');
  if (!stage) return;
  // Build a horizontal film-strip (like main UI) and auto-scroll it
  const configPhotos = Array.isArray(BIRTHDAY_CONFIG.montagePhotos) ? BIRTHDAY_CONFIG.montagePhotos : [];
  const totalSlots = 20;
  document.title = `Memories — ${BIRTHDAY_CONFIG.nickname} 📷`;

  stage.innerHTML = `<div class="montage-strip"><div class="montage-track" id="montageTrack"></div></div>`;
  const track = document.getElementById('montageTrack');
  if (!track) return;

  for (let i = 0; i < totalSlots; i++) {
    const src = configPhotos[i] || `images/${String(i + 1).padStart(2, '0')}.jpg`;
    const frame = document.createElement('div');
    frame.className = 'montage-frame';
    const num = String(i + 1).padStart(2, '0');
    frame.innerHTML = `
      <img src="${src}" alt="Memory ${num}" loading="lazy">
      <div class="frame-label">Photo ${num}</div>
    `;
    track.appendChild(frame);
  }

  // Duplicate frames for seamless looping
  const clones = track.innerHTML;
  track.innerHTML += clones;

  // Start scrolling animation; duration proportional to total frames
  const duration = Math.max(18, totalSlots * 1.2); // seconds
  track.style.animationDuration = `${duration}s`;
  track.classList.add('scrolling');

  updateCounter();
}

/* Floating flowers for montage */
const FLOWER_VARIANTS = [
  { emoji: '🌹', filter: 'none' },
  { emoji: '🌺', filter: 'hue-rotate(10deg) saturate(1.2)' },
  { emoji: '🌸', filter: 'hue-rotate(330deg) saturate(1.2)' },
  { emoji: '🌷', filter: 'hue-rotate(300deg) saturate(1.1)' },
  { emoji: '🏵️', filter: 'hue-rotate(330deg) saturate(1.05)' }
];

function createFlowers() {
  const container = document.getElementById('flowersBg');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const v = FLOWER_VARIANTS[i % FLOWER_VARIANTS.length];
    const sp = document.createElement('span');
    sp.className = 'floating-flower';
    sp.textContent = v.emoji;
    sp.style.filter = v.filter + ' drop-shadow(0 2px 6px rgba(0,0,0,0.25))';
    sp.style.left = Math.random() * 100 + '%';
    sp.style.fontSize = (1.4 + Math.random() * 1.8) + 'rem';
    sp.style.animationDuration = (10 + Math.random() * 12) + 's';
    sp.style.animationDelay = (Math.random() * 12) + 's';
    container.appendChild(sp);
  }
}

createFlowers();

function getSlides() {
  return document.querySelectorAll('.slide');
}

function updateCounter() {
  const counter = document.getElementById('frameCounter');
  const slides = getSlides();
  if (counter && slides.length) {
    counter.textContent = `FRAME ${String(currentIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  }
}

function flashShutter() {
  const flash = document.getElementById('shutterFlash');
  if (!flash) return;
  flash.classList.add('flash');
  setTimeout(() => flash.classList.remove('flash'), 100);
}

function setupScrollBehavior() {
  const stage = document.getElementById('photoStage');
  if (!stage) return;

  // Update currentIndex based on centered slide in view
  function updateIndex() {
    const slides = Array.from(getSlides());
    const center = stage.scrollLeft + stage.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((s, i) => {
      const rect = s.getBoundingClientRect();
      const slideCenter = s.offsetLeft + s.offsetWidth / 2;
      const dist = Math.abs(slideCenter - center);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    if (best !== currentIndex) {
      currentIndex = best;
      updateCounter();
    }
  }

  let onScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    updateIndex();
    // detect reach end -> loop back
    scrollTimeout = setTimeout(() => {
      const maxScroll = stage.scrollWidth - stage.clientWidth;
      if (stage.scrollLeft >= maxScroll - 20) {
        stage.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 120);
  };

  stage.addEventListener('scroll', onScroll, { passive: true });

  // Ensure keyboard accessibility: left/right arrows
  stage.tabIndex = 0;
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      stage.scrollBy({ left: stage.clientWidth, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      stage.scrollBy({ left: -stage.clientWidth, behavior: 'smooth' });
    }
  });
}

function updateClock() {
  const clock = document.getElementById('cameraTime');
  if (!clock) return;
  clock.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
}

buildSlides();
// No automatic slideshow: user scrolls through images; update clock only
updateClock();
setInterval(updateClock, 1000);

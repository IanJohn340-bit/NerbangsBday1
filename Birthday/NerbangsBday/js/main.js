/* Main birthday page — film reel, hearts, confetti */

function buildFilmReel() {
  const track = document.getElementById('filmTrack');
  if (!track) return;

  const photos = BIRTHDAY_CONFIG.filmPhotos;
  const showLabels = BIRTHDAY_CONFIG.showPhotoLabels;
  const frames = [...photos, ...photos];

  track.innerHTML = '';
  frames.forEach((photo, i) => {
    const index = (i % photos.length) + 1;
    const frame = document.createElement('div');
    frame.className = 'film-frame';

    const labelHtml = showLabels
      ? `<span class="photo-label">
           <strong>${photo.label}</strong>
           <small>Add here →</small>
           <code>${photo.path}</code>
         </span>`
      : '';

    frame.innerHTML = `
      <img src="${photo.path}" alt="${photo.label}" loading="lazy">
      ${labelHtml}
    `;

    const img = frame.querySelector('img');
    const label = frame.querySelector('.photo-label');
    if (img && label) {
      img.addEventListener('load', () => {
        if (img.naturalWidth > 0) label.classList.add('photo-loaded');
      });
      img.addEventListener('error', () => label.classList.add('photo-missing'));
    }

    track.appendChild(frame);
  });
}

function personalizePage() {
  const { nickname } = BIRTHDAY_CONFIG;
  document.title = `Happy Birthday, ${nickname} ❤️`;

  const title = document.getElementById('pageTitle');
  if (title) title.textContent = `Happy Birthday, ${nickname}`;

  const message = document.getElementById('personalMessage');
  if (message) {
    message.textContent =
      'Happy Birthday Baby, although i may not be with you right now i hope you feel my love 360 km away. 💕';
  }
}

const confettiColors = ['#ff4d6d', '#c9184a', '#ff758f', '#e63946', '#ffb3c1', '#4d7cff', '#6b8cff'];

function createHearts() {
  const container = document.getElementById('heartsBg');
  if (!container) return;

  const hearts = ['❤️', '💕', '💖', '💗', '🩷'];
  for (let i = 0; i < 14; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = hearts[i % hearts.length];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
    heart.style.animationDuration = (10 + Math.random() * 8) + 's';
    heart.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(heart);
  }
}

function createSparkles() {
  const container = document.getElementById('sparkles');
  if (!container) return;

  for (let i = 0; i < 60; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle ' + (Math.random() > 0.75 ? 'blue' : 'red');
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 3 + 's';
    sparkle.style.animationDuration = (1.5 + Math.random() * 2) + 's';
    container.appendChild(sparkle);
  }
}

const canvas = document.getElementById('confetti');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
let animating = false;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawHeart(x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, size * 0.3);
  ctx.bezierCurveTo(0, 0, -size, 0, -size, size * 0.3);
  ctx.bezierCurveTo(-size, size * 0.7, 0, size, 0, size * 1.2);
  ctx.bezierCurveTo(0, size, size, size * 0.7, size, size * 0.3);
  ctx.bezierCurveTo(size, 0, 0, 0, 0, size * 0.3);
  ctx.fill();
  ctx.restore();
}

function createConfetti() {
  particles = [];
  for (let i = 0; i < 180; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: 6 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedY: 2 + Math.random() * 4,
      speedX: -2 + Math.random() * 4,
      rotation: Math.random() * 360,
      rotationSpeed: -5 + Math.random() * 10,
      opacity: 1,
      shape: Math.random() > 0.5 ? 'rect' : 'heart'
    });
  }
}

function animateConfetti() {
  if (!animating || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let alive = false;
  particles.forEach(p => {
    p.y += p.speedY;
    p.x += p.speedX;
    p.rotation += p.rotationSpeed;
    p.speedY += 0.04;
    if (p.y < canvas.height + 20) alive = true;

    ctx.save();
    ctx.globalAlpha = p.opacity;
    if (p.shape === 'heart') {
      drawHeart(p.x, p.y, p.w * 0.5, p.color);
    } else {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }
    ctx.restore();
  });

  if (alive) requestAnimationFrame(animateConfetti);
  else {
    animating = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function launchConfetti() {
  if (!canvas) return;
  createConfetti();
  animating = true;
  animateConfetti();
}

window.addEventListener('resize', resizeCanvas);

personalizePage();
buildFilmReel();
createHearts();
createSparkles();
resizeCanvas();
setTimeout(launchConfetti, 900);

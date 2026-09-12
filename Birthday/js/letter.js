/* Letter page — floating roses, envelope click, letter reveal */

const ROSE_VARIANTS = [
  { emoji: '🌹', filter: 'none' },
  { emoji: '🌹', filter: 'hue-rotate(320deg) saturate(1.4)' },
  { emoji: '🌹', filter: 'hue-rotate(350deg) brightness(1.2)' },
  { emoji: '🥀', filter: 'hue-rotate(340deg) saturate(0.9)' },
  { emoji: '🌷', filter: 'hue-rotate(300deg) saturate(1.1)' },
  { emoji: '💮', filter: 'hue-rotate(280deg) saturate(1.2)' },
  { emoji: '🌺', filter: 'hue-rotate(10deg) saturate(1.3)' },
  { emoji: '🏵️', filter: 'hue-rotate(330deg) saturate(1.05)' },
  { emoji: '🥀', filter: 'hue-rotate(200deg) saturate(1.1) brightness(0.95)' },
  { emoji: '🌸', filter: 'hue-rotate(340deg) saturate(1.25)' }
];

function createRoses() {
  const container = document.getElementById('rosesBg');
  if (!container) return;

  for (let i = 0; i < 24; i++) {
    const variant = ROSE_VARIANTS[i % ROSE_VARIANTS.length];
    const rose = document.createElement('span');
    rose.className = 'floating-rose';
    rose.textContent = variant.emoji;
    rose.style.filter = variant.filter + ' drop-shadow(0 2px 6px rgba(0,0,0,0.25))';
    rose.style.left = Math.random() * 100 + '%';
    rose.style.fontSize = (1.2 + Math.random() * 1.4) + 'rem';
    rose.style.animationDuration = (12 + Math.random() * 10) + 's';
    rose.style.animationDelay = (Math.random() * 12) + 's';
    container.appendChild(rose);
  }
}

function buildLetter() {
  const { letter, nickname, name } = BIRTHDAY_CONFIG;

  document.title = `A Letter for ${nickname} 💌`;

  const greeting = document.getElementById('letterGreeting');
  if (greeting) greeting.textContent = letter.greeting;

  const body = document.getElementById('letterBody');
  if (body) {
    body.innerHTML = letter.paragraphs
      .map(p => `<p>${p.replace(/\bNervy\b/g, name).replace(/\bBaby\b/g, nickname)}</p>`)
      .join('');
  }

  const closing = document.getElementById('letterClosing');
  if (closing) closing.textContent = letter.closing;

  const signature = document.getElementById('letterSignature');
  if (signature) signature.textContent = letter.signature;
}

function setupEnvelope() {
  const wrapper = document.getElementById('envelopeWrapper');
  const stage = document.getElementById('envelopeStage');
  const paper = document.getElementById('letterPaper');
  if (!wrapper || !stage || !paper) return;

  wrapper.addEventListener('click', () => {
    if (stage.classList.contains('removed')) return;

    wrapper.classList.add('opening');

    setTimeout(() => {
      stage.classList.add('removed');
      paper.classList.add('visible');
    }, 650);
  });
}

createRoses();
buildLetter();
setupEnvelope();

document.addEventListener('DOMContentLoaded', () => {
  // 1. TABS NAVIGATION FOR 7 ENTRIES
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      // Update active button
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active pane
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetId) {
          pane.classList.add('active');
        }
      });

      // Smooth scroll to entry title on mobile
      if (window.innerWidth < 768) {
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 2. THEME TOGGLE (LIGHT / DARK)
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('mente_en_juego_theme') || 'light';
  
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.textContent = '🌓';
      localStorage.setItem('mente_en_juego_theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '☀️';
      localStorage.setItem('mente_en_juego_theme', 'dark');
    }
  });

  // 3. INTERACTIVE PODCAST PLAYER SIMULATION WITH WEB AUDIO API
  const audioToggle = document.getElementById('audioToggle');
  const audioProgress = document.getElementById('audioProgress');
  const audioTime = document.getElementById('audioTime');

  let isPlaying = false;
  let playInterval = null;
  let currentSeconds = 0;
  const totalSeconds = 390; // 06:30 mins

  // Web Audio Synth for ambient demo chime
  let audioCtx = null;
  let oscillator = null;
  let gainNode = null;

  function initAudioTone() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    } catch (e) {
      console.log('Web Audio not supported');
    }
  }

  function playSoftChime() {
    if (!audioCtx) initAudioTone();
    if (!audioCtx) return;
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
    osc.frequency.exponentialRampToValueAtTime(554.37, audioCtx.currentTime + 0.3); // C#5
    osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.6); // E5

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      isPlaying = !isPlaying;

      if (isPlaying) {
        audioToggle.textContent = '⏸ Pausar Demo';
        audioToggle.style.background = '#059669';
        playSoftChime();

        playInterval = setInterval(() => {
          currentSeconds += 1;
          if (currentSeconds > totalSeconds) {
            currentSeconds = 0;
            isPlaying = false;
            clearInterval(playInterval);
            audioToggle.textContent = '▶ Reproducir Demo';
            audioToggle.style.background = '';
          }
          const pct = (currentSeconds / totalSeconds) * 100;
          audioProgress.style.width = `${pct}%`;
          audioTime.textContent = `${formatTime(currentSeconds)} / 06:30`;
        }, 1000);
      } else {
        audioToggle.textContent = '▶ Continuar';
        audioToggle.style.background = '';
        clearInterval(playInterval);
      }
    });
  }

  console.log('Mente en Juego: Blog interactivo de intervención psicosocial inicializado con éxito.');
});

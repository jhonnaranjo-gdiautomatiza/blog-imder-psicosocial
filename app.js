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

  // 3. REAL PODCAST AUDIO CONTROLLER
  const podcastAudio = document.getElementById('podcastAudio');
  const audioToggle = document.getElementById('audioToggle');
  const audioProgress = document.getElementById('audioProgress');
  const audioTime = document.getElementById('audioTime');
  const trackBar = document.getElementById('trackBar');

  if (podcastAudio && audioToggle) {
    function formatTime(sec) {
      if (isNaN(sec) || !isFinite(sec)) return "00:00";
      const m = Math.floor(sec / 60).toString().padStart(2, '0');
      const s = Math.floor(sec % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    podcastAudio.addEventListener('loadedmetadata', () => {
      audioTime.textContent = `00:00 / ${formatTime(podcastAudio.duration)}`;
    });

    podcastAudio.addEventListener('timeupdate', () => {
      const cur = podcastAudio.currentTime;
      const dur = podcastAudio.duration || 184;
      const pct = (cur / dur) * 100;
      audioProgress.style.width = `${pct}%`;
      audioTime.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
    });

    podcastAudio.addEventListener('ended', () => {
      audioToggle.textContent = '▶ Escuchar Podcast';
      audioToggle.style.background = '';
      audioProgress.style.width = '0%';
    });

    audioToggle.addEventListener('click', () => {
      if (podcastAudio.paused) {
        podcastAudio.play().then(() => {
          audioToggle.textContent = '⏸ Pausar Podcast';
          audioToggle.style.background = '#059669';
        }).catch(err => {
          console.error("Audio playback error:", err);
        });
      } else {
        podcastAudio.pause();
        audioToggle.textContent = '▶ Continuar';
        audioToggle.style.background = '';
      }
    });

    if (trackBar) {
      trackBar.style.cursor = 'pointer';
      trackBar.addEventListener('click', (e) => {
        const rect = trackBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (podcastAudio.duration) {
          podcastAudio.currentTime = pos * podcastAudio.duration;
        }
      });
    }
  }

  console.log('Mente en Juego: Blog interactivo y reproductor de audio inicializados con éxito.');
});

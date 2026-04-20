// =============================================
// PLATA — main.js (FIXED v2)
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Saludo dinámico ──
  const saludoEl = document.getElementById('saludo');
  if (saludoEl) {
    const h = new Date().getHours();
    saludoEl.textContent = h < 12 ? '☀️ Buenos días' : h < 19 ? '🌤 Buenas tardes' : '🌙 Buenas noches';
  }

  // ── Toggle saldo ──
  const balanceWrap = document.getElementById('balance-wrap');
  const balanceVal  = document.getElementById('balance-val');
  let visible = true;
  if (balanceWrap && balanceVal) {
    balanceWrap.addEventListener('click', () => {
      visible = !visible;
      balanceVal.textContent = visible ? '118.19' : '••••••';
      balanceVal.style.letterSpacing = visible ? '-2px' : '4px';
      balanceVal.style.fontSize = visible ? '' : '28px';
    });
  }

  // ── Barra salud animada ──
  const bar = document.getElementById('salud-bar');
  if (bar) {
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = '52%'; }, 400);
  }

  // ── Ripple en botones ──
  document.querySelectorAll('.action-btn, .qr-btn, .btn-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const circle = document.createElement('span');
      const d = Math.max(this.clientWidth, this.clientHeight);
      const r = this.getBoundingClientRect();
      Object.assign(circle.style, {
        position: 'absolute',
        width: d + 'px',
        height: d + 'px',
        left: (e.clientX - r.left - d / 2) + 'px',
        top:  (e.clientY - r.top  - d / 2) + 'px',
        background: 'rgba(255,255,255,.35)',
        borderRadius: '50%',
        transform: 'scale(0)',
        animation: 'ripple .5s linear',
        pointerEvents: 'none',
        zIndex: '10'
      });
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 500);
    });
  });

  // ── Alerta: cerrar al tocar ──
  const alertEl = document.getElementById('alert-strip');
  if (alertEl) {
    alertEl.addEventListener('click', () => {
      alertEl.style.opacity    = '0';
      alertEl.style.maxHeight  = '0';
      alertEl.style.padding    = '0';
      alertEl.style.margin     = '0';
      alertEl.style.overflow   = 'hidden';
    });
  }

  // ── Chat FAB: ocultar al hacer scroll hacia abajo ──
  const fab = document.querySelector('.chat-fab');
  if (fab) {
    let lastY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          const goingDown = y > lastY && y > 60;
          fab.style.transform = goingDown ? 'translateY(100px)' : 'translateY(0)';
          fab.style.opacity   = goingDown ? '0' : '1';
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ── Progress bars animadas (páginas internas) ──
  document.querySelectorAll('.prog-fill').forEach(fill => {
    const target = fill.style.width;
    fill.style.width = '0%';
    setTimeout(() => {
      fill.style.width = target;
    }, 300);
  });

  // ── Active nav item highlight ──
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && href === currentPath) {
      // ya viene marcado en el HTML pero por si acaso
      item.classList.add('active');
    }
  });

  // ── Smooth scroll para elementos internos ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
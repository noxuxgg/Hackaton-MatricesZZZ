/**
 * PLATA Guided Simulations
 * - Controla el orden de simulaciones según el menú
 * - Muestra popups (reutiliza estilos sim-overlay/sim-popup)
 * - Persiste progreso en localStorage
 */
(function (global) {
  var KEY = 'plata_guided_v1';
  var FLOW = [
    { key: 'ingreso', title: 'Simular ingreso', url: 'simular-ingreso.html' },
    { key: 'pagoqr', title: 'Simular pago QR', url: 'simular-pago-qr.html' },
    { key: 'retos', title: 'Reto mensual/semanal', url: 'retos-mensuales.html' },
    { key: 'ufv', title: 'Inversión UFV', url: 'menu-ufvs.html' }
  ];

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : { active: false, current: FLOW[0].key, step: 0, done: {} };
    } catch (e) {
      return { active: false, current: FLOW[0].key, step: 0, done: {} };
    }
  }
  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }
  function idxOf(key) {
    for (var i = 0; i < FLOW.length; i++) if (FLOW[i].key === key) return i;
    return 0;
  }

  function ensureOverlay() {
    var existing = document.getElementById('guide-overlay');
    if (existing) return existing;
    var overlay = document.createElement('div');
    overlay.id = 'guide-overlay';
    overlay.className = 'sim-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.zIndex = '500';
    overlay.innerHTML =
      '<div class="sim-popup">' +
        '<div class="sim-popup-handle"></div>' +
        '<div class="sim-popup-title" id="guide-title">Guía</div>' +
        '<p class="sim-popup-sub" id="guide-sub">...</p>' +
        '<div class="sim-popup-actions">' +
          '<button type="button" class="btn-ghost" id="guide-skip">Salir</button>' +
          '<button type="button" class="btn-primary" id="guide-next">Continuar</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeOverlay();
    });
    return overlay;
  }

  function openOverlay(title, sub, nextLabel) {
    var overlay = ensureOverlay();
    var t = overlay.querySelector('#guide-title');
    var s = overlay.querySelector('#guide-sub');
    var n = overlay.querySelector('#guide-next');
    t.textContent = title || 'Guía';
    s.innerHTML = sub || '';
    n.textContent = nextLabel || 'Continuar';
    overlay.classList.add('is-open');
  }
  function closeOverlay() {
    var overlay = document.getElementById('guide-overlay');
    if (overlay) overlay.classList.remove('is-open');
  }

  function setHandlers(onNext, onSkip) {
    var overlay = ensureOverlay();
    var nextBtn = overlay.querySelector('#guide-next');
    var skipBtn = overlay.querySelector('#guide-skip');
    nextBtn.onclick = onNext || null;
    skipBtn.onclick = onSkip || null;
  }

  function startFlow() {
    var st = load();
    st.active = true;
    st.current = FLOW[0].key;
    st.step = 0;
    st.done = {};
    save(st);
  }

  function stopFlow() {
    var st = load();
    st.active = false;
    save(st);
  }

  function goTo(key) {
    var st = load();
    st.current = key;
    st.step = 0;
    save(st);
    var i = idxOf(key);
    var url = FLOW[i].url;
    window.location.href = url;
  }

  function nextSimulation() {
    var st = load();
    var i = idxOf(st.current);
    if (i >= FLOW.length - 1) {
      // fin del recorrido
      st.active = false;
      save(st);
      window.location.href = 'menu-simulaciones.html';
      return;
    }
    var nxt = FLOW[i + 1].key;
    goTo(nxt);
  }

  function boot(currentKey, steps) {
    var st = load();
    if (!st.active) return;
    if (st.current !== currentKey) return;

    var flowIdx = idxOf(currentKey);
    var prefix = (flowIdx + 1) + '/' + FLOW.length + ' · ' + FLOW[flowIdx].title;
    var stepsArr = steps || [];

    function showStep(i) {
      if (i < 0) i = 0;
      if (i >= stepsArr.length) {
        // final de esta simulación
        openOverlay(prefix, '¡Listo! Terminaste esta simulación. Podés pasar a la siguiente.', 'Siguiente simulación');
        setHandlers(function () {
          closeOverlay();
          nextSimulation();
        }, function () {
          closeOverlay();
          stopFlow();
        });
        return;
      }
      st.step = i;
      save(st);
      var step = stepsArr[i];
      openOverlay(prefix, step.html, step.cta || 'Entendido');
      setHandlers(function () {
        closeOverlay();
      }, function () {
        closeOverlay();
        stopFlow();
      });
    }

    // Mostrar instrucción inicial si no se marcó el step como visto
    showStep(st.step);

    return {
      stepDone: function () {
        var s2 = load();
        if (!s2.active || s2.current !== currentKey) return;
        if (s2.step < stepsArr.length) {
          s2.step += 1;
          save(s2);
          showStep(s2.step);
        }
      },
      finish: function () {
        var s2 = load();
        if (!s2.active || s2.current !== currentKey) return;
        s2.step = stepsArr.length;
        save(s2);
        showStep(s2.step);
      }
    };
  }

  global.PlataGuide = {
    start: startFlow,
    stop: stopFlow,
    goTo: goTo,
    next: nextSimulation,
    boot: boot,
    state: load
  };
})(typeof window !== 'undefined' ? window : this);


/**
 * Sonidos cortos con Web Audio API (sin archivos externos).
 * Muchos navegadores exigen un gesto del usuario antes de reproducir audio.
 */
(function (global) {
  var ctx = null;

  function getCtx() {
    if (!ctx) {
      var Ctx = global.AudioContext || global.webkitAudioContext;
      if (!Ctx) return null;
      ctx = new Ctx();
    }
    return ctx;
  }

  function resume() {
    var c = getCtx();
    if (c && c.state === 'suspended') {
      c.resume().catch(function () {});
    }
  }

  function tone(c, freq, t0, dur, type, vol) {
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  function noiseBurst(c, t0, dur, vol) {
    var len = Math.floor(c.sampleRate * dur);
    var buf = c.createBuffer(1, len, c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
    var src = c.createBufferSource();
    src.buffer = buf;
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.08, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(g);
    g.connect(c.destination);
    src.start(t0);
    src.stop(t0 + dur + 0.05);
  }

  global.SimSounds = {
    init: function () {
      resume();
    },

    /** Modal / depósito: “ding” suave agudo-verdoso */
    playModalOpen: function () {
      var c = getCtx();
      if (!c) return;
      var t = c.currentTime;
      tone(c, 880, t, 0.08, 'sine', 0.09);
      tone(c, 1174, t + 0.06, 0.1, 'sine', 0.07);
    },

    /** Ingreso confirmado: doble nota ascendente (aprobación) */
    playDepositOk: function () {
      var c = getCtx();
      if (!c) return;
      var t = c.currentTime;
      tone(c, 523.25, t, 0.12, 'sine', 0.11);
      tone(c, 659.25, t + 0.1, 0.14, 'sine', 0.1);
      tone(c, 783.99, t + 0.22, 0.16, 'sine', 0.09);
    },

    /** Aceptar movimiento: acorde corto “éxito” */
    playAccept: function () {
      var c = getCtx();
      if (!c) return;
      var t = c.currentTime;
      tone(c, 392, t, 0.1, 'triangle', 0.1);
      tone(c, 523.25, t + 0.08, 0.14, 'sine', 0.11);
      tone(c, 659.25, t + 0.16, 0.18, 'sine', 0.08);
    },

    /** Rechazar: tono grave + siseo (tensión) */
    playReject: function () {
      var c = getCtx();
      if (!c) return;
      var t = c.currentTime;
      tone(c, 120, t, 0.18, 'sawtooth', 0.06);
      tone(c, 90, t + 0.05, 0.22, 'sawtooth', 0.05);
      noiseBurst(c, t + 0.08, 0.12, 0.06);
    },

    /** Dinero insuficiente: alerta breve descendente */
    playInsufficient: function () {
      var c = getCtx();
      if (!c) return;
      var t = c.currentTime;
      tone(c, 320, t, 0.11, 'triangle', 0.09);
      tone(c, 240, t + 0.08, 0.12, 'triangle', 0.08);
      tone(c, 180, t + 0.16, 0.14, 'sawtooth', 0.06);
      noiseBurst(c, t + 0.14, 0.12, 0.05);
    }
  };

  ['click', 'touchstart', 'keydown'].forEach(function (ev) {
    document.addEventListener(ev, function once() {
      SimSounds.init();
    }, { once: true, passive: true });
  });
})(typeof window !== 'undefined' ? window : this);

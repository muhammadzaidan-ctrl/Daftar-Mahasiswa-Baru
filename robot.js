/*!
 * iOs Robot — maskot 3D interaktif untuk halaman login (Three.js)
 *
 * Pasang SETELAH table.js:
 *   (tag script) src="table.js"
 *   (tag script) src="robot.js"  <- tepat di bawahnya
 *
 * Fitur:
 *  - Melayang, berkedip, kepala & mata mengikuti kursor
 *  - Fokus ke username  -> robot melirik ke form mengikuti panjang teks
 *  - Fokus ke password  -> robot menutup mata dengan kedua tangan
 *  - Tombol mata (lihat password) -> robot mengintip
 *  - Login SALAH  -> geleng-geleng, mata X, antena merah, gelembung pesan
 *  - Login BENAR  -> loncat, berputar, mata ^_^, antena emas
 *  - Klik robot   -> melambai + menyapa
 *
 * API manual (opsional):
 *   iosRobot.error('pesan')   iosRobot.success('pesan')
 *   iosRobot.wave()           iosRobot.say('teks')
 */
(function () {
  'use strict';
  if (window.iosRobot) return;

  /* ===================== Pengaturan ===================== */
  const CFG = {
    threeSrc: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    hideNativeAlert: true,          // alert "salah" diganti gelembung robot (false = alert tetap muncul)
    errorPattern: /salah|gagal|invalid|incorrect|wrong/i,
    greeting: 'Halo! Login dulu ya 👋',
    errorMs: 2600,
    clickLines: ['Halo juga! 👋', 'Hehe, geli tau 😆', 'Ayo login dulu~', 'Aku robot iOs! 🤖', 'Semangat kuliahnya! 🎓']
  };
  const COL = { mint: 0x7fe3c5, red: 0xff6b6b, gold: 0xffd86b };
  const calm = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ===================== API publik ===================== */
  const pending = [];
  let impl = null;
  const api = {
    ready: false,
    config: CFG,
    error:   (m) => run('error', m),
    success: (m) => run('success', m),
    wave:    ()  => run('wave'),
    say:     (m) => run('say', m)
  };
  function run(name, arg) {
    if (impl) impl[name](arg);
    else if (pending.length < 5) pending.push([name, arg]);
  }
  window.iosRobot = api;

  /* ===================== Hook ke logika login situs ===================== */
  const nativeAlert = window.alert.bind(window);
  window.alert = function (msg) {
    if (api.ready && CFG.hideNativeAlert && CFG.errorPattern.test(String(msg))) {
      api.error(String(msg));
      return;
    }
    return nativeAlert.apply(window, arguments);
  };

  function hookSuccess() {
    const fn = window.showSuccessMessage;
    if (typeof fn !== 'function' || fn.__iosRobot) return;
    const wrapped = function (msg) {
      try { api.success(String(msg)); } catch (e) {}
      return fn.apply(this, arguments);
    };
    wrapped.__iosRobot = true;
    window.showSuccessMessage = wrapped;
  }
  hookSuccess();

  /* ===================== CSS ===================== */
  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
.ios-robot-stage{position:relative;width:100%;height:228px;display:flex;justify-content:center;align-items:flex-end;margin:-8px 0 2px;user-select:none;-webkit-user-select:none;pointer-events:none}
.ios-robot-stage.ios-robot-fixed{position:fixed;right:10px;bottom:6px;width:auto;margin:0;z-index:9998}
.ios-robot-stage canvas{width:190px;height:190px;display:block;cursor:pointer;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.ios-robot-bubble{position:absolute;top:0;left:50%;transform:translate(-50%,6px) scale(.92);max-width:94%;padding:6px 12px;border-radius:14px;font:600 12.5px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;text-align:center;background:rgba(255,255,255,.95);color:#2f6061;box-shadow:0 4px 14px rgba(0,0,0,.16);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;z-index:2}
.ios-robot-bubble.show{opacity:1;transform:translate(-50%,0) scale(1)}
.ios-robot-bubble.err{background:#ffe9e9;color:#a82a2a}
.ios-robot-bubble.ok{background:#e4f6e9;color:#1f7a38}
[data-theme="dark"] .ios-robot-bubble{background:rgba(32,42,56,.96);color:#dbe7ee}
[data-theme="dark"] .ios-robot-bubble.err{background:#4a2327;color:#ffb4b4}
[data-theme="dark"] .ios-robot-bubble.ok{background:#1f3a2b;color:#a8e8bd}
@media (max-width:420px){.ios-robot-stage{height:190px}.ios-robot-stage canvas{width:152px;height:152px}}
`;
    document.head.appendChild(s);
  }

  /* ===================== Mount & load ===================== */
  const isShown = (el) => el.getClientRects().length > 0;

  function whenShown(el, cb) {
    if (isShown(el)) return cb();
    const iv = setInterval(() => { if (isShown(el)) { clearInterval(iv); cb(); } }, 400);
  }

  function loadThree(cb) {
    if (window.THREE) return cb();
    const sc = document.createElement('script');
    sc.src = CFG.threeSrc;
    sc.onload = cb;
    sc.onerror = () => console.warn('[iOs Robot] Gagal memuat Three.js dari CDN');
    document.head.appendChild(sc);
  }

  function start() {
    hookSuccess();
    injectStyles();
    const popup = document.querySelector('.login-popup');
    const stage = document.createElement('div');
    stage.className = 'ios-robot-stage';
    if (popup) {
      const h = popup.querySelector('h2');
      popup.insertBefore(stage, h && h.parentNode === popup ? h : popup.firstChild);
    } else {
      stage.classList.add('ios-robot-fixed');
      document.body.appendChild(stage);
    }
    // Three.js baru dimuat saat panel login benar-pertama kali tampil (hemat kuota)
    whenShown(stage, () => loadThree(() => init(stage, !!popup)));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  /* ===================== Scene 3D ===================== */
  function init(stage, popupMode) {
    const THREE = window.THREE;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch (e) {
      console.warn('[iOs Robot] WebGL tidak tersedia', e);
      stage.remove();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(190, 190, false);
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Robot maskot iOs');
    stage.appendChild(canvas);

    const bubble = document.createElement('div');
    bubble.className = 'ios-robot-bubble';
    bubble.setAttribute('aria-live', 'polite');
    stage.appendChild(bubble);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 0.15, 6);
    camera.lookAt(0, 0.15, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x9bb89a, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 0.65); key.position.set(2, 3, 4); scene.add(key);
    const rim = new THREE.PointLight(0x9fb6d4, 0.45, 12); rim.position.set(-3, 2, -2); scene.add(rim);

    const std = (c, r, m) => new THREE.MeshStandardMaterial({ color: c, roughness: r == null ? 0.45 : r, metalness: m || 0 });
    const white = std(0xf1f5f4, 0.35), sage = std(0x9bb89a, 0.5), slate = std(0x6a7b8e, 0.4, 0.1);
    const visorMat = new THREE.MeshStandardMaterial({ color: 0x22303c, roughness: 0.15, metalness: 0.3, emissive: 0xff3030, emissiveIntensity: 0 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: COL.mint });
    const bulbMat = new THREE.MeshStandardMaterial({ color: COL.mint, emissive: COL.mint, emissiveIntensity: 0.8, roughness: 0.3 });

    function canvasTex(size, draw) {
      const c = document.createElement('canvas'); c.width = c.height = size;
      const g = c.getContext('2d'); if (!g) return null;
      draw(g, size);
      return new THREE.CanvasTexture(c);
    }

    const root = new THREE.Group(); scene.add(root);

    /* --- badan --- */
    const torso = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), sage);
    torso.scale.set(0.62, 0.72, 0.52); torso.position.y = -0.55; root.add(torso);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.2, 16), slate);
    neck.position.y = 0.23; root.add(neck);

    const badgeTex = canvasTex(128, (g, s) => {
      g.fillStyle = '#f4f7f6'; g.beginPath(); g.arc(s / 2, s / 2, s / 2 - 6, 0, Math.PI * 2); g.fill();
      g.lineWidth = 8; g.strokeStyle = '#6a7b8e'; g.stroke();
      g.fillStyle = '#2f6061'; g.font = 'italic 54px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('iOs', s / 2, s / 2 + 3);
    });
    const badge = new THREE.Mesh(
      new THREE.CircleGeometry(0.2, 28),
      new THREE.MeshBasicMaterial({ map: badgeTex || null, color: badgeTex ? 0xffffff : 0xf4f7f6, transparent: true })
    );
    badge.position.set(0, -0.5, 0.515); root.add(badge);

    [-1, 1].forEach((s) => {
      const j = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), slate);
      j.position.set(s * 0.6, -0.18, 0.02); root.add(j);
    });

    /* --- kepala --- */
    const head = new THREE.Group(); head.position.y = 0.85; root.add(head);
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 24), white);
    skull.scale.set(1.1, 0.9, 0.95); head.add(skull);
    [-1, 1].forEach((s) => {
      const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.14, 20), slate);
      ear.rotation.z = Math.PI / 2; ear.position.set(s * 0.7, 0, 0); head.add(ear);
    });
    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 24), visorMat);
    visor.scale.set(1.05, 0.72, 0.5); visor.position.z = 0.42; head.add(visor);

    const face = new THREE.Group(); head.add(face);
    const eyes = { round: [], happy: [], x: [] };
    [-1, 1].forEach((s) => {
      const r = new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 14), eyeMat);
      r.position.set(s * 0.2, 0.06, 0.66); r.scale.set(1, 1.3, 0.4); face.add(r); eyes.round.push(r);
      const h = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.022, 8, 18, Math.PI), eyeMat);
      h.position.set(s * 0.2, 0.03, 0.66); face.add(h); eyes.happy.push(h);
      const xg = new THREE.Group(); xg.position.set(s * 0.2, 0.06, 0.66);
      [Math.PI / 4, -Math.PI / 4].forEach((a) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.03), eyeMat); b.rotation.z = a; xg.add(b);
      });
      face.add(xg); eyes.x.push(xg);
    });
    const mouth = {
      smile: new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.015, 8, 18, Math.PI), eyeMat),
      frown: new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.015, 8, 18, Math.PI), eyeMat),
      flat:  new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.026, 0.026), eyeMat),
      o:     new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.014, 8, 16), eyeMat)
    };
    mouth.smile.rotation.z = Math.PI; mouth.smile.position.set(0, -0.1, 0.66);
    mouth.frown.position.set(0, -0.22, 0.66);
    mouth.flat.position.set(0, -0.17, 0.66);
    mouth.o.position.set(0, -0.17, 0.66);
    Object.keys(mouth).forEach((k) => face.add(mouth[k]));

    const blushMat = new THREE.MeshBasicMaterial({ color: 0xff9db1, transparent: true, opacity: 0, depthWrite: false });
    [-1, 1].forEach((s) => {
      const b = new THREE.Mesh(new THREE.CircleGeometry(0.055, 16), blushMat);
      b.position.set(s * 0.34, -0.08, 0.625); b.rotation.y = s * 0.45; face.add(b);
    });

    const antenna = new THREE.Group(); antenna.position.y = 0.54; head.add(antenna);
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.3, 10), slate); stalk.position.y = 0.15; antenna.add(stalk);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), bulbMat); bulb.position.y = 0.33; antenna.add(bulb);

    /* --- lengan (pivot di bahu) --- */
    function makeArm() {
      const g = new THREE.Group();
      const a = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.5, 12), slate); a.position.y = -0.25; g.add(a);
      const hnd = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), white); hnd.position.y = -0.55; g.add(hnd);
      root.add(g);
      return g;
    }
    const arms = { L: { g: makeArm(), c: null }, R: { g: makeArm(), c: null } };
    const rest  = (s) => ({ px: s * 0.66, py: -0.15, pz: 0.05, rx: 0, rz: s * 0.12 });
    const cover = (s) => ({ px: s * 0.24, py: 0.45, pz: 0.62, rx: Math.PI + 0.25, rz: 0 });
    arms.L.c = rest(-1); arms.R.c = rest(1);

    /* --- bayangan --- */
    const shTex = canvasTex(64, (g, s) => {
      const gr = g.createRadialGradient(s / 2, s / 2, 2, s / 2, s / 2, s / 2);
      gr.addColorStop(0, 'rgba(0,0,0,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
    });
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 1.7),
      new THREE.MeshBasicMaterial({ map: shTex || null, color: 0x000000, transparent: true, opacity: shTex ? 1 : 0.15, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.5; scene.add(shadow);

    /* ===================== State & logika ===================== */
    const S = {
      yaw: 0, pitch: 0, tilt: 0, eyeOpen: 1, blush: 0, spinStart: -1,
      flash: null, flashStart: 0, flashUntil: 0, pulse: 0, hover: false,
      px: 0, py: 0, lastPointer: 0, nextBlink: 2, blinkT: -1,
      prev: 'idle', passTold: false, peekTold: false, last: 0, shown: true, lastCheck: 0
    };
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const now = () => performance.now();

    let bt = 0;
    function say(text, kind, ms) {
      bubble.textContent = text;
      bubble.className = 'ios-robot-bubble show' + (kind ? ' ' + kind : '');
      clearTimeout(bt);
      bt = setTimeout(() => bubble.classList.remove('show'), ms || 2600);
    }
    function flash(kind, ms) {
      S.flash = kind; S.flashStart = now(); S.flashUntil = S.flashStart + ms;
    }
    const locked = () => (S.flash === 'success' || S.flash === 'error') && now() < S.flashUntil;

    impl = {
      say: (m) => say(String(m || '')),
      wave: () => { if (locked()) return; flash('wave', 1700); S.pulse = 1; },
      error: (m) => {
        flash('error', CFG.errorMs); S.spinStart = -1;
        say(m || 'Username atau password salah!', 'err', CFG.errorMs + 600);
      },
      success: (m) => {
        flash('success', popupMode ? Infinity : 3200); S.spinStart = now();
        say(m || 'Login berhasil!', 'ok', 2600);
      }
    };

    canvas.addEventListener('pointerdown', () => {
      S.pulse = 1;
      if (locked()) return;
      flash('wave', 1700);
      say(CFG.clickLines[Math.floor(Math.random() * CFG.clickLines.length)], '', 1900);
    });
    canvas.addEventListener('pointerenter', () => { S.hover = true; });
    canvas.addEventListener('pointerleave', () => { S.hover = false; });
    window.addEventListener('pointermove', (e) => { S.px = e.clientX; S.py = e.clientY; S.lastPointer = now(); }, { passive: true });
    document.addEventListener('input', (e) => {
      if (e.target && e.target.tagName === 'INPUT') S.pulse = Math.max(S.pulse, 0.7);
    }, true);

    const isPass = (el) => !!el && el.tagName === 'INPUT' && (el.type === 'password' || /pass/i.test(el.id || el.name || ''));
    function mode() {
      const el = document.activeElement;
      if (!el) return { m: 'idle' };
      if (isPass(el) || (el.classList && el.classList.contains('password-toggle'))) {
        const pf = document.getElementById('password') || document.querySelector('input[type="password"]');
        const shown = (pf && pf.type === 'text') || !!document.querySelector('.password-toggle.showing');
        return { m: shown ? 'peek' : 'pass' };
      }
      if (popupMode && el.tagName === 'INPUT' && /^(text|email|search|tel|)$/.test(el.type || '') && stage.parentNode && stage.parentNode.contains(el)) {
        return { m: 'user', len: (el.value || '').length };
      }
      return { m: 'idle' };
    }

    function onShow() {
      S.flash = null; S.spinStart = -1; S.pulse = 1; S.yaw = S.pitch = 0;
      flash('wave', 1500);
      say(CFG.greeting, '', 2600);
    }

    const setVis = (arr, v) => arr.forEach((m) => { m.visible = v; });
    function setFace(eye, mth) {
      setVis(eyes.round, eye === 'round'); setVis(eyes.happy, eye === 'happy'); setVis(eyes.x, eye === 'x');
      Object.keys(mouth).forEach((k) => { mouth[k].visible = (k === mth); });
    }
    const armKeys = ['px', 'py', 'pz', 'rx', 'rz'];

    let first = true;
    function frame(ts) {
      requestAnimationFrame(frame);
      if (ts - S.lastCheck > 200) {
        S.lastCheck = ts;
        const vis = isShown(stage) && !document.hidden;
        if (vis && !S.shown && !first) onShow();
        S.shown = vis;
      }
      if (!S.shown) { S.last = 0; return; }

      const tnow = now();
      const t = tnow / 1000;
      const dt = S.last ? Math.min(0.05, (ts - S.last) / 1000) : 0.016;
      S.last = ts;
      if (first) { first = false; setTimeout(() => { if (!locked()) { flash('wave', 1700); say(CFG.greeting, '', 2800); } }, 700); }

      /* --- tentukan ekspresi --- */
      let expr, md = { m: 'idle' };
      if (S.flash === 'wave' && mode().m !== 'idle') S.flash = null; // mulai mengetik -> batalkan lambaian
      if (S.flash && tnow < S.flashUntil) expr = S.flash;
      else { S.flash = null; md = mode(); expr = md.m; }
      if (expr !== S.prev) {
        if (expr === 'pass' && !S.passTold) { S.passTold = true; say('Tenang, aku tutup mata 🙈', '', 2200); }
        if (expr === 'peek' && !S.peekTold) { S.peekTold = true; say('Hehe, ngintip dikit 👀', '', 2200); }
        S.prev = expr;
      }
      const elapsed = (tnow - S.flashStart) / 1000;
      const prog = S.flash && isFinite(S.flashUntil) ? clamp((tnow - S.flashStart) / (S.flashUntil - S.flashStart), 0, 1) : 0;
      const decay = 1 - prog;

      /* --- target pose --- */
      const T = { eye: 'round', mouth: 'smile', open: 1, color: COL.mint, blush: 0, yaw: 0, pitch: 0, tilt: 0, L: rest(-1), R: rest(1), jump: 0 };
      const rw = S.hover ? 0.45 : 0;
      switch (expr) {
        case 'success':
          T.eye = 'happy'; T.mouth = 'smile'; T.color = COL.gold; T.blush = 1;
          T.L.rz = -(2.7 + Math.sin(t * 14) * 0.18); T.R.rz = 2.7 + Math.sin(t * 14 + 1) * 0.18;
          T.tilt = Math.sin(t * 6) * 0.1; T.jump = calm ? 0 : Math.abs(Math.sin(elapsed * 7)) * 0.2;
          break;
        case 'error': {
          const j = Math.sin(t * 30) * 0.12 * decay * (calm ? 0.3 : 1);
          T.eye = 'x'; T.mouth = 'frown'; T.color = COL.red;
          T.L.rz = -(0.95 + j); T.R.rz = 0.95 - j; T.pitch = 0.08;
          break;
        }
        case 'wave':
          T.mouth = 'smile'; T.blush = 0.6;
          T.R.rz = 2.35 + Math.sin(t * 13) * 0.35; T.tilt = Math.sin(t * 4) * 0.06;
          T.jump = calm ? 0 : Math.abs(Math.sin(elapsed * 6)) * 0.06 * decay;
          break;
        case 'pass':
          T.eye = 'round'; T.open = 0.06; T.mouth = 'flat'; T.pitch = 0.1;
          T.L = cover(-1); T.R = cover(1);
          break;
        case 'peek':
          T.open = 1.15; T.mouth = 'o'; T.pitch = 0.18; T.yaw = 0.15;
          T.R = cover(1); T.L = Object.assign(rest(-1), { rz: -0.7 });
          break;
        case 'user': {
          const ratio = clamp((md.len || 0) / 22, 0, 1);
          T.mouth = 'smile'; T.pitch = 0.28; T.yaw = -0.35 + ratio * 0.7; T.blush = 0.3;
          break;
        }
        default: { // idle: ikuti kursor
          const r = canvas.getBoundingClientRect();
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          if (tnow - S.lastPointer < 5000) {
            T.yaw = clamp((S.px - cx) / (window.innerWidth * 0.5), -1, 1) * 0.55;
            T.pitch = clamp((S.py - cy) / (window.innerHeight * 0.5), -1, 1) * 0.35;
          } else {
            T.yaw = Math.sin(t * 0.6) * 0.4; T.pitch = Math.sin(t * 0.43) * 0.1;
          }
          T.blush = rw;
        }
      }

      /* --- terapkan dengan smoothing --- */
      const k = 1 - Math.exp(-dt * 9);
      S.yaw += (T.yaw - S.yaw) * k;
      S.pitch += (T.pitch - S.pitch) * k;
      S.tilt += (T.tilt - S.tilt) * k;
      S.blush += (T.blush - S.blush) * k;
      S.eyeOpen += (T.open - S.eyeOpen) * (1 - Math.exp(-dt * 14));
      S.pulse = Math.max(0, S.pulse - dt * 4);

      const shake = expr === 'error' && !calm ? Math.sin(elapsed * 34) * 0.42 * decay : 0;
      head.rotation.y = S.yaw + shake;
      head.rotation.x = S.pitch + Math.sin(S.pulse * Math.PI) * 0.1;
      head.rotation.z = S.tilt;
      face.position.set(S.yaw * 0.06, -S.pitch * 0.04, 0);

      const bob = Math.sin(t * 1.8) * (calm ? 0.02 : 0.06);
      root.position.y = bob + T.jump;
      root.position.x = expr === 'error' && !calm ? Math.sin(elapsed * 40) * 0.05 * decay : 0;
      let spin = 0;
      if (S.spinStart >= 0 && !calm) {
        const p = clamp((tnow - S.spinStart) / 900, 0, 1);
        spin = (1 - Math.pow(1 - p, 3)) * Math.PI * 2;
      }
      root.rotation.y = spin + S.yaw * 0.18;
      root.scale.set(1 - S.pulse * 0.03, 1 + S.pulse * 0.05, 1 - S.pulse * 0.03);
      const sh = 1 - root.position.y * 0.35;
      shadow.scale.set(sh, sh, sh);

      ['L', 'R'].forEach((side) => {
        const a = arms[side], tg = T[side];
        armKeys.forEach((key2) => { a.c[key2] += (tg[key2] - a.c[key2]) * (1 - Math.exp(-dt * 12)); });
        a.g.position.set(a.c.px, a.c.py, a.c.pz);
        a.g.rotation.x = a.c.rx; a.g.rotation.z = a.c.rz;
      });

      /* wajah */
      let blink = 0;
      S.nextBlink -= dt;
      if (S.nextBlink <= 0 && S.blinkT < 0) { S.blinkT = 0; S.nextBlink = 2 + Math.random() * 3.5; }
      if (S.blinkT >= 0) {
        S.blinkT += dt;
        const b = S.blinkT / 0.16;
        blink = b < 0.5 ? b * 2 : (b < 1 ? (1 - b) * 2 : 0);
        if (b >= 1) S.blinkT = -1;
      }
      setFace(T.eye, T.mouth);
      const ey = 1.3 * Math.max(0.06, S.eyeOpen) * (1 - 0.92 * blink);
      eyes.round.forEach((m) => m.scale.set(1, ey, 0.4));
      eyeMat.color.setHex(T.color);
      blushMat.opacity = S.blush * 0.75;

      bulbMat.color.setHex(T.color); bulbMat.emissive.setHex(T.color);
      bulbMat.emissiveIntensity = expr === 'error' ? 0.5 + 0.5 * Math.sin(t * 22) : 0.6 + 0.35 * Math.sin(t * 3);
      antenna.rotation.z = Math.sin(t * 2.2) * 0.12 - S.yaw * 0.15;
      visorMat.emissiveIntensity = expr === 'error' ? 0.35 * decay * (0.5 + 0.5 * Math.sin(t * 20)) : 0;

      renderer.render(scene, camera);
    }

    api.ready = true;
    impl_ready();
    requestAnimationFrame(frame);

    function impl_ready() {
      while (pending.length) { const p = pending.shift(); impl[p[0]](p[1]); }
    }
  }
})();

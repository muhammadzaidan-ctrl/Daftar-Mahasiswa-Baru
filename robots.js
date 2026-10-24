/*!
 * Robot Duo — iOs & Luminare (3D, Three.js)
 *
 * Pasang SETELAH table.js, dan GANTI robot.js / luminare-robot.js lama:
 *   (tag script) src="table.js"
 *   (tag script) src="robots.js"   <- tepat di bawahnya
 *
 * - Halaman login : 2 robot di atas form; kalau kursor/keyboard diam beberapa detik, mereka ngobrol.
 * - Setelah login : 2 robot di kiri & kanan halaman (Home/About/Services/Contact), posisi tetap saat scroll.
 * - Login salah/benar -> keduanya bereaksi dengan lembut.
 *
 * API manual: robotDuo.error() robotDuo.success() robotDuo.wave() robotDuo.say(0|1, 'teks')
 */
(function () {
  'use strict';
  if (window.robotDuo) return;

  /* ===================== Pengaturan ===================== */
  const CFG = {
    threeSrc: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    hideNativeAlert: true,                 // alert "salah" diganti gelembung robot
    errorPattern: /salah|gagal|invalid|incorrect|wrong/i,
    idleChatMs: 4500,                      // kursor/keyboard diam sekian ms -> mulai ngobrol
    chatOnMain: true,                      // ngobrol juga di halaman utama
    loginSize: 150,                        // ukuran robot di halaman login (px)
    maxMainSize: 150,                      // ukuran maks robot di sisi halaman
    minMainSize: 84,                       // kalau ruang kiri/kanan lebih sempit, robot disembunyikan
    errorMs: 2800,
    clickLines: ['Hai! 👋', 'Hehe, geli~', 'Semangat ya! 🎓', 'Senang ketemu kamu 💜', 'Ada yang bisa dibantu?'],
    errorLines: ['Hmm, sepertinya belum pas. Coba cek lagi ya 🙂', 'Pelan-pelan aja, kamu pasti bisa 💜'],
    successLines: ['Yeay, berhasil! Selamat datang 🎉', 'Selamat menjelajah, ya! 💜'],
    chat: {
      login: [
        [0, 'Halo, Luminare! Siap menemani login? 😊'],
        [1, 'Siap, iOs. Sepertinya dia masih berpikir nih…'],
        [0, 'Santai aja, pelan-pelan ngetiknya ya~'],
        [1, 'Huruf besar-kecil di password ngaruh lho.'],
        [0, 'Tenang, kami nggak ngintip kok 🙈'],
        [1, 'Hehe iya. Semangat kuliahnya, alumni! 🎓']
      ],
      home: [
        [0, 'Wah, alumninya banyak ya, 87 orang! 🎓'],
        [1, 'Coba filter kampus di atas, praktis lho.'],
        [0, 'Mau cari nama? Ketik di kolom pencarian~']
      ],
      about: [
        [0, 'Halaman About: cerita angkatan Luminare & iOs.'],
        [1, 'Ada grafik sebaran kampus juga 📊'],
        [0, 'Dan galeri foto angkatan! 📸']
      ],
      services: [
        [0, 'Di sini daftar fitur portal ini.'],
        [1, 'Pencarian instan dan filter kampus, praktis ✨']
      ],
      contact: [
        [0, 'Ada data yang perlu diperbarui?'],
        [1, 'Hubungi developer Luminare ya, jangan sungkan 💜']
      ],
      generic: [
        [0, 'Tenang ya hari ini, enaknya sambil minum teh ☕'],
        [1, 'Setuju. Santai dulu sebentar~']
      ]
    }
  };
  const calm = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  const THEMES = [
    { name: 'iOs', shell: 0xf1f5f4, body: 0x9bb89a, accent: 0x6a7b8e, visor: 0x22303c, eye: 0xa6ead3, bulb: 0xa6ead3,
      rim: 0x9fb6d4, ground: 0x9bb89a, wings: false,
      badge(g, s) {
        g.fillStyle = '#f4f7f6'; g.beginPath(); g.arc(s / 2, s / 2, s / 2 - 6, 0, Math.PI * 2); g.fill();
        g.lineWidth = 8; g.strokeStyle = '#6a7b8e'; g.stroke();
        g.fillStyle = '#2f6061'; g.font = 'italic 54px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText('iOs', s / 2, s / 2 + 3);
      } },
    { name: 'Luminare', shell: 0xf0ede6, body: 0x9b4fbb, accent: 0x5a1b7a, visor: 0x231830, eye: 0xe6c2ff, bulb: 0xe6c2ff,
      rim: 0xc58bff, ground: 0x9b4fbb, wings: true,
      badge(g, s) {
        g.fillStyle = '#f4f1ea'; g.beginPath(); g.arc(s / 2, s / 2, s / 2 - 6, 0, Math.PI * 2); g.fill();
        g.lineWidth = 8; g.strokeStyle = '#5a1b7a'; g.stroke();
        g.fillStyle = '#9b4fbb';
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach((q) => {
          g.save(); g.translate(s / 2 + q[0] * 17, s / 2 + q[1] * 17); g.rotate(q[0] * q[1] * -0.8);
          g.beginPath(); g.ellipse(0, 0, 25, 11, 0, 0, Math.PI * 2); g.fill(); g.restore();
        });
      } }
  ];
  const COL = { gold: 0xffd98a, worry: 0xffb4a8 };

  /* ===================== State global ===================== */
  const G = {
    ready: false, layout: null, shown: false, last: 0, lastCheck: 0,
    px: 0, py: 0, lastPointer: 0, lastActivity: performance.now(),
    mode: { m: 'idle' }, flash: null,
    chat: { on: false, set: null, i: 0, nextAt: 0, speaker: -1, speakUntil: 0, round: 0 },
    told: { pass: false, peek: false }
  };
  let robots = [];
  let overlay = null, rowEl = null;
  const pending = [];
  const call = (fn) => { if (G.ready) fn(); else if (pending.length < 5) pending.push(fn); };

  const api = {
    get ready() { return G.ready; },
    config: CFG,
    error: (m) => call(() => doError(m)),
    success: (m) => call(() => doSuccess(m)),
    wave: () => call(() => robots.forEach((R, i) => wave(R, i * 450))),
    say: (i, m) => call(() => robots[i | 0] && say(robots[i | 0], String(m || ''), '', 3000))
  };
  window.robotDuo = api;

  /* ===================== Hook ke logika login situs ===================== */
  const nativeAlert = window.alert.bind(window);
  window.alert = function (msg) {
    if (G.ready && CFG.hideNativeAlert && CFG.errorPattern.test(String(msg))) { api.error(); return; }
    return nativeAlert.apply(window, arguments);
  };
  function hookSuccess() {
    const fn = window.showSuccessMessage;
    if (typeof fn !== 'function' || fn.__robotDuo) return;
    const wrapped = function () { try { api.success(); } catch (e) {} return fn.apply(this, arguments); };
    wrapped.__robotDuo = true;
    window.showSuccessMessage = wrapped;
  }
  hookSuccess();

  /* ===================== CSS ===================== */
  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
.rb-row{display:flex;justify-content:center;gap:4px;padding-top:62px;margin:-6px 0 2px;pointer-events:none}
.rb-stage{position:relative;pointer-events:none;user-select:none;-webkit-user-select:none}
.rb-stage canvas{width:100%;height:100%;display:block;cursor:pointer;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.rb-fixed{position:fixed;bottom:12px;z-index:30;animation:rbfade .9s ease both}
@keyframes rbfade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.rb-bubble{position:absolute;bottom:100%;margin-bottom:-8px;width:max-content;max-width:176px;padding:6px 11px;border-radius:14px;font:600 12px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;text-align:center;background:rgba(255,255,255,.96);box-shadow:0 4px 14px rgba(0,0,0,.14);opacity:0;transform:translateY(6px) scale(.95);pointer-events:none;transition:opacity .35s,transform .35s;z-index:2}
.rb-s0 .rb-bubble{left:0;transform-origin:bottom left;color:#2f6061}
.rb-s1 .rb-bubble{right:0;transform-origin:bottom right;color:#5a1b7a}
.rb-bubble.show{opacity:1;transform:none}
.rb-bubble.err{background:#fff2ef}
.rb-bubble.ok{background:#eefaf1}
[data-theme="dark"] .rb-bubble{background:rgba(34,42,58,.96)}
[data-theme="dark"] .rb-s0 .rb-bubble{color:#bfe9dc}
[data-theme="dark"] .rb-s1 .rb-bubble{color:#e3c6f7}
[data-theme="dark"] .rb-bubble.err{background:#47302f}
[data-theme="dark"] .rb-bubble.ok{background:#25392d}
@media (max-width:440px){.rb-bubble{max-width:140px;font-size:11px}}
`;
    document.head.appendChild(s);
  }

  /* ===================== Util ===================== */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const now = () => performance.now();
  const isShown = (el) => el.getClientRects().length > 0;
  const inLogin = () => !!overlay && overlay.getClientRects().length > 0;

  function loadThree(cb) {
    if (window.THREE) return cb();
    const sc = document.createElement('script');
    sc.src = CFG.threeSrc; sc.onload = cb;
    sc.onerror = () => console.warn('[Robot Duo] Gagal memuat Three.js dari CDN');
    document.head.appendChild(sc);
  }

  /* ===================== Bangun satu robot ===================== */
  function buildRobot(th, idx) {
    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(190, 190, false);
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', 'Robot maskot ' + th.name);

    const stage = document.createElement('div');
    stage.className = 'rb-stage rb-s' + idx;
    stage.appendChild(canvas);
    const bubble = document.createElement('div');
    bubble.className = 'rb-bubble'; bubble.setAttribute('aria-live', 'polite');
    stage.appendChild(bubble);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 0.15, 6); camera.lookAt(0, 0.15, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, th.ground, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 0.65); key.position.set(2, 3, 4); scene.add(key);
    const rim = new THREE.PointLight(th.rim, 0.45, 12); rim.position.set(-3, 2, -2); scene.add(rim);

    const std = (c, r, m) => new THREE.MeshStandardMaterial({ color: c, roughness: r == null ? 0.45 : r, metalness: m || 0 });
    const white = std(th.shell, 0.35), body = std(th.body, 0.5), accent = std(th.accent, 0.4, 0.1);
    const visorMat = new THREE.MeshStandardMaterial({ color: th.visor, roughness: 0.15, metalness: 0.3 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: th.eye });
    const bulbMat = new THREE.MeshStandardMaterial({ color: th.bulb, emissive: th.bulb, emissiveIntensity: 0.7, roughness: 0.3 });

    const canvasTex = (size, draw) => {
      const c = document.createElement('canvas'); c.width = c.height = size;
      const g = c.getContext('2d'); if (!g) return null;
      draw(g, size); return new THREE.CanvasTexture(c);
    };

    const root = new THREE.Group(); scene.add(root);
    const torso = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), body);
    torso.scale.set(0.62, 0.72, 0.52); torso.position.y = -0.55; root.add(torso);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.2, 16), accent);
    neck.position.y = 0.23; root.add(neck);

    const wingPivots = [];
    if (th.wings) {
      const wingMat = new THREE.MeshStandardMaterial({ color: 0xb36bd1, roughness: 0.5, transparent: true, opacity: 0.93, side: THREE.DoubleSide });
      [-1, 1].forEach((sd) => {
        const pv = new THREE.Group(); pv.position.set(sd * 0.3, -0.2, -0.32); root.add(pv);
        const up = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), wingMat);
        up.scale.set(0.62, 0.32, 0.04); up.position.set(sd * 0.55, 0.28, 0); up.rotation.z = sd * 0.55; pv.add(up);
        const lo = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), wingMat);
        lo.scale.set(0.45, 0.24, 0.04); lo.position.set(sd * 0.42, -0.2, 0); lo.rotation.z = -sd * 0.55; pv.add(lo);
        wingPivots.push({ pv, sd });
      });
    }

    const badgeTex = canvasTex(128, th.badge);
    const badge = new THREE.Mesh(new THREE.CircleGeometry(0.2, 28),
      new THREE.MeshBasicMaterial({ map: badgeTex || null, color: badgeTex ? 0xffffff : 0xf4f7f6, transparent: true }));
    badge.position.set(0, -0.5, 0.515); root.add(badge);
    [-1, 1].forEach((s) => {
      const j = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), accent);
      j.position.set(s * 0.6, -0.18, 0.02); root.add(j);
    });

    const head = new THREE.Group(); head.position.y = 0.85; root.add(head);
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 24), white);
    skull.scale.set(1.1, 0.9, 0.95); head.add(skull);
    [-1, 1].forEach((s) => {
      const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.14, 20), accent);
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
    });
    const mouth = {
      smile: new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.015, 8, 18, Math.PI), eyeMat),
      frown: new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 8, 18, Math.PI), eyeMat),
      flat:  new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.026, 0.026), eyeMat),
      o:     new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.014, 8, 16), eyeMat)
    };
    mouth.smile.rotation.z = Math.PI; mouth.smile.position.set(0, -0.1, 0.66);
    mouth.frown.position.set(0, -0.21, 0.66);
    mouth.flat.position.set(0, -0.17, 0.66);
    mouth.o.position.set(0, -0.17, 0.66);
    Object.keys(mouth).forEach((k) => face.add(mouth[k]));

    const blushMat = new THREE.MeshBasicMaterial({ color: 0xff9db1, transparent: true, opacity: 0, depthWrite: false });
    [-1, 1].forEach((s) => {
      const b = new THREE.Mesh(new THREE.CircleGeometry(0.055, 16), blushMat);
      b.position.set(s * 0.34, -0.08, 0.625); b.rotation.y = s * 0.45; face.add(b);
    });

    const antenna = new THREE.Group(); antenna.position.y = 0.54; head.add(antenna);
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.3, 10), accent); stalk.position.y = 0.15; antenna.add(stalk);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), bulbMat); bulb.position.y = 0.33; antenna.add(bulb);

    const makeArm = () => {
      const g = new THREE.Group();
      const a = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.5, 12), accent); a.position.y = -0.25; g.add(a);
      const hnd = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), white); hnd.position.y = -0.55; g.add(hnd);
      root.add(g); return g;
    };
    const rest = (s) => ({ px: s * 0.66, py: -0.15, pz: 0.05, rx: 0, rz: s * 0.12 });
    const arms = { L: { g: makeArm(), c: rest(-1) }, R: { g: makeArm(), c: rest(1) } };

    const shTex = canvasTex(64, (g, s) => {
      const gr = g.createRadialGradient(s / 2, s / 2, 2, s / 2, s / 2, s / 2);
      gr.addColorStop(0, 'rgba(0,0,0,.30)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
    });
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.7),
      new THREE.MeshBasicMaterial({ map: shTex || null, color: 0x000000, transparent: true, opacity: shTex ? 1 : 0.15, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.5; scene.add(shadow);

    const R = {
      idx, th, stage, canvas, bubble, renderer, scene, camera,
      p: { root, head, face, eyes, mouth, antenna, arms, shadow, wingPivots, eyeMat, bulbMat, blushMat },
      S: { yaw: 0, pitch: 0, tilt: 0, eyeOpen: 1, blush: 0, wb: 0.55, pulse: 0, hover: false,
           nextBlink: 1.5 + idx, blinkT: -1, prev: 'idle', waveStart: 0, waveUntil: 0, bt: 0, bubbleKind: '' },
      rest
    };
    canvas.addEventListener('pointerdown', () => {
      G.lastActivity = now();
      if (G.flash) return;
      wave(R, 0);
      say(R, CFG.clickLines[Math.floor(Math.random() * CFG.clickLines.length)], '', 1900);
    });
    canvas.addEventListener('pointerenter', () => { R.S.hover = true; });
    canvas.addEventListener('pointerleave', () => { R.S.hover = false; });
    return R;
  }

  /* ===================== Aksi ===================== */
  function say(R, text, kind, ms) {
    R.bubble.textContent = text;
    R.bubble.className = 'rb-bubble show' + (kind ? ' ' + kind : '');
    R.S.bubbleKind = kind === 'chat' ? 'chat' : 'other';
    clearTimeout(R.S.bt);
    R.S.bt = setTimeout(() => R.bubble.classList.remove('show'), ms || 2800);
  }
  function wave(R, delay) {
    const t = now() + (delay || 0);
    R.S.waveStart = t; R.S.waveUntil = t + 1700; R.S.pulse = 1;
  }
  function stopChat() {
    const c = G.chat;
    if (!c.on) return;
    c.on = false; c.speaker = -1; c.speakUntil = 0;
    robots.forEach((R) => { if (R.S.bubbleKind === 'chat') R.bubble.classList.remove('show'); });
  }
  function doError(msg) {
    stopChat();
    const t = now(); G.flash = { kind: 'error', start: t, until: t + CFG.errorMs };
    say(robots[0], msg || CFG.errorLines[0], 'err', CFG.errorMs + 500);
    setTimeout(() => say(robots[1], CFG.errorLines[1], 'err', CFG.errorMs - 300), 700);
  }
  function doSuccess(msg) {
    stopChat();
    const t = now(); G.flash = { kind: 'success', start: t, until: inLogin() ? Infinity : t + 3000 };
    say(robots[0], msg || CFG.successLines[0], 'ok', 2600);
    setTimeout(() => say(robots[1], CFG.successLines[1], 'ok', 2400), 600);
  }

  /* ===================== Layout ===================== */
  function ensureRow() {
    if (rowEl) return rowEl;
    const popup = document.querySelector('.login-popup');
    if (!popup) return null;
    rowEl = document.createElement('div'); rowEl.className = 'rb-row';
    const h = popup.querySelector('h2');
    popup.insertBefore(rowEl, h && h.parentNode === popup ? h : popup.firstChild);
    return rowEl;
  }
  function applyLayout() {
    const login = inLogin() && !!ensureRow();
    const want = login ? 'login' : 'main';
    if (want !== G.layout) {
      const first = G.layout === null;
      G.layout = want;
      G.flash = null; stopChat();
      if (login) {
        robots.forEach((R) => { rowEl.appendChild(R.stage); R.stage.className = 'rb-stage rb-s' + R.idx; R.stage.removeAttribute('style'); });
        if (!first) { /* kembali ke login (logout) */ }
        robots.forEach((R, i) => wave(R, i * 500));
        say(robots[0], 'Halo, aku iOs! 👋', '', 2600);
        setTimeout(() => say(robots[1], 'Aku Luminare, selamat datang 💜', '', 2800), 900);
      } else {
        robots.forEach((R) => { document.body.appendChild(R.stage); R.stage.className = 'rb-stage rb-s' + R.idx + ' rb-fixed ' + (R.idx ? 'rb-right' : 'rb-left'); });
        robots.forEach((R, i) => wave(R, i * 400));
        if (first) say(robots[0], 'Halo, selamat datang kembali! 👋', '', 2600);
      }
    }
    if (login) {
      const size = window.innerWidth <= 440 ? 120 : CFG.loginSize;
      robots.forEach((R) => { R.stage.style.width = R.stage.style.height = size + 'px'; });
    } else {
      const ref = document.querySelector('#mainContent > header') || document.getElementById('mainContent');
      const r = ref ? ref.getBoundingClientRect() : null;
      const margin = r && r.width > 0 ? Math.min(r.left, window.innerWidth - r.right) : 0;
      const size = Math.min(CFG.maxMainSize, Math.floor(margin - 14));
      const show = size >= CFG.minMainSize;
      robots.forEach((R) => {
        const st = R.stage.style;
        st.display = show ? '' : 'none';
        st.width = st.height = Math.max(size, 0) + 'px';
        st.left = st.right = '';
        st[R.idx ? 'right' : 'left'] = Math.max(4, Math.floor((margin - size) / 2)) + 'px';
      });
    }
  }

  /* ===================== Mode input ===================== */
  const isPass = (el) => !!el && el.tagName === 'INPUT' && (el.type === 'password' || /pass/i.test(el.id || el.name || ''));
  function mode() {
    const el = document.activeElement;
    if (!el || !inLogin()) return { m: 'idle' };
    if (isPass(el) || (el.classList && el.classList.contains('password-toggle'))) {
      const pf = document.getElementById('password') || document.querySelector('input[type="password"]');
      const shown = (pf && pf.type === 'text') || !!document.querySelector('.password-toggle.showing');
      return { m: shown ? 'peek' : 'pass' };
    }
    if (el.tagName === 'INPUT' && /^(text|email|search|tel|)$/.test(el.type || '') && overlay.contains(el)) {
      return { m: 'user', len: (el.value || '').length };
    }
    return { m: 'idle' };
  }

  /* ===================== Ngobrol ===================== */
  function pickSet() {
    const c = CFG.chat;
    if (G.layout === 'login') return c.login;
    const act = document.querySelector('.nav-link.active');
    const page = act && act.id ? act.id.replace('link-', '') : 'home';
    G.chat.round++;
    return (G.chat.round % 3 === 0 ? c.generic : (c[page] || c.home));
  }
  function chatTick(t) {
    const c = G.chat;
    const mayChat = G.shown && !document.hidden && !G.flash && G.mode.m === 'idle' &&
      (G.layout === 'login' || CFG.chatOnMain) && (t - G.lastActivity > CFG.idleChatMs);
    if (!mayChat) { stopChat(); return; }
    if (!c.on) { c.on = true; c.set = pickSet(); c.i = 0; c.nextAt = t + 600; c.speaker = -1; }
    if (t < c.nextAt) return;
    if (c.i >= c.set.length) { c.set = pickSet(); c.i = 0; c.nextAt = t + 9000; c.speaker = -1; c.speakUntil = 0; return; }
    const line = c.set[c.i++];
    const R = robots[line[0]], other = robots[1 - line[0]];
    const dur = clamp(1800 + line[1].length * 55, 2600, 5200);
    if (other.S.bubbleKind === 'chat') other.bubble.classList.remove('show');
    say(R, line[1], 'chat', dur);
    c.speaker = line[0]; c.speakUntil = t + dur - 300; c.nextAt = t + dur + 700;
  }

  /* ===================== Update per robot ===================== */
  const armKeys = ['px', 'py', 'pz', 'rx', 'rz'];
  const setVis = (arr, v) => arr.forEach((m) => { m.visible = v; });
  const cover = (s) => ({ px: s * 0.24, py: 0.45, pz: 0.62, rx: Math.PI + 0.25, rz: 0 });

  function exprOf(R, t) {
    if (G.flash) return G.flash.kind;
    if (G.mode.m !== 'idle') return G.mode.m;
    if (t < R.S.waveUntil && t >= R.S.waveStart) return 'wave';
    if (G.chat.on) return (G.chat.speaker === R.idx && t < G.chat.speakUntil) ? 'talk' : 'listen';
    return 'idle';
  }

  function update(R, tnow, dt) {
    const S = R.S, P = R.p, th = R.th;
    const t = tnow / 1000;
    const expr = exprOf(R, tnow);
    if (expr !== S.prev) {
      if (expr === 'pass' && !G.told.pass) { G.told.pass = true; say(robots[1], 'Tenang, kami tutup mata 🙈', '', 2200); }
      if (expr === 'peek' && !G.told.peek) { G.told.peek = true; say(robots[0], 'Hehe, ngintip dikit 👀', '', 2200); }
      S.prev = expr;
    }
    const startRef = G.flash ? G.flash.start : S.waveStart;
    const el = Math.max(0, (tnow - startRef) / 1000);
    const prog = G.flash && isFinite(G.flash.until) ? clamp((tnow - G.flash.start) / (G.flash.until - G.flash.start), 0, 1) : 0;
    const decay = 1 - prog;
    const toPartner = R.idx === 0 ? 1 : -1;

    const T = { eye: 'round', mouth: 'smile', open: 1, color: th.eye, bulb: th.bulb, blush: 0, yaw: 0, pitch: 0, tilt: 0,
                L: R.rest(-1), Rr: R.rest(1), jump: 0, fb: 0.55, fa: 0.08, ff: 2.2 };
    switch (expr) {
      case 'success':
        T.eye = 'happy'; T.color = COL.gold; T.bulb = COL.gold; T.blush = 0.8;
        T.L.rz = -(1.9 + Math.sin(t * 5) * 0.12); T.Rr.rz = 1.9 + Math.sin(t * 5 + 1) * 0.12;
        T.tilt = Math.sin(t * 3) * 0.06; T.jump = calm ? 0 : Math.abs(Math.sin(el * 4.5)) * 0.1;
        T.fa = 0.3; T.ff = 9;
        break;
      case 'error':
        T.open = 0.8; T.mouth = 'frown'; T.color = COL.worry; T.bulb = COL.worry;
        T.L.rz = -0.6; T.Rr.rz = 0.6; T.pitch = 0.1; T.tilt = toPartner * -0.05;
        T.fb = 0.3; T.fa = 0.02;
        break;
      case 'wave': {
        const w = R.idx === 0 ? 'Rr' : 'L';
        T.mouth = 'smile'; T.blush = 0.5;
        T[w].rz = (R.idx === 0 ? 1 : -1) * (2.1 + Math.sin(t * 9) * 0.25);
        T.tilt = Math.sin(t * 3) * 0.05; T.fa = 0.15; T.ff = 5;
        break;
      }
      case 'pass':
        T.open = 0.06; T.mouth = 'flat'; T.pitch = 0.1; T.L = cover(-1); T.Rr = cover(1); T.fb = 0.3; T.fa = 0.03;
        break;
      case 'peek':
        T.open = 1.1; T.mouth = 'o'; T.pitch = 0.16; T.yaw = 0.12 * toPartner;
        T.Rr = cover(1); T.L = Object.assign(R.rest(-1), { rz: -0.7 });
        break;
      case 'user': {
        const ratio = clamp((G.mode.len || 0) / 22, 0, 1);
        T.pitch = 0.22; T.yaw = toPartner * 0.25 + (ratio - 0.5) * 0.3; T.blush = 0.25;
        break;
      }
      case 'talk':
        T.mouth = Math.sin(t * 13) > 0 ? 'o' : 'smile'; T.yaw = toPartner * 0.45; T.pitch = Math.sin(t * 3) * 0.03; T.blush = 0.3;
        T.tilt = Math.sin(t * 2.2) * 0.04;
        break;
      case 'listen':
        T.yaw = toPartner * 0.45; T.pitch = 0.03 + Math.sin(t * 1.6) * 0.04; T.blush = 0.35; T.tilt = toPartner * 0.04;
        break;
      default: {
        const r = R.canvas.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        if (tnow - G.lastPointer < 5000) {
          T.yaw = clamp((G.px - cx) / (window.innerWidth * 0.5), -1, 1) * 0.5;
          T.pitch = clamp((G.py - cy) / (window.innerHeight * 0.5), -1, 1) * 0.3;
        } else {
          T.yaw = Math.sin(t * 0.5 + R.idx * 2) * 0.3; T.pitch = Math.sin(t * 0.37 + R.idx) * 0.08;
        }
        T.blush = S.hover ? 0.4 : 0;
      }
    }
    if (expr === 'error' || expr === 'success' || expr === 'wave') { /* sayap sudah diatur */ }

    const k = 1 - Math.exp(-dt * 6);
    S.yaw += (T.yaw - S.yaw) * k;
    S.pitch += (T.pitch - S.pitch) * k;
    S.tilt += (T.tilt - S.tilt) * k;
    S.blush += (T.blush - S.blush) * k;
    S.eyeOpen += (T.open - S.eyeOpen) * (1 - Math.exp(-dt * 10));
    S.pulse = Math.max(0, S.pulse - dt * 3);

    const shake = expr === 'error' && !calm ? Math.sin(el * 12) * 0.2 * decay : 0;
    P.head.rotation.y = S.yaw + shake;
    P.head.rotation.x = S.pitch + Math.sin(S.pulse * Math.PI) * 0.07;
    P.head.rotation.z = S.tilt;
    P.face.position.set(S.yaw * 0.06, -S.pitch * 0.04, 0);

    const bob = Math.sin(t * 1.4 + R.idx * 1.7) * (calm ? 0.015 : 0.045);
    P.root.position.y = bob + T.jump;
    P.root.rotation.y = S.yaw * 0.15;
    P.root.scale.set(1 - S.pulse * 0.02, 1 + S.pulse * 0.035, 1 - S.pulse * 0.02);
    const sh = 1 - P.root.position.y * 0.35;
    P.shadow.scale.set(sh, sh, sh);

    const ka = 1 - Math.exp(-dt * 7);
    [['L', T.L], ['R', T.Rr]].forEach(([side, tg]) => {
      const a = P.arms[side];
      armKeys.forEach((key) => { a.c[key] += (tg[key] - a.c[key]) * ka; });
      a.g.position.set(a.c.px, a.c.py, a.c.pz);
      a.g.rotation.x = a.c.rx; a.g.rotation.z = a.c.rz;
    });

    if (P.wingPivots.length) {
      S.wb += (T.fb - S.wb) * k;
      const flap = S.wb + Math.sin(t * T.ff + R.idx) * T.fa * (calm ? 0.3 : 1);
      P.wingPivots.forEach((w) => { w.pv.rotation.y = w.sd * flap; });
    }

    let blink = 0;
    S.nextBlink -= dt;
    if (S.nextBlink <= 0 && S.blinkT < 0) { S.blinkT = 0; S.nextBlink = 2.5 + Math.random() * 3.5; }
    if (S.blinkT >= 0) {
      S.blinkT += dt;
      const b = S.blinkT / 0.2;
      blink = b < 0.5 ? b * 2 : (b < 1 ? (1 - b) * 2 : 0);
      if (b >= 1) S.blinkT = -1;
    }
    setVis(P.eyes.round, T.eye === 'round'); setVis(P.eyes.happy, T.eye === 'happy'); setVis(P.eyes.x, false);
    Object.keys(P.mouth).forEach((key) => { P.mouth[key].visible = (key === T.mouth); });
    const ey = 1.3 * Math.max(0.06, S.eyeOpen) * (1 - 0.92 * blink);
    P.eyes.round.forEach((m) => m.scale.set(1, ey, 0.4));
    P.eyeMat.color.setHex(T.color);
    P.blushMat.opacity = S.blush * 0.7;
    P.bulbMat.color.setHex(T.bulb); P.bulbMat.emissive.setHex(T.bulb);
    P.bulbMat.emissiveIntensity = expr === 'error' ? 0.5 + 0.3 * Math.sin(t * 6) : 0.55 + 0.3 * Math.sin(t * 2.4 + R.idx);
    P.antenna.rotation.z = Math.sin(t * 1.8 + R.idx) * 0.1 - S.yaw * 0.12;

    R.renderer.render(R.scene, R.camera);
  }

  /* ===================== Loop ===================== */
  function frame(ts) {
    requestAnimationFrame(frame);
    if (ts - G.lastCheck > 250) {
      G.lastCheck = ts;
      applyLayout();
      G.shown = !document.hidden && robots.some((R) => isShown(R.stage));
    }
    if (!G.shown) { G.last = 0; return; }
    const tnow = now();
    const dt = G.last ? Math.min(0.05, (ts - G.last) / 1000) : 0.016;
    G.last = ts;
    if (G.flash && tnow >= G.flash.until) G.flash = null;
    G.mode = mode();
    chatTick(tnow);
    robots.forEach((R) => { if (isShown(R.stage)) update(R, tnow, dt); });
  }

  function init() {
    try {
      robots = THEMES.map((th, i) => buildRobot(th, i));
    } catch (e) {
      console.warn('[Robot Duo] WebGL tidak tersedia', e);
      robots.forEach((R) => R.stage.remove());
      return;
    }
    const act = () => { G.lastActivity = now(); };
    window.addEventListener('pointermove', (e) => { G.px = e.clientX; G.py = e.clientY; G.lastPointer = G.lastActivity = now(); }, { passive: true });
    ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'].forEach((ev) => window.addEventListener(ev, act, { passive: true, capture: true }));
    document.addEventListener('focusin', act);
    document.addEventListener('input', (e) => {
      act(); if (e.target && e.target.tagName === 'INPUT') robots.forEach((R) => { R.S.pulse = Math.max(R.S.pulse, 0.6); });
    }, true);
    window.addEventListener('resize', () => { G.lastCheck = 0; });

    robots.forEach((R) => document.body.appendChild(R.stage)); // sementara; applyLayout memindahkan
    applyLayout();
    G.ready = true;
    while (pending.length) pending.shift()();
    requestAnimationFrame(frame);
  }

  function start() {
    hookSuccess();
    injectStyles();
    overlay = document.getElementById('loginOverlay');
    loadThree(init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

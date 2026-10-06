import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* ============ PENGATURAN ============ */
const CFG = {
  walk: 1.35,          // kecepatan jalan (m/detik): lambat dan berat
  eye: 1.6,            // tinggi mata
  radius: 0.28,        // jari-jari tabrakan pemain
  reach: 2.3,          // jarak interaksi
  sens: 0.0032,        // sensitivitas geser layar
  fov: 72,
  fog: 0xcfb878, fogDensity: 0.06,
  exposure: 1.1, bloom: 0.45,
  roomLight: 20,       // terang lampu tiap ruangan
  tableHeight: 0.75, closetHeight: 2.1, closetMaxWidth: 2.6,
  clockTime: [3, 17], clockRoll: 0,   // jam dinding berhenti di sini; ubah clockRoll (derajat) bila jam tampak miring/terbalik
  keyScale: 1.5        // kunci diperbesar supaya mudah terlihat
};
const MAP = {"rows": ["...........................................IIII..NNNNNNNNN..", "MMMMMccTTUUAAAAAAAAA.......................IIII..NNNNNNNNN..", "MMMMMccTTUUAAAAAAAAA.RRRRRRRRRSSSSSSSScccccIIII..NNNNNNNNN..", "MMMMMccTTUUAAAAAAAAA.RRRRRRRRRSSSSSSSScccccIIII..NNNNNNNNN..", "MMMMMccTTUUAAAAAAAAA.RRRRRRRRRSSSSSSSScccccIIII..NNNNNNNNN..", "MMMMMccTTUUAAAAAAAAA.RRRRRRRRRSSSSSSSScccccIIII..NNNNNNNNN..", ".....ccccccccccccccccRRRRRRRRRSSSSSSSSccccccccccccccGGGGG...", ".....ccccccccccccccccRRRRRRRRRSSSSSSSSccccccccccccccGGGGG...", "BBBBBcc111222223333ccRRRRRRRRR444455555ccHHHHHVVVVccGGGGG...", "BBBBBcc111222223333ccccccccccc444455555ccHHHHHVVVVccGGGGG...", "BBBBBcc111222223333ccccccccccc444455555ccHHHHHVVVVccGGGGG...", "BBBBBcc111222223333ccccccccccc444455555ccHHHHHVVVVccGGGGG...", "DDDDDcc111222223333LLLLLLLLLLc444455555ccHHHHHVVVVccWWWWWW..", "DDDDDccPPPPPPQQQQ..LLLLLLLLLLcccccccccccccccccVVVVccWWWWWW..", "DDDDDccPPPPPPQQQQ..LLLLLLLLLLcccccccccccccccccVVVVccWWWWWW..", "DDDDDccPPPPPPQQQQ..LLLLLLLLLLcccccccccccccccccccccccWWWWWW..", "..gggkkkkkkkkkkccccLLLLLLLLLLccccYYYYYYYYYYYYYccccccWWWWWW..", "..gggkkkkkkkkkkccccLLLLLLLLLLccccYYYYYYYYYYYYY....cc........", "..gggkkkkkkkkkkccccLLLLLLLLLLccccYYYYYYYYYYYYY....cc........", "..aaaaaaaaaaaa.ccccLLLLLLLLLLccccYYYYYYYYYYYYY....ccZZZZZZ..", "..aaaaaaaaaaaa.ccccccccXXccccccccYYYYYYYYYYYYY....ccZZZZZZ..", "..aaaaaaaaaaaa.ccccccccXXccccccccYYYYYYYYYYYYY....ccZZZZZZ..", "..aaaaaaaaaaaauuuuu.KKKKKKKK.OOOOYYYYYYYYYYYYY....ccZZZZZZ..", "..aaaaaaaaaaaauuuuu.KKKKKKKK.OOOOYYYYYYYYYYYYY....ccZZZZZZ..", "..aaaaaaaaaaaauuuuu.KKKKKKKK.OOOOYYYYYYYYYYYYY....ccZZZZZZ..", "..aaaaaaaaaaaauuuuu.KKKKKKKK.OOOOYYYYYYYYYYYYY....cc...EEE..", "..aaaaaaaaaaaauuuuu.KKKKKKKK.OOOOJJJ...FFFFFFFF........EEE..", "..............uuuuu.KKKKKKKK.OOOOJJJ...FFFFFFFF........EEE..", ".................................JJJ...FFFFFFFF........EEE..", ".................................JJJ...FFFFFFFF.............", ".......................................FFFFFFFF.............", ".......................................FFFFFFFF.............", ".......................................FFFFFFFF.............", ".......................................FFFFFFFF.............", ".......................................FFFFFFFF.............", "............................................................", "............................................................"], "doors": [[23, 11, "S", "open"], [18, 17, "E", "open"], [28, 17, "E", "open"], [20, 19, "S", "open"], [26, 19, "S", "open"], [23, 19, "S", "exit"], [4, 2, "E", "open"], [7, 5, "S", "open"], [9, 5, "S", "open"], [14, 5, "S", "open"], [4, 9, "E", "open"], [4, 13, "E", "open"], [7, 7, "S", "open"], [11, 7, "S", "open"], [16, 7, "S", "open"], [6, 13, "E", "open"], [12, 13, "E", "open"], [13, 15, "S", "open"], [14, 16, "E", "open"], [5, 15, "S", "open"], [4, 16, "E", "open"], [7, 18, "S", "open"], [13, 23, "E", "open"], [15, 21, "S", "open"], [21, 21, "S", "open"], [30, 21, "S", "open"], [32, 23, "E", "open"], [37, 15, "S", "open"], [32, 17, "E", "open"], [33, 25, "S", "open"], [41, 25, "S", "open"], [20, 6, "E", "open"], [24, 8, "S", "open"], [37, 3, "E", "key"], [29, 9, "E", "open"], [31, 12, "S", "open"], [35, 12, "S", "open"], [38, 9, "E", "open"], [44, 5, "S", "open"], [42, 7, "S", "open"], [47, 7, "S", "open"], [50, 5, "S", "open"], [51, 8, "E", "open"], [51, 13, "E", "jam"], [51, 21, "E", "jam"]], "names": {"M": "Ruang Medis", "T": "Toilet (Pria)", "U": "Toilet (Wanita)", "A": "Ruang Arsip", "B": "Ruang Kosong 3", "D": "Ruang Kosong 4", "1": "Kantor 1", "2": "Kantor 2", "3": "Kantor 3", "P": "Pantry", "Q": "Ruang Kosong 5", "L": "Lobby / Resepsionis", "R": "Ruang Rapat", "S": "Ruang Keamanan", "4": "Kantor 4", "5": "Kantor 5", "I": "Ruang Listrik", "N": "Ruang Maintenance", "G": "Gudang", "H": "Ruang Penyimpanan", "V": "Ruang Server", "W": "Ruang Kosong 2", "Z": "Ruang Terkunci", "E": "Tangga ke Lantai 2", "Y": "Area Terbuka / Courtyard", "F": "Ruang Bawah Tanah", "J": "Tangga ke Basement", "O": "Ruang Observasi", "K": "Ruang Perpustakaan", "u": "Ruang Tunggu", "a": "Ruang Aula / Serbaguna", "g": "Tangga ke Lantai 2", "k": "Ruang Kosong 1", "X": "Pintu Keluar", "c": "Koridor"}};
const FILES = {
  table: 'table.glb',
  closet: 'game_ready_animated_closet_-_built_in.glb',
  key: 'key_with_tag.glb'
};
const SIZES = { table: 8457716, closet: 592492, key: 2248420 };
// aset dekor lobby (opsional). Yang tidak dipakai karena terlalu berat untuk HP: indoor_plant.glb (90 ribu vertex), chesterfield-sofa.glb (78 ribu vertex)
const PROPS = { clock: '2533ef500ece4fcc804872c706df036b.glb', plantDry: 'dried_up_plant.glb', plantFicus: 'indoor_plant_decor.glb', sofa: 'sofa.glb' };
const PROP_SIZES = { clock: 2001172, plantDry: 6325036, plantFicus: 2569384, sofa: 3566292 };
const fileUrl = f => new URL('./' + f, import.meta.url).href;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rnd = Math.random;
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ease = t => t * t * (3 - 2 * t);

/* cari jendela buka-tutup dari satu track animasi (otomatis, tanpa angka manual) */
function analyzeTrack(tr) {
  const n = tr.getValueSize(), v = tr.values, t = tr.times, cnt = t.length, dev = new Float32Array(cnt);
  let pk = 0;
  for (let i = 0; i < cnt; i++) {
    let d = 0;
    if (n === 4) { const dot = Math.abs(v[0] * v[i * 4] + v[1] * v[i * 4 + 1] + v[2] * v[i * 4 + 2] + v[3] * v[i * 4 + 3]); d = 2 * Math.acos(Math.min(1, dot)); }
    else { for (let k = 0; k < n; k++) d += (v[i * n + k] - v[k]) ** 2; d = Math.sqrt(d); }
    dev[i] = d; if (d > dev[pk]) pk = i;
  }
  const max = dev[pk]; if (max < 1e-4) return null;
  const thr = max * 0.02; let f = -1, l = -1, pf = -1, pl = -1;
  for (let i = 0; i < cnt; i++) {
    if (dev[i] > thr) { if (f < 0) f = i; l = i; }
    if (dev[i] > max * 0.98) { if (pf < 0) pf = i; pl = i; }
  }
  return { a: t[Math.max(0, f - 1)], b: t[pf], c: t[pl], d: t[Math.min(cnt - 1, l + 1)] };
}
function mergeWin(ws) {
  ws = ws.filter(Boolean);
  return { a: Math.min(...ws.map(w => w.a)), b: Math.max(...ws.map(w => w.b)), c: Math.min(...ws.map(w => w.c)), d: Math.max(...ws.map(w => w.d)) };
}

/* gerakan buka/tutup yang menggerakkan animasi bawaan GLB */
class Anim {
  constructor(root, clip, win, dur = 0.9) {
    this.mixer = new THREE.AnimationMixer(root);
    this.action = this.mixer.clipAction(clip); this.action.play(); this.action.paused = true;
    this.w = win; this.dur = dur; this.p = 0; this.dir = 1; this.open = false; this.dirty = true;
  }
  toggle() { this.open = !this.open; this.dir = this.open ? 1 : -1; }
  update(dt) {
    const np = clamp(this.p + this.dir * dt / this.dur, 0, 1);
    if (np !== this.p || this.dirty) {
      this.p = np; this.dirty = false;
      const e = ease(this.p), w = this.w;
      this.action.time = this.dir > 0 ? w.a + (w.b - w.a) * e : w.c + (w.d - w.c) * (1 - e);
      this.mixer.update(0);
    }
  }
}

export async function createGame({ renderer, onProgress = () => {}, onExit = () => {} }) {
  /* ---------- muat model ---------- */
  const got = { table: 0, closet: 0, key: 0, clock: 0, plantDry: 0, plantFicus: 0, sofa: 0 };
  const total = Object.values(SIZES).concat(Object.values(PROP_SIZES)).reduce((a, b) => a + b, 0);
  const loader = new GLTFLoader();
  const load = (k, map = FILES) => new Promise((res, rej) => loader.load(fileUrl(map[k]), res, x => {
    got[k] = x.loaded; onProgress(Math.min(1, Object.values(got).reduce((a, b) => a + b, 0) / total));
  }, err => rej(new Error('Gagal memuat ' + map[k]))));
  const loadOpt = k => load(k, PROPS).catch(e => { console.warn(e.message + ' (dipakai bentuk sederhana)'); return null; });
  const [tableG, closetG, keyG, clockG, dryG, ficusG, sofaG] = await Promise.all([
    load('table'), load('closet'), load('key'), loadOpt('clock'), loadOpt('plantDry'), loadOpt('plantFicus'), loadOpt('sofa')]);
  onProgress(1);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  /* ---------- scene ---------- */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(CFG.fog);
  scene.fog = new THREE.FogExp2(CFG.fog, CFG.fogDensity);
  const camera = new THREE.PerspectiveCamera(CFG.fov, innerWidth / innerHeight, 0.05, 45);
  camera.rotation.order = 'YXZ';
  const size = renderer.getSize(new THREE.Vector2());
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: 4 }));
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(size.x / 2, size.y / 2), CFG.bloom, 0.9, 0.95);
  composer.addPass(bloom); composer.addPass(new OutputPass());
  const prevExposure = renderer.toneMappingExposure;
  renderer.toneMappingExposure = CFG.exposure;

  /* ---------- tekstur prosedural ---------- */
  const canvasTex = (sz, draw) => {
    const c = document.createElement('canvas'); c.width = c.height = sz; draw(c.getContext('2d'), sz);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy()); return t;
  };
  const wallTex = canvasTex(256, (g, s) => {
    g.fillStyle = '#b9a45a'; g.fillRect(0, 0, s, s);
    for (let x = 0; x < s; x += 32) { g.fillStyle = (x / 32) % 2 ? 'rgba(255,240,170,.10)' : 'rgba(70,50,10,.10)'; g.fillRect(x, 0, 16, s); g.fillStyle = 'rgba(90,70,20,.25)'; g.fillRect(x + 8, 0, 1, s); }
    for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${rnd() < .5 ? '60,45,10' : '255,235,160'},${rnd() * .08})`; g.fillRect(rnd() * s, rnd() * s, 1 + rnd() * 2, 1 + rnd() * 2); }
  });
  const carpetTex = canvasTex(256, (g, s) => {
    g.fillStyle = '#8f7d3a'; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${rnd() > .5 ? '200,180,90' : '50,40,10'},${rnd() * .25})`; g.fillRect(rnd() * s, rnd() * s, 2, 2); }
  });
  const ceilTex = canvasTex(128, (g, s) => {
    g.fillStyle = '#cbb978'; g.fillRect(0, 0, s, s); g.fillStyle = 'rgba(80,62,20,.5)'; g.fillRect(0, 0, s, 2); g.fillRect(0, 0, 2, s);
    for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(60,45,10,${rnd() * .07})`; g.fillRect(rnd() * s, rnd() * s, 2, 2); }
  });
  const glowTex = canvasTex(64, (g, s) => {
    const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.35, 'rgba(255,255,255,.35)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, s, s);
  });
  glowTex.wrapS = glowTex.wrapT = THREE.ClampToEdgeWrapping;
  const paperTex = (lines = true) => canvasTex(128, (g, s) => {
    g.fillStyle = '#e6dcb4'; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(110,90,40,${rnd() * .12})`; g.fillRect(rnd() * s, rnd() * s, 2, 2); }
    if (lines) { g.fillStyle = 'rgba(60,45,20,.55)'; for (let y = 24; y < s - 10; y += 14) g.fillRect(14, y, s - 28 - rnd() * 40, 2); }
  });

  const M = {
    wall: new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.95 }),
    floor: new THREE.MeshStandardMaterial({ map: carpetTex, roughness: 1 }),
    ceil: new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.95 }),
    door: new THREE.MeshStandardMaterial({ color: 0x4d4120, roughness: 0.7 }),
    crate: new THREE.MeshStandardMaterial({ color: 0x9c7e45, roughness: 0.9 }),
    trim: new THREE.MeshStandardMaterial({ color: 0x4a3c16, roughness: 0.8 })
  };
  const boxGeo = (w, h, d, unit = 2.4) => {
    const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / unit, uv.getY(i) * dims[f][1] / unit); }
    return g;
  };
  const planeGeo = (w, d, unit = 2.4) => {
    const g = new THREE.PlaneGeometry(w, d), uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / unit, uv.getY(i) * d / unit); return g;
  };

  /* ---------- peta (dibaca dari MAP; 1 sel = 1 meter) ---------- */
  const colliders = [], rayList = [], anims = [], flickers = [];
  const H = 3, TH = 0.2;
  const addCollider = (x1, z1, x2, z2, extra = {}) => { const c = { minX: Math.min(x1, x2), maxX: Math.max(x1, x2), minZ: Math.min(z1, z2), maxZ: Math.max(z1, z2), on: true, ...extra }; colliders.push(c); return c; };
  const rows = MAP.rows, MW = rows[0].length, MH = rows.length;
  const cellAt = (x, z) => (x < 0 || z < 0 || x >= MW || z >= MH) ? '.' : rows[z][x];
  const rect = {};
  for (let z = 0; z < MH; z++) for (let x = 0; x < MW; x++) {
    const c = rows[z][x]; if (c === '.' || c === 'c') continue;
    const r = rect[c] || (rect[c] = { x1: x, z1: z, x2: x + 1, z2: z + 1 });
    r.x1 = Math.min(r.x1, x); r.z1 = Math.min(r.z1, z); r.x2 = Math.max(r.x2, x + 1); r.z2 = Math.max(r.z2, z + 1);
  }
  function wall(x1, z1, x2, z2, h = H, y = 0, collide = true) {
    const horiz = z1 === z2, len = horiz ? Math.abs(x2 - x1) : Math.abs(z2 - z1);
    const w = horiz ? len + TH : TH, d = horiz ? TH : len + TH;
    const m = new THREE.Mesh(boxGeo(w, h, d), M.wall);
    m.position.set((x1 + x2) / 2, y + h / 2, (z1 + z2) / 2); scene.add(m); rayList.push(m);
    if (collide) addCollider(m.position.x - w / 2, m.position.z - d / 2, m.position.x + w / 2, m.position.z + d / 2);
    return m;
  }
  scene.add(new THREE.HemisphereLight(0xfff0b0, 0x6b5a2a, 0.95));

  // dinding: dibuat di setiap batas antar-area, kecuali di celah pintu; segmen sejajar digabung
  const doorEdges = new Set();
  MAP.doors.forEach(([x, z, side]) => { doorEdges.add(`${x},${z},${side}`); doorEdges.add(side === 'S' ? `${x + 1},${z},S` : `${x},${z + 1},E`); });
  for (let zl = 0; zl <= MH; zl++) { let st = -1;
    for (let x = 0; x <= MW; x++) {
      const has = x < MW && cellAt(x, zl - 1) !== cellAt(x, zl) && !doorEdges.has(`${x},${zl - 1},S`);
      if (has && st < 0) st = x; if (!has && st >= 0) { wall(st, zl, x, zl); st = -1; }
    } }
  for (let xl = 0; xl <= MW; xl++) { let st = -1;
    for (let z = 0; z <= MH; z++) {
      const has = z < MH && cellAt(xl - 1, z) !== cellAt(xl, z) && !doorEdges.has(`${xl - 1},${z},E`);
      if (has && st < 0) st = z; if (!has && st >= 0) { wall(xl, st, xl, z); st = -1; }
    } }

  // lantai, langit-langit (berlubang di area terbuka), halaman
  const floor = new THREE.Mesh(planeGeo(MW, MH), M.floor); floor.rotation.x = -Math.PI / 2; floor.position.set(MW / 2, 0, MH / 2); scene.add(floor);
  const Y = rect.Y;
  [[0, 0, MW, Y.z1], [0, Y.z2, MW, MH], [0, Y.z1, Y.x1, Y.z2], [Y.x2, Y.z1, MW, Y.z2]].forEach(([a, b, c2, d]) => {
    const m = new THREE.Mesh(planeGeo(c2 - a, d - b), M.ceil); m.rotation.x = Math.PI / 2; m.position.set((a + c2) / 2, H, (b + d) / 2); scene.add(m);
  });
  const yardMat = new THREE.MeshStandardMaterial({ map: carpetTex, color: 0x8f9a62, roughness: 1 });
  const yard = new THREE.Mesh(planeGeo(Y.x2 - Y.x1, Y.z2 - Y.z1), yardMat); yard.rotation.x = -Math.PI / 2; yard.position.set((Y.x1 + Y.x2) / 2, 0.02, (Y.z1 + Y.z2) / 2); scene.add(yard);
  const fountain = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.5, 0.6, 20), M.trim); fountain.position.set((Y.x1 + Y.x2) / 2, 0.3, (Y.z1 + Y.z2) / 2); scene.add(fountain); rayList.push(fountain);
  addCollider(fountain.position.x - 1.5, fountain.position.z - 1.5, fountain.position.x + 1.5, fountain.position.z + 1.5);

  // titik lampu: tiap ruangan + koridor; panel neon (instanced) di langit-langit
  const anchors = [];
  Object.entries(rect).forEach(([k, r]) => {
    if (k === 'Y' || k === 'L') return;
    const w = r.x2 - r.x1, d = r.z2 - r.z1, nx = Math.max(1, Math.round(w / 6)), nz = Math.max(1, Math.round(d / 6));
    for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) anchors.push([r.x1 + w * (i + 0.5) / nx, r.z1 + d * (j + 0.5) / nz]);
  });
  const corr = [];
  for (let z = 0; z < MH; z++) for (let x = 0; x < MW; x++) if (rows[z][x] === 'c' && !corr.some(a => (a[0] - x - .5) ** 2 + (a[1] - z - .5) ** 2 < 25)) corr.push([x + .5, z + .5]);
  corr.forEach(a => anchors.push(a));
  // Lobby: 4 lampu plafon, satu di antaranya (SW) berkedip; sudut timur laut dan tenggara sengaja lebih redup
  const LOBBY_LIGHTS = [[rect.L.x1 + 2.5, rect.L.z1 + 2.2, 'n'], [rect.L.x1 + 7.5, rect.L.z1 + 2.2, 'n'], [rect.L.x1 + 2.5, rect.L.z1 + 6, 'f'], [rect.L.x1 + 7.5, rect.L.z1 + 6, 'n']];
  LOBBY_LIGHTS.forEach(a => anchors.push(a));
  const panelAnchors = anchors.filter(a => a[2] === undefined);
  const panelMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xfff0b8).multiplyScalar(2.4), toneMapped: false });
  const panels = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.2, 0.5), panelMat, panelAnchors.length);
  { const mtx = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)), one = new THREE.Vector3(1, 1, 1);
    panelAnchors.forEach((a, i) => { mtx.compose(new THREE.Vector3(a[0], H - 0.01, a[1]), q, one); panels.setMatrixAt(i, mtx); }); }
  panels.frustumCulled = false; scene.add(panels);
  // hanya 5 lampu asli yang dipindah ke titik terdekat pemain (hemat performa HP)
  const lightPool = Array.from({ length: 5 }, () => { const l = new THREE.PointLight(0xffe6a8, CFG.roomLight, 12, 2); scene.add(l); return l; });
  function updateLights(px, pz) {
    const s = anchors.map(a => [(a[0] - px) ** 2 + (a[1] - pz) ** 2, a]).sort((p, q) => p[0] - q[0]);
    lightPool.forEach((l, i) => { const a = s[i] ? s[i][1] : [px, pz]; l.position.set(a[0], H - 0.35, a[1]); l.userData.flick = a[2] === 'f'; });
  }

  /* ---------- pintu ---------- */
  const doorByKind = {}, slideDoors = [];
  MAP.doors.forEach(([x, z, side, kind]) => {
    const horiz = side === 'S', cx = x + 1, cz = z + 1, h = 2.4;
    const lint = new THREE.Mesh(horiz ? new THREE.BoxGeometry(2.2, H - h, TH) : new THREE.BoxGeometry(TH, H - h, 2.2), M.wall);
    lint.position.set(cx, h + (H - h) / 2, cz); scene.add(lint); rayList.push(lint);
    if (kind === 'open') return;
    const slab = new THREE.Mesh(horiz ? new THREE.BoxGeometry(2, h, 0.12) : new THREE.BoxGeometry(0.12, h, 2), M.door);
    slab.position.set(cx, h / 2, cz); scene.add(slab); rayList.push(slab);
    const col = horiz ? addCollider(cx - 1, cz - 0.1, cx + 1, cz + 0.1) : addCollider(cx - 0.1, cz - 1, cx + 0.1, cz + 1);
    const d = { slab, col, horiz, open: false, t: 0, p0: horiz ? cx : cz, kind };
    (doorByKind[kind] = doorByKind[kind] || []).push(d);
  });
  const D2 = doorByKind.key[0], D3 = doorByKind.exit[0];
  function openDoor(d) { d.open = true; d.col.on = false; slideDoors.push(d); }
  (doorByKind.jam || []).forEach(d => {
    d.slab.userData.inter = { label: () => 'Terkunci', use: () => toast('Pintu ini macet dan tidak bisa dibuka.') };
  });

  /* ---------- dekor ---------- */
  function crate(x, z, s = 0.8, hh = 0.8) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(s, hh, s), M.crate); m.position.set(x, hh / 2, z); m.rotation.y = rnd() * 0.5;
    scene.add(m); rayList.push(m); addCollider(x - s / 2 - .05, z - s / 2 - .05, x + s / 2 + .05, z + s / 2 + .05);
  }
  function corner(k, c) { const r = rect[k]; crate(c.includes('W') ? r.x1 + 0.9 : r.x2 - 0.9, c.includes('N') ? r.z1 + 0.9 : r.z2 - 0.9, 0.7 + rnd() * 0.5, 0.6 + rnd() * 0.7); }
  [['G', 'NW'], ['G', 'SE'], ['N', 'NE'], ['a', 'NW'], ['a', 'SW'], ['H', 'SW'], ['H', 'NE'], ['B', 'NW'], ['D', 'SW'], ['K', 'NE'], ['u', 'SE'], ['O', 'SW'], ['Q', 'NE'], ['R', 'SE'], ['V', 'SW']].forEach(([k, c]) => corner(k, c));
  function deskBox(k, w, hh, d, dz = 0) {
    const r = rect[k], x = (r.x1 + r.x2) / 2, z = (r.z1 + r.z2) / 2 + dz;
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), M.crate); m.position.set(x, hh / 2, z); scene.add(m); rayList.push(m);
    addCollider(x - w / 2 - .05, z - d / 2 - .05, x + w / 2 + .05, z + d / 2 + .05);
    return m;
  }
  const lobbyDesk = deskBox('L', 4.6, 1.1, 1.0, -1.5);     // meja resepsionis
  deskBox('R', 5, 0.8, 1.8);           // meja rapat
  const exitGlow = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xfff3c0).multiplyScalar(3), toneMapped: false }));
  exitGlow.position.set((rect.X.x1 + rect.X.x2) / 2, 1.5, rect.X.z2 - 0.12); exitGlow.rotation.y = Math.PI; scene.add(exitGlow);

  /* ---------- material model ---------- */
  const fixedMats = new Set();
  function fixModelMats(root, shiny = false) {
    root.traverse(o => {
      if (!o.isMesh) return;
      (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => {
        if (fixedMats.has(m)) return; fixedMats.add(m);
        if (shiny) { m.envMap = envTex; m.envMapIntensity = 1; m.roughness = Math.min(1, Math.max(0.25, m.roughness)); }
        else { m.metalness = 0; m.metalnessMap = null; m.roughness = Math.max(0.6, m.roughness); }
        if (m.transparent && m.opacity === 1 && !m.alphaTest) { m.transparent = false; }
        m.needsUpdate = true;
      });
    });
  }
  fixModelMats(tableG.scene); fixModelMats(closetG.scene); fixModelMats(keyG.scene, true);

  function fit(root, { height, maxWidth }) {
    const wrap = new THREE.Group(); wrap.add(root); root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root), sz = box.getSize(new THREE.Vector3());
    let s = height / sz.y; if (maxWidth && sz.x * s > maxWidth) s = maxWidth / sz.x;
    wrap.scale.setScalar(s); wrap.updateMatrixWorld(true); box.setFromObject(wrap);
    wrap.position.set(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2);
    const outer = new THREE.Group(); outer.add(wrap); scene.add(outer); outer.updateMatrixWorld(true); return outer;
  }
  // letakkan furnitur menempel dinding ruangan: side = dinding yang ditempeli (N/S/W/E), along = posisi sepanjang dinding
  const YAW = { N: 0, S: Math.PI, W: Math.PI / 2, E: -Math.PI / 2 };
  function placeWall(outer, k, side, frac, extra = 0.3) {
    const r = rect[k]; outer.rotation.y = YAW[side]; outer.updateMatrixWorld(true);
    const sz = new THREE.Box3().setFromObject(outer).getSize(new THREE.Vector3());
    if (side === 'N') outer.position.set(r.x1 + (r.x2 - r.x1) * frac, 0, r.z1 + 0.1 + sz.z / 2 + 0.02);
    else if (side === 'S') outer.position.set(r.x1 + (r.x2 - r.x1) * frac, 0, r.z2 - 0.1 - sz.z / 2 - 0.02);
    else if (side === 'W') outer.position.set(r.x1 + 0.1 + sz.x / 2 + 0.02, 0, r.z1 + (r.z2 - r.z1) * frac);
    else outer.position.set(r.x2 - 0.1 - sz.x / 2 - 0.02, 0, r.z1 + (r.z2 - r.z1) * frac);
    outer.updateMatrixWorld(true);
    const b = new THREE.Box3().setFromObject(outer);
    if (side === 'N') b.max.z += extra; else if (side === 'S') b.min.z -= extra; else if (side === 'W') b.max.x += extra; else b.min.x -= extra;
    addCollider(b.min.x, b.min.z, b.max.x, b.max.z);
    return YAW[side];
  }

  /* ---------- tempat sembunyi + benda ---------- */
  const ray = new THREE.Raycaster();
  const spots = [];   // {anim, getPos(v)}
  const tmpV = new THREE.Vector3();

  // cari permukaan menghadap atas di bawah titik (x,z) pada mesh tertentu
  function findSurface(meshes, x, z, yTop) {
    ray.set(new THREE.Vector3(x, yTop, z), new THREE.Vector3(0, -1, 0)); ray.far = 3;
    const hits = ray.intersectObjects(meshes, false);
    for (const h of hits) {
      if (!h.face) continue;
      const n = h.face.normal.clone().transformDirection(h.object.matrixWorld);
      if (n.y > 0.6 && h.point.y > 0.03) return h.point.clone();
    }
    return null;
  }

  function addTable(k, side, frac) {
    const root = tableG.scene.clone(true);
    const outer = fit(root, { height: CFG.tableHeight });
    const yaw = placeWall(outer, k, side, frac, 0.28);
    root.traverse(o => { if (o.isMesh) rayList.push(o); });
    const fr = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));   // arah depan meja
    tableG.animations[0].tracks.forEach(tr => {
      const w = analyzeTrack(tr); if (!w) return;
      const nodeName = tr.name.split('.')[0], node = root.getObjectByName(nodeName); if (!node) return;
      const anim = new Anim(root, new THREE.AnimationClip(nodeName, -1, [tr]), w, 0.8); anims.push(anim);
      const spec = { label: () => anim.open ? 'Tutup laci' : 'Buka laci', use: () => anim.toggle() };
      const meshes = []; node.traverse(o => { if (o.isMesh) { o.userData.inter = spec; meshes.push(o); } });
      // titik di atas bagian depan laci (pose tertutup), disimpan dalam koordinat node laci
      node.updateWorldMatrix(true, true);
      const bb = new THREE.Box3().setFromObject(node), ctr = bb.getCenter(new THREE.Vector3());
      const half = Math.abs(fr.x) * (bb.max.x - bb.min.x) / 2 + Math.abs(fr.z) * (bb.max.z - bb.min.z) / 2;
      const px = ctr.x + fr.x * half * 0.4, pz = ctr.z + fr.z * half * 0.4;
      const hit = findSurface(meshes, px, pz, bb.max.y + 0.05) || new THREE.Vector3(px, bb.max.y, pz);
      const local = node.worldToLocal(hit.clone());
      spots.push({ anim, getPos: v => node.localToWorld(v.copy(local)) });
    });
  }
  function addCloset(k, side, frac) {
    const root = closetG.scene.clone(true);
    const outer = fit(root, { height: CFG.closetHeight, maxWidth: CFG.closetMaxWidth });
    placeWall(outer, k, side, frac, 0.55);
    const meshes = [], bodyMeshes = [];
    const win = mergeWin(closetG.animations[0].tracks.map(analyzeTrack));
    const anim = new Anim(root, closetG.animations[0], win, 1.1); anims.push(anim);
    const spec = { label: () => anim.open ? 'Tutup lemari' : 'Buka lemari', use: () => anim.toggle() };
    root.traverse(o => { if (o.isMesh) { o.userData.inter = spec; rayList.push(o); meshes.push(o); if (/^Body/i.test(o.name)) bodyMeshes.push(o); } });
    outer.updateMatrixWorld(true);
    const bb = new THREE.Box3(); (bodyMeshes.length ? bodyMeshes : meshes).forEach(m => bb.expandByObject(m));
    const sx = bb.max.x - bb.min.x, sz = bb.max.z - bb.min.z, found = [];
    for (let i = 0; i < 60 && found.length < 2; i++) {
      const x = bb.min.x + sx * (0.15 + rnd() * 0.7), z = bb.min.z + sz * (0.2 + rnd() * 0.6);
      const p = findSurface(bodyMeshes.length ? bodyMeshes : meshes, x, z, bb.max.y - 0.08);
      if (p && p.y < CFG.closetHeight - 0.2 && found.every(q => q.distanceTo(p) > 0.5)) found.push(p);
    }
    while (found.length < 2) found.push(new THREE.Vector3((bb.min.x + bb.max.x) / 2 + (found.length ? 0.4 : -0.4), 1.0, (bb.min.z + bb.max.z) / 2));
    found.forEach(p => spots.push({ anim, getPos: v => v.copy(p) }));
  }
  // furnitur (kode ruangan, dinding yang ditempeli, posisi 0..1 sepanjang dinding)
  addTable('1', 'S', 0.5); addTable('2', 'S', 0.5); addTable('3', 'S', 0.3); addTable('4', 'N', 0.5);
  addCloset('3', 'E', 0.5); addCloset('A', 'N', 0.3); addCloset('A', 'N', 0.75); addCloset('M', 'N', 0.5);

  /* ---------- state game ---------- */
  const code = [0, 1, 2, 3].map(() => Math.floor(rnd() * 10));
  const colors = [{ n: 'merah', c: 0xc0392b }, { n: 'biru', c: 0x2e6fd0 }, { n: 'kuning', c: 0xe9c95c }];
  const order = shuffle([0, 1, 2]);
  const S = { hasKey: false, known: [null, null, null, null], seq: 0, powered: false, exitOpen: false, won: false, t0: performance.now() };

  /* ---------- benda (kunci & kertas) ---------- */
  const items = [], fly = [];
  const glowMat = c => new THREE.SpriteMaterial({ map: glowTex, color: c, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false });
  const proxyMat = new THREE.MeshBasicMaterial({ visible: false });

  function makeKeyVisual() {
    const root = keyG.scene.clone(true), box = new THREE.Box3().setFromObject(root), c = box.getCenter(new THREE.Vector3());
    root.position.sub(c);
    const g = new THREE.Group(); g.add(root); g.rotation.x = -Math.PI / 2; g.scale.setScalar(CFG.keyScale);
    const w = new THREE.Group(); w.add(g); return w;
  }
  function makePaperVisual() {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.004, 0.18), new THREE.MeshStandardMaterial({ map: paperTex(), roughness: 1 }));
    return m;
  }
  function addItem(kind, spot, data) {
    const g = new THREE.Group(), vis = kind === 'key' ? makeKeyVisual() : makePaperVisual();
    vis.rotation.y = rnd() * Math.PI * 2; g.add(vis);
    const glow = new THREE.Sprite(glowMat(kind === 'key' ? 0xfff2a0 : 0xfff0c8)); glow.scale.setScalar(kind === 'key' ? 0.34 : 0.22); glow.position.y = 0.04; g.add(glow);
    const proxy = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.24), proxyMat); g.add(proxy);
    const it = { kind, spot, group: g, glow, data, taken: false, seed: rnd() * 10 };
    proxy.userData.inter = {
      label: () => kind === 'key' ? 'Ambil kunci' : 'Ambil kertas',
      use: () => pickUp(it)
    };
    rayList.push(proxy); g.visible = false; scene.add(g); items.push(it); spot.item = it; return it;
  }
  const spotOrder = shuffle(spots.slice());
  addItem('key', spotOrder[0], {});
  for (let i = 0; i < 4; i++) addItem('digit', spotOrder[i + 1], { idx: i, digit: code[i] });

  function pickUp(it) {
    if (it.taken) return; it.taken = true; it.spot.item = null;
    fly.push({ it, t: 0, from: it.group.position.clone() });
    if (it.kind === 'key') { S.hasKey = true; toast('Kunci didapat. Coba pintu Ruang Keamanan di timur laut.'); }
    else { S.known[it.data.idx] = it.data.digit; showNote('Kertas lusuh', `Tulisan tangan yang pudar:<br><b>Digit ke-${it.data.idx + 1} kode pintu keluar: ${it.data.digit}</b>`); }
    renderInv();
  }

  /* ---------- pintu D2: kunci ---------- */
  const dSpec = (d, spec) => { d.slab.userData.inter = spec; };
  dSpec(D2, {
    label: () => D2.open ? null : (S.hasKey ? 'Buka pintu dengan kunci' : 'Pintu Ruang Keamanan terkunci'),
    use: () => { if (S.hasKey) { openDoor(D2); toast('Pintu terbuka.'); renderObj(); } else toast('Terkunci. Kuncinya tersembunyi di salah satu ruang kantor.'); }
  });

  /* ---------- pemasangan di dinding ruangan ---------- */
  function mount(k, side, along, y, t = 0.06) {
    const r = rect[k], g = new THREE.Group(), off = 0.1 + t / 2 + 0.006;
    if (side === 'N') { g.position.set(along, y, r.z1 + off); g.rotation.y = 0; }
    else if (side === 'S') { g.position.set(along, y, r.z2 - off); g.rotation.y = Math.PI; }
    else if (side === 'W') { g.position.set(r.x1 + off, y, along); g.rotation.y = Math.PI / 2; }
    else { g.position.set(r.x2 - off, y, along); g.rotation.y = -Math.PI / 2; }
    scene.add(g); return g;
  }
  const addRay = (g, m) => { g.add(m); rayList.push(m); return m; };

  /* ---------- puzzle saklar (Ruang Keamanan) ---------- */
  const swMeshes = [];
  { const g = mount('S', 'W', (rect.S.z1 + rect.S.z2) / 2, 1.35, 0.06);
    addRay(g, new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 0.06), M.door));
    colors.forEach((col, i) => {
      const m = addRay(g, new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.09), new THREE.MeshStandardMaterial({ color: col.c, roughness: 0.5, emissive: col.c, emissiveIntensity: 0 })));
      m.position.set((i - 1) * 0.48, 0, 0.06); swMeshes.push(m);
      m.userData.inter = { label: () => S.powered ? null : 'Tekan saklar ' + col.n, use: () => pressSwitch(i) };
    }); }
  function pressSwitch(i) {
    if (S.powered) return;
    if (i === order[S.seq]) {
      S.seq++; swMeshes[i].material.emissiveIntensity = 0.9;
      if (S.seq === 3) { S.powered = true; keyScreen.material.color.set(0x6fe08a); lobbyPower(); toast('Terdengar bunyi listrik menyala dari arah lobby.'); }
      else toast('Klik.');
    } else {
      S.seq = 0; swMeshes.forEach(m => { m.material.emissiveIntensity = 0; });
      toast('Urutan salah. Semua saklar kembali.');
    }
    renderObj();
  }
  // catatan urutan di dinding utara Ruang Keamanan
  { const g = mount('S', 'N', (rect.S.x1 + rect.S.x2) / 2 + 1.5, 1.45, 0.01);
    const clue = addRay(g, new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.55), new THREE.MeshStandardMaterial({ map: paperTex(), roughness: 1 })));
    clue.userData.inter = {
      label: () => 'Baca catatan di dinding',
      use: () => showNote('Catatan di dinding', `Urutan yang benar:<br><b>${order.map(i => colors[i].n).join(' → ')}</b>`)
    }; }

  /* ---------- panel kode + pintu keluar (Lobby) ---------- */
  let keyScreen;
  { const g = mount('L', 'S', rect.X.x1 - 0.8, 1.3, 0.08);
    const plate = addRay(g, new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.5, 0.08), M.door));
    keyScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.1), new THREE.MeshBasicMaterial({ color: 0xd04a3a, toneMapped: false }));
    keyScreen.position.set(0, 0.15, 0.046); g.add(keyScreen);
    plate.userData.inter = {
      label: () => S.exitOpen ? null : (S.powered ? 'Masukkan kode' : 'Panel mati'),
      use: () => S.powered ? openKeypad() : toast('Panel mati. Listriknya belum menyala, cari saklar di Ruang Keamanan.')
    }; }
  D3.slab.userData.inter = {
    label: () => D3.open ? null : 'Pintu keluar terkunci',
    use: () => toast('Butuh kode. Panelnya ada di sebelah kiri pintu.')
  };

  /* ---------- dekor Lobby: gedung yang dulu normal lalu ditinggalkan ---------- */
  // Semua dibuat ringan (bentuk sederhana + 4 model GLB yang teksturnya dikecilkan). Jalur spawn -> resepsionis -> pintu tetap lapang.
  const LR = rect.L, lobbyG = new THREE.Group(); scene.add(lobbyG);
  const CX = (LR.x1 + LR.x2) / 2, CZ = (LR.z1 + LR.z2) / 2 - 1.5;       // pusat meja resepsionis (sama dengan deskBox)
  const LM = {
    counter: new THREE.MeshStandardMaterial({ color: 0x4a3a22, roughness: 0.85 }),
    top: new THREE.MeshStandardMaterial({ color: 0x8c7650, roughness: 0.6 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x25231f, roughness: 0.6 }),
    beige: new THREE.MeshStandardMaterial({ color: 0xcfc2a0, roughness: 0.7 }),
    vinyl: new THREE.MeshStandardMaterial({ color: 0x5a4a2e, roughness: 0.8 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x3a3a38, roughness: 0.5 }),
    cork: new THREE.MeshStandardMaterial({ color: 0x9c7c4c, roughness: 1 }),
    paper: new THREE.MeshStandardMaterial({ map: paperTex(), roughness: 1 })
  };
  const bx = (w, h, d, mat, x, y, z, ry = 0, parent = lobbyG) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.rotation.y = ry; parent.add(m); return m;
  };
  const texFrom = (w, h, draw) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  };
  const FONT = "'Barlow Condensed','Arial Narrow',Arial,sans-serif";
  const solid = (x1, z1, x2, z2) => addCollider(x1, z1, x2, z2);

  // kecilkan tekstur model dekor (hemat memori HP) dan hilangkan efek metalik yang tampil hitam
  function shrinkTex(root, max = 512) {
    root.traverse(o => {
      if (!o.isMesh) return;
      (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => {
        ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap', 'alphaMap'].forEach(k => {
          const t = m[k]; if (!t || !t.image || t.userData.shrunk) return;
          const w = t.image.width, h = t.image.height; if (!w || Math.max(w, h) <= max) return;
          const sc = max / Math.max(w, h), c = document.createElement('canvas');
          c.width = Math.round(w * sc); c.height = Math.round(h * sc); c.getContext('2d').drawImage(t.image, 0, 0, c.width, c.height);
          t.image = c; t.userData.shrunk = true; t.needsUpdate = true;
        });
      });
    });
  }
  const prep = G => { if (G) { fixModelMats(G.scene); shrinkTex(G.scene); } return G; };
  prep(clockG); prep(dryG); prep(ficusG); prep(sofaG);

  // ---- lampu plafon lobby (3 normal + 1 berkedip) ----
  const tintL = new THREE.Color(0xfff0b8);
  const flickMat = new THREE.MeshBasicMaterial({ color: tintL.clone().multiplyScalar(2.4), toneMapped: false });
  LOBBY_LIGHTS.forEach(a => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.5), a[2] === 'f' ? flickMat : panelMat);
    m.rotation.x = Math.PI / 2; m.position.set(a[0], H - 0.01, a[1]); scene.add(m);
  });
  let flickT = 0, flickNext = 2.5, flickVal = 1, monT = 0, monBlink = false, monitorOn = false;
  function lobbyTick(dt) {
    if (!reduce) {
      flickNext -= dt; if (flickNext < 0) { flickT = 0.35; flickNext = 2.5 + rnd() * 6; }
      if (flickT > 0) { flickT -= dt; flickVal = rnd() > 0.45 ? 0.15 : 0.9; } else flickVal = 1;
    } else flickVal = 1;
    flickMat.color.copy(tintL).multiplyScalar(2.4 * (0.15 + 0.85 * flickVal));
    lightPool.forEach(l => { l.intensity = CFG.roomLight * (l.userData.flick ? 0.3 + 0.7 * flickVal : 1); });
    if (monitorOn) { monT -= dt; if (monT < 0) { monT = 0.55; monBlink = !monBlink; drawMonitor(); } }
  }

  // ---- meja resepsionis (focal point) ----
  lobbyDesk.material = LM.counter;
  bx(4.8, 0.05, 1.12, LM.top, CX, 1.125, CZ);
  { const plaque = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.24), new THREE.MeshStandardMaterial({ roughness: 0.8, map: texFrom(256, 48, (g, w, h) => {
      g.fillStyle = '#2b2415'; g.fillRect(0, 0, w, h); g.strokeStyle = '#a58a45'; g.lineWidth = 2; g.strokeRect(3, 3, w - 6, h - 6);
      g.fillStyle = '#d9c27a'; g.font = '600 30px ' + FONT; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('RESEPSIONIS', w / 2, h / 2 + 2); }) }));
    plaque.position.set(CX, 0.72, CZ + 0.5 + 0.012); lobbyG.add(plaque); }

  // monitor lama (menghadap pengunjung); mati sampai listrik menyala
  const monTex = texFrom(256, 192, () => {});
  function drawMonitor() {
    const g = monTex.image.getContext('2d');
    g.fillStyle = '#04120a'; g.fillRect(0, 0, 256, 192);
    g.fillStyle = '#7dff9c'; g.font = '600 22px monospace'; g.textBaseline = 'top';
    ['SYSTEM ONLINE', '', '> POWER RESTORED', '> DOOR LOCK: ENGAGED', '> EXIT CODE: REQUIRED'].forEach((t, i) => { g.font = (i === 0 ? '700 24px' : '600 15px') + ' monospace'; g.fillText(t, 14, 16 + i * 26); });
    if (monBlink) g.fillText('_', 14, 16 + 5 * 26);
    for (let y = 0; y < 192; y += 4) { g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, y, 256, 1); }
    monTex.needsUpdate = true;
  }
  const monG = new THREE.Group(); monG.position.set(CX - 0.9, 1.15, CZ - 0.12); monG.rotation.y = 0.14; lobbyG.add(monG);
  bx(0.2, 0.025, 0.2, LM.beige, 0, 0.012, 0, 0, monG); bx(0.08, 0.06, 0.08, LM.beige, 0, 0.055, 0, 0, monG);
  bx(0.4, 0.34, 0.07, LM.beige, 0, 0.26, 0, 0, monG); bx(0.3, 0.26, 0.28, LM.beige, 0, 0.26, -0.17, 0, monG);
  const screenOff = new THREE.MeshStandardMaterial({ color: 0x0a0e0b, roughness: 0.25 });
  const screenOn = new THREE.MeshBasicMaterial({ map: monTex, toneMapped: false, color: new THREE.Color(1.3, 1.3, 1.3) });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.235), screenOff); screen.position.set(0, 0.265, 0.037); monG.add(screen);
  const monGlow = new THREE.Sprite(glowMat(0x66ff99)); monGlow.scale.setScalar(0.9); monGlow.position.set(0, 0.265, 0.12); monGlow.visible = false; monG.add(monGlow);
  monGlow.material.opacity = 0.3;
  function lobbyPower() { monitorOn = true; screen.material = screenOn; monGlow.visible = true; drawMonitor(); }

  // keyboard, mouse, telepon meja (hanya properti)
  { const kb = bx(0.42, 0.02, 0.14, LM.beige, CX - 0.9, 1.16, CZ + 0.24, 0.08);
    const keys = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.12), new THREE.MeshStandardMaterial({ roughness: 0.8, map: texFrom(128, 40, (g, w, h) => {
      g.fillStyle = '#bdb08c'; g.fillRect(0, 0, w, h); g.fillStyle = '#4a4538';
      for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) g.fillRect(3 + c * 8.8, 3 + r * 9, 7, 7); }) }));
    keys.rotation.x = -Math.PI / 2; keys.position.y = 0.0105; kb.add(keys);
    bx(0.06, 0.025, 0.1, LM.beige, CX - 0.52, 1.163, CZ + 0.26, 0.25);
    const ph = bx(0.2, 0.045, 0.22, LM.dark, CX + 1.2, 1.175, CZ - 0.05, 0.35);
    bx(0.21, 0.035, 0.05, LM.dark, 0, 0.04, 0, 0, ph);
    bx(0.04, 0.03, 0.05, LM.metal, -0.1, 0.03, 0, 0, ph); bx(0.04, 0.03, 0.05, LM.metal, 0.1, 0.03, 0, 0, ph); }
  // dokumen di meja
  [[CX + 0.5, CZ + 0.15, 0.4], [CX + 0.55, CZ + 0.2, -0.2], [CX + 0.1, CZ - 0.25, 1.1], [CX + 1.7, CZ + 0.2, 0.7]].forEach(([x, z, r], i) => bx(0.21, 0.004, 0.297, LM.paper, x, 1.153 + i * 0.003, z, r));
  bx(0.24, 0.012, 0.32, LM.dark, CX + 1.65, 1.158, CZ + 0.3, 0.3);   // papan klip

  // kursi resepsionis (bergeser dan agak miring dari meja)
  { const g = new THREE.Group(); g.position.set(22.55, 0, 13.3); g.rotation.y = 0.75; lobbyG.add(g);
    bx(0.5, 0.07, 0.5, LM.vinyl, 0, 0.52, 0, 0, g); bx(0.48, 0.55, 0.07, LM.vinyl, 0, 0.84, -0.24, 0, g);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8), LM.metal); post.position.y = 0.27; g.add(post);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.03, 10), LM.metal); base.position.y = 0.03; g.add(base);
    solid(22.2, 12.95, 22.9, 13.65); }

  // ---- area kursi tunggu (dinding barat): 3 kursi + meja kecil + sofa di dinding utara ----
  function waitChair(x, z, ry) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; lobbyG.add(g);
    bx(0.46, 0.06, 0.44, LM.vinyl, 0, 0.45, 0, 0, g); bx(0.46, 0.46, 0.05, LM.vinyl, 0, 0.72, -0.2, 0, g);
    [[-0.2, -0.18], [0.2, -0.18], [-0.2, 0.18], [0.2, 0.18]].forEach(([lx, lz]) => bx(0.035, 0.44, 0.035, LM.metal, lx, 0.22, lz, 0, g));
    solid(x - 0.3, z - 0.3, x + 0.3, z + 0.3);
  }
  const WX = LR.x1 + 0.1 + 0.3;                                    // sandaran kursi menempel dinding barat
  waitChair(WX, 14.4, Math.PI / 2);
  waitChair(WX + 0.35, 15.5, Math.PI / 2 + 0.38);                  // kursi yang bergeser dan miring
  waitChair(WX, 16.55, Math.PI / 2);
  { const tx = LR.x1 + 1.6, tz = 15.5;
    bx(0.6, 0.04, 0.6, LM.top, tx, 0.47, tz);
    [[-0.26, -0.26], [0.26, -0.26], [-0.26, 0.26], [0.26, 0.26]].forEach(([lx, lz]) => bx(0.04, 0.45, 0.04, LM.metal, tx + lx, 0.225, tz + lz));
    solid(tx - 0.32, tz - 0.32, tx + 0.32, tz + 0.32);
    const mag = (col, title, x, z, r, y) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.006, 0.28), new THREE.MeshStandardMaterial({ roughness: 1, map: texFrom(84, 112, (g, w, h) => {
        g.fillStyle = col; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.75)'; g.fillRect(6, 8, w - 12, 22);
        g.fillStyle = '#222'; g.font = '700 16px ' + FONT; g.textAlign = 'center'; g.fillText(title, w / 2, 25);
        g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(12, 48, w - 24, 40); g.fillStyle = 'rgba(0,0,0,.12)'; for (let i = 0; i < 5; i++) g.fillRect(12, 94 + i * 3, w - 24, 1); }) }));
      m.position.set(x, y, z); m.rotation.y = r; lobbyG.add(m);
    };
    mag('#8a3b2b', 'KOTA', tx - 0.05, tz - 0.02, 0.3, 0.493); mag('#2b5a8a', 'BISNIS', tx + 0.03, tz + 0.06, -0.25, 0.499); mag('#7a7a3a', 'SEHAT', tx - 0.08, tz + 0.12, 0.1, 0.505);
    bx(0.1, 0.004, 0.21, LM.paper, tx + 0.18, 0.492, tz - 0.14, 0.6); bx(0.1, 0.004, 0.21, LM.paper, tx + 0.2, 0.496, tz - 0.12, 0.4); }

  // ---- model GLB bila tersedia, bila tidak: bentuk sederhana ----
  function faceFront(outer, tx, tz) {                               // putar supaya sisi depan sofa menghadap (tx,tz)
    outer.rotation.y = 0; outer.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(outer), sz = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
    const axis = sz.x < sz.z ? 'x' : 'z', yTop = box.min.y + (box.max.y - box.min.y) * 0.85, v = new THREE.Vector3();
    let sum = 0;
    outer.traverse(o => { if (!o.isMesh) return; const p = o.geometry.attributes.position;
      for (let i = 0; i < p.count; i += 2) { v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld); if (v.y > yTop) sum += v[axis] - c[axis]; } });
    const back = sum > 0 ? 1 : -1, fx = axis === 'x' ? -back : 0, fz = axis === 'z' ? -back : 0;
    outer.rotation.y = Math.atan2(tx, tz) - Math.atan2(fx, fz);
  }
  { // sofa di dinding utara sebelah kiri pintu
    let sofa;
    if (sofaG) { sofa = fit(sofaG.scene, { height: 0.9 }); faceFront(sofa, 0, 1); }
    else { sofa = new THREE.Group(); scene.add(sofa); bx(1.9, 0.4, 0.85, LM.vinyl, 0, 0.3, 0, 0, sofa); bx(1.9, 0.5, 0.2, LM.vinyl, 0, 0.7, -0.33, 0, sofa); bx(0.2, 0.55, 0.85, LM.vinyl, -0.85, 0.45, 0, 0, sofa); bx(0.2, 0.55, 0.85, LM.vinyl, 0.85, 0.45, 0, 0, sofa); }
    sofa.updateMatrixWorld(true);
    const sz = new THREE.Box3().setFromObject(sofa).getSize(new THREE.Vector3());
    sofa.position.set(LR.x1 + 2.1, 0, LR.z1 + 0.1 + sz.z / 2 + 0.03); sofa.updateMatrixWorld(true);
    const b = new THREE.Box3().setFromObject(sofa); solid(b.min.x, b.min.z, b.max.x, b.max.z + 0.1); }

  function plant(G, dry, h, x, z, tint) {
    let p;
    if (G) { p = fit(G.scene, { height: h }); if (tint) p.traverse(o => { if (o.isMesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if (m.color && !m.userData.tinted) { m.color.multiply(new THREE.Color(tint)); m.userData.tinted = true; } }); }); }
    else { p = new THREE.Group(); scene.add(p);
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.32, 10), LM.cork); pot.position.y = 0.16; p.add(pot);
      for (let i = 0; i < 6; i++) { const l = new THREE.Mesh(new THREE.ConeGeometry(0.07, h * 0.6, 5), new THREE.MeshStandardMaterial({ color: 0x6e5c2b, roughness: 1 })); l.position.set(Math.cos(i) * 0.1, 0.32 + h * 0.3, Math.sin(i) * 0.1); l.rotation.set(Math.sin(i) * 0.5, 0, Math.cos(i) * 0.5); p.add(l); } }
    p.rotation.z = dry ? 0.04 : 0;                                  // sedikit miring, terkesan layu
    p.position.set(x, 0, z); p.updateMatrixWorld(true);
    solid(x - 0.3, z - 0.3, x + 0.3, z + 0.3);
  }
  plant(ficusG, true, 1.5, LR.x1 + 0.7, LR.z1 + 0.7, 0xc9ab62);      // tanaman karet, dibuat kekuningan (layu)
  plant(dryG, true, 0.85, LR.x2 - 0.7, LR.z1 + 0.7, 0xd8c9a8);       // tanaman kering di pojok timur laut

  // ---- jam dinding (berhenti di waktu tertentu, animasi bawaan tidak dimainkan) ----
  { const g = mount('L', 'N', 26.8, 2.2, 0); g.rotation.z = THREE.MathUtils.degToRad(CFG.clockRoll);
    if (clockG) {
      const root = clockG.scene, s = 0.55 / 2; root.scale.setScalar(s); root.position.z = 0.79 * s; g.add(root);
      const [hh, mm] = CFG.clockTime, hand = (name, theta0, theta) => {
        const node = root.getObjectByName(name), tr = clockG.animations[0] && clockG.animations[0].tracks.find(t => t.name === name + '.quaternion');
        if (!node || !tr) return;
        const q0 = new THREE.Quaternion().fromArray(Array.from(tr.values).slice(0, 4));
        node.quaternion.copy(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -THREE.MathUtils.degToRad(theta - theta0)).multiply(q0));
      };
      hand('H_29', 90, (hh % 12) * 30 + mm * 0.5); hand('M_30', 180, mm * 6); hand('Sec_31', 90, 240);
    } else {
      const face = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.05, 24), LM.beige); face.rotation.x = Math.PI / 2; face.position.z = 0.03; g.add(face);
      const hand = (len, ang) => { const h = bx(0.02, len, 0.012, LM.dark, 0, len / 2, 0.06, 0, g); h.geometry.translate(0, 0, 0); const pv = new THREE.Group(); pv.rotation.z = -THREE.MathUtils.degToRad(ang); g.remove(h); pv.add(h); g.add(pv); };
      hand(0.14, (CFG.clockTime[0] % 12) * 30 + CFG.clockTime[1] * 0.5); hand(0.21, CFG.clockTime[1] * 6);
    } }

  // ---- papan pengumuman (dinding utara, kanan sofa) ----
  { const g = mount('L', 'N', LR.x1 + 2.1, 1.85, 0.03);
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.78, 0.03), LM.cork));
    const note = (w, h, x, y, r, draw) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ roughness: 1, map: texFrom(128, Math.round(128 * h / w), draw) })); m.position.set(x, y, 0.018); m.rotation.z = r; g.add(m); };
    const lines = (arr, title) => (g2, w, h) => { g2.fillStyle = '#e6dcb4'; g2.fillRect(0, 0, w, h); g2.fillStyle = '#3a2f18'; g2.textAlign = 'center'; g2.font = '700 15px ' + FONT; g2.fillText(title, w / 2, 20);
      g2.font = '500 11px ' + FONT; arr.forEach((t, i) => g2.fillText(t, w / 2, 40 + i * 14)); };
    note(0.38, 0.5, -0.33, 0.04, 0.03, lines(['Listrik gedung sedang', 'dalam pemeliharaan.', 'Harap menunggu di', 'area lobby.'], 'PENGUMUMAN'));
    note(0.3, 0.4, 0.06, 0.1, -0.05, lines(['Jam kunjungan', '08.00 - 16.00', 'Wajib lapor ke', 'resepsionis.'], 'PENGUNJUNG'));
    note(0.26, 0.34, 0.38, -0.02, 0.06, lines(['Dilarang masuk', 'tanpa izin.'], 'AREA TERBATAS'));
    note(0.2, 0.2, 0.2, -0.26, -0.08, (g2, w, h) => { g2.fillStyle = '#d9d0a8'; g2.fillRect(0, 0, w, h); }); }

  // ---- sign EXIT di atas pintu keluar ----
  { const g = mount('L', 'S', (rect.X.x1 + rect.X.x2) / 2, 2.62, 0.05);
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.24, 0.05), LM.dark));
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.74, 0.18), new THREE.MeshBasicMaterial({ toneMapped: false, color: new THREE.Color(1.5, 1.5, 1.5), map: texFrom(148, 36, (g2, w, h) => {
      g2.fillStyle = '#0c5a2a'; g2.fillRect(0, 0, w, h); g2.fillStyle = '#eafff0'; g2.font = '700 28px ' + FONT; g2.textAlign = 'center'; g2.textBaseline = 'middle'; g2.fillText('EXIT', w / 2, h / 2 + 2); }) }));
    sign.position.z = 0.027; g.add(sign); }

  // ---- kertas jatuh di lantai + noda gelap di pojok (tanpa menutupi jalur) ----
  [[CX - 1.7, CZ + 1.7, 0.4], [CX - 1.2, CZ + 2.1, 2.1], [CX + 0.5, CZ + 1.5, 1.1], [CX + 2.6, CZ + 2.4, 0.2], [CX + 2.2, CZ + 1.9, 2.6], [CX - 0.4, CZ + 3.6, 0.8], [CX - 2.6, CZ + 1.0, 1.5]]
    .forEach(([x, z, r], i) => bx(0.21, 0.004, 0.297, LM.paper, x, 0.004 + i * 0.0004, z, r));
  { const shadowTex = texFrom(64, 64, (g, w, h) => { const r = g.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); r.addColorStop(0, 'rgba(0,0,0,.65)'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); });
    const decal = (x, z, s) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.55, depthWrite: false, fog: false })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.012, z); scene.add(m); };
    decal(LR.x2 - 1.2, LR.z1 + 1.2, 3.4); decal(LR.x2 - 1.2, LR.z2 - 1.2, 3.2); decal(LR.x1 + 1.3, LR.z2 - 1.3, 2.4); }

  /* ---------- HUD ---------- */
  const style = document.createElement('style');
  style.textContent = `
  #hud{position:fixed;inset:0;z-index:4;font-family:'Barlow Condensed','Arial Narrow',system-ui,sans-serif;color:#f3e6b0;-webkit-user-select:none;user-select:none;touch-action:none}
  #hud *{box-sizing:border-box}
  #hud .hlook{position:absolute;inset:0;z-index:1}
  #hud .hx{position:absolute;left:50%;top:50%;width:8px;height:8px;margin:-4px;border:2px solid rgba(243,230,176,.8);border-radius:50%;pointer-events:none;transition:all .12s;z-index:2}
  #hud .hx.on{width:18px;height:18px;margin:-9px;border-color:#e9c95c;background:rgba(233,201,92,.25)}
  #hud .hprompt{position:absolute;left:50%;top:calc(50% + 28px);transform:translateX(-50%);padding:5px 12px;background:rgba(32,26,10,.78);border-left:3px solid #e9c95c;font-size:21px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .12s;z-index:2}
  #hud .hprompt.on{opacity:1}
  #hud .hobj{position:absolute;top:max(12px,calc(env(safe-area-inset-top,0px) + 8px));left:max(12px,calc(env(safe-area-inset-left,0px) + 8px));max-width:46vw;padding:7px 12px;background:rgba(32,26,10,.74);border-left:3px solid #e9c95c;font-size:19px;line-height:1.15;pointer-events:none;z-index:2}
  #hud .hinv{position:absolute;top:max(12px,calc(env(safe-area-inset-top,0px) + 8px));left:50%;transform:translateX(-50%);display:flex;gap:6px;pointer-events:none;z-index:2}
  #hud .chip{padding:4px 10px;background:rgba(32,26,10,.74);border:1px solid #b9993f;font-size:18px}
  #hud .hroom{position:absolute;top:calc(max(12px,calc(env(safe-area-inset-top,0px) + 8px)) + 48px);left:50%;transform:translateX(-50%);font-size:22px;letter-spacing:.04em;text-shadow:0 1px 4px #000;opacity:0;transition:opacity .4s;pointer-events:none;z-index:2;white-space:nowrap}
  #hud .hroom.on{opacity:.9}
  #hud .hexit{position:absolute;top:max(12px,calc(env(safe-area-inset-top,0px) + 8px));right:max(12px,calc(env(safe-area-inset-right,0px) + 8px));height:38px;padding:0 14px;background:rgba(32,26,10,.74);border:1px solid #b9993f;color:inherit;font:inherit;font-size:18px;z-index:3}
  #hud .hstick{position:absolute;left:max(28px,calc(env(safe-area-inset-left,0px) + 20px));bottom:max(28px,calc(env(safe-area-inset-bottom,0px) + 20px));width:130px;height:130px;border-radius:50%;background:rgba(32,26,10,.35);border:2px solid rgba(243,230,176,.45);z-index:3}
  #hud .hstick i{position:absolute;left:50%;top:50%;width:54px;height:54px;margin:-27px;border-radius:50%;background:rgba(233,201,92,.55);border:2px solid #e9c95c}
  #hud .hact{position:absolute;right:max(34px,calc(env(safe-area-inset-right,0px) + 26px));bottom:max(44px,calc(env(safe-area-inset-bottom,0px) + 36px));width:92px;height:92px;border-radius:50%;background:rgba(233,201,92,.9);color:#241c06;border:3px solid #8a6f1e;font:inherit;font-size:24px;font-weight:600;z-index:3;opacity:.5}
  #hud .hact.on{opacity:1}
  #hud .hact:active{transform:scale(.95)}
  #hud .htoast{position:absolute;left:50%;top:18%;transform:translate(-50%,-8px);max-width:min(86vw,440px);padding:9px 16px;background:rgba(32,26,10,.85);border:1px solid #b9993f;font-size:19px;text-align:center;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;z-index:6}
  #hud .htoast.on{opacity:1;transform:translate(-50%,0)}
  #hud .hmodal{position:absolute;inset:0;z-index:7;display:none;align-items:center;justify-content:center;background:rgba(18,13,3,.6);padding:16px}
  #hud .hmodal.on{display:flex}
  #hud .hcard{width:min(92vw,360px);max-height:92vh;overflow:auto;padding:18px;background:#2b2412;border:1px solid #b9993f;text-align:center}
  #hud .hcard h3{margin:0 0 8px;font-size:26px;font-weight:600}
  #hud .hcard p{margin:0 0 14px;font-size:21px;line-height:1.25}
  #hud .hbtn{height:46px;min-width:110px;padding:0 18px;background:#e9c95c;color:#241c06;border:2px solid #8a6f1e;border-bottom-width:5px;border-radius:3px;font:inherit;font-size:22px;font-weight:600;margin:3px}
  #hud .hbtn.alt{background:rgba(32,26,10,.6);color:#f3e6b0;border:1px solid #b9993f}
  #hud .kdisp{height:54px;margin-bottom:10px;background:#120d03;border:1px solid #b9993f;font-size:36px;letter-spacing:.35em;line-height:54px;color:#6fe08a}
  #hud .kgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px}
  #hud .kgrid button{height:52px;background:rgba(32,26,10,.7);color:#f3e6b0;border:1px solid #b9993f;font:inherit;font-size:26px}
  #hud .kgrid button:active{background:#4a3c16}
  @media (orientation:landscape){#hud .hobj{max-width:34vw}}
  @media (prefers-reduced-motion:reduce){#hud .htoast,#hud .hx,#hud .hprompt{transition:none}}`;
  document.head.append(style);
  const hud = document.createElement('div'); hud.id = 'hud';
  hud.innerHTML = `<div class="hlook"></div><div class="hx"></div><div class="hprompt"></div><div class="hobj"></div><div class="hinv"></div><div class="hroom"></div>
  <button class="hexit">Lobby</button><div class="hstick"><i></i></div><button class="hact">Aksi</button><div class="htoast"></div><div class="hmodal"><div class="hcard"></div></div>`;
  document.body.append(hud);
  const $h = s => hud.querySelector(s);
  const elX = $h('.hx'), elPrompt = $h('.hprompt'), elObj = $h('.hobj'), elInv = $h('.hinv'), elRoom = $h('.hroom'), elAct = $h('.hact'), elToast = $h('.htoast'), elModal = $h('.hmodal'), elCard = $h('.hcard');

  let toastTimer; function toast(m) { elToast.textContent = m; elToast.classList.add('on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => elToast.classList.remove('on'), 2600); }
  function renderInv() {
    elInv.innerHTML = (S.hasKey ? '<span class="chip">Kunci</span>' : '') + `<span class="chip">Kode ${S.known.map(d => d === null ? '_' : d).join(' ')}</span>`;
  }
  function renderObj() {
    let t;
    if (S.exitOpen) t = 'Keluar lewat pintu di lobby';
    else if (!S.hasKey && !D2.open) t = 'Cari kunci di ruang kantor (laci, lemari)';
    else if (!D2.open) t = 'Buka pintu Ruang Keamanan';
    else if (!S.powered) t = 'Nyalakan listrik di Ruang Keamanan (saklar)';
    else if (S.known.some(d => d === null)) t = 'Kumpulkan 4 digit kode (cari kertas)';
    else t = 'Masukkan kode di panel dekat pintu keluar';
    elObj.textContent = t;
  }
  renderInv(); renderObj();

  let modal = false;
  function closeModal() { modal = false; elModal.classList.remove('on'); }
  function showNote(title, html) {
    modal = true; elCard.innerHTML = `<h3>${title}</h3><p>${html}</p><button class="hbtn">Tutup</button>`;
    elCard.querySelector('button').onclick = closeModal; elModal.classList.add('on');
  }
  function openKeypad() {
    modal = true; let val = '';
    elCard.innerHTML = `<h3>Panel pintu keluar</h3><div class="kdisp"></div><div class="kgrid">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 'Hapus', 0, 'OK'].map(k => `<button data-k="${k}">${k}</button>`).join('')}</div><button class="hbtn alt" data-k="x">Batal</button>`;
    const disp = elCard.querySelector('.kdisp'), draw = () => { disp.textContent = val.padEnd(4, '·'); }; draw();
    elCard.onclick = e => {
      const k = e.target.dataset && e.target.dataset.k; if (k === undefined) return;
      if (k === 'x') { closeModal(); return; }
      if (k === 'Hapus') val = val.slice(0, -1);
      else if (k === 'OK') {
        if (val === code.join('')) { closeModal(); S.exitOpen = true; openDoor(D3); toast('Kode benar. Pintu keluar terbuka.'); renderObj(); }
        else { val = ''; toast('Kode salah.'); }
      } else if (val.length < 4) val += k;
      draw();
    };
    elModal.classList.add('on');
  }
  function win() {
    S.won = true; modal = true; const sec = Math.round((performance.now() - S.t0) / 1000);
    elCard.onclick = null;
    elCard.innerHTML = `<h3>Kamu berhasil keluar</h3><p>Waktu: ${Math.floor(sec / 60)} menit ${sec % 60} detik</p><button class="hbtn" data-a="again">Main lagi</button><button class="hbtn alt" data-a="lobby">Lobby</button>`;
    elCard.onclick = e => { const a = e.target.dataset && e.target.dataset.a; if (a === 'again') api.dispose('restart'); else if (a === 'lobby') api.dispose('lobby'); };
    elModal.classList.add('on');
  }
  $h('.hexit').onclick = () => api.dispose('lobby');

  /* ---------- input ---------- */
  const stick = { x: 0, y: 0 }, keys = {};
  let yaw = 0, pitch = 0, target = null;
  const stickEl = $h('.hstick'), knob = stickEl.firstElementChild; let sid = null;
  function stickMove(e) {
    const r = stickEl.getBoundingClientRect(), R = r.width / 2 * 0.8;
    let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2); const l = Math.hypot(dx, dy);
    if (l > R) { dx *= R / l; dy *= R / l; }
    stick.x = dx / R; stick.y = dy / R; knob.style.transform = `translate(${dx}px,${dy}px)`;
  }
  stickEl.addEventListener('pointerdown', e => { sid = e.pointerId; stickEl.setPointerCapture(sid); stickMove(e); e.preventDefault(); });
  stickEl.addEventListener('pointermove', e => { if (e.pointerId === sid) stickMove(e); });
  const stickEnd = e => { if (e.pointerId !== sid) return; sid = null; stick.x = stick.y = 0; knob.style.transform = ''; };
  ['pointerup', 'pointercancel'].forEach(n => stickEl.addEventListener(n, stickEnd));

  const look = $h('.hlook'); let lid = null, lx = 0, ly = 0, lt = 0, lm = 0;
  look.addEventListener('pointerdown', e => { lid = e.pointerId; look.setPointerCapture(lid); lx = e.clientX; ly = e.clientY; lt = performance.now(); lm = 0; });
  look.addEventListener('pointermove', e => {
    if (e.pointerId !== lid) return;
    const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY; lm += Math.abs(dx) + Math.abs(dy);
    if (modal) return; yaw -= dx * CFG.sens; pitch = clamp(pitch - dy * CFG.sens, -1.25, 1.25);
  });
  const lookEnd = e => { if (e.pointerId !== lid) return; lid = null; if (lm < 10 && performance.now() - lt < 280) interact(); };
  ['pointerup', 'pointercancel'].forEach(n => look.addEventListener(n, lookEnd));
  elAct.addEventListener('pointerdown', e => { e.preventDefault(); interact(); });
  const onKey = (e, d) => {
    const k = (e.key || '').toLowerCase();
    if (['w', 'a', 's', 'd'].includes(k)) keys[k] = d;
    if (d && (k === 'e' || k === ' ')) interact();
    if (d && !modal) { if (k === 'arrowleft') yaw += 0.08; if (k === 'arrowright') yaw -= 0.08; if (k === 'arrowup') pitch = clamp(pitch + 0.06, -1.25, 1.25); if (k === 'arrowdown') pitch = clamp(pitch - 0.06, -1.25, 1.25); }
  };
  const kd = e => onKey(e, true), ku = e => onKey(e, false);
  addEventListener('keydown', kd); addEventListener('keyup', ku);
  function interact() { if (modal || !target) return; target.spec.use(); renderObj(); }

  /* ---------- gerak + tabrakan ---------- */
  const pos = new THREE.Vector3(24, CFG.eye, 17.4), vel = new THREE.Vector2();
  let phase = 0;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const blocked = (x, z) => colliders.some(c => c.on && x > c.minX - CFG.radius && x < c.maxX + CFG.radius && z > c.minZ - CFG.radius && z < c.maxZ + CFG.radius);

  // debu
  const DN = 520, dp = new Float32Array(DN * 3), dseed = new Float32Array(DN);
  for (let i = 0; i < DN; i++) { dp[i * 3] = rnd() * MW; dp[i * 3 + 1] = rnd() * 3; dp[i * 3 + 2] = rnd() * MH; dseed[i] = rnd() * 100; }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  scene.add(new THREE.Points(dg, new THREE.PointsMaterial({ map: glowTex, color: 0xfff0b0, size: 0.06, transparent: true, opacity: 0.5, depthWrite: false, fog: false })));

  const isActive = o => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
  const centre = new THREE.Vector2(0, 0);
  const fwd = new THREE.Vector3();
  let clock = 0, lightT = 0, curRoom = '', roomTimer; updateLights(pos.x, pos.z);

  function update(dt) {
    clock += dt;
    // gerak
    let ix = (keys.d ? 1 : 0) - (keys.a ? 1 : 0) + stick.x, iy = (keys.w ? 1 : 0) - (keys.s ? 1 : 0) - stick.y;
    if (modal || S.won) { ix = iy = 0; }
    const l = Math.hypot(ix, iy); if (l > 1) { ix /= l; iy /= l; }
    const tx = (Math.cos(yaw) * ix - Math.sin(yaw) * iy) * CFG.walk, tz = (-Math.sin(yaw) * ix - Math.cos(yaw) * iy) * CFG.walk;
    const k = 1 - Math.exp(-dt * 6); vel.x += (tx - vel.x) * k; vel.y += (tz - vel.y) * k;
    const nx = pos.x + vel.x * dt; if (!blocked(nx, pos.z)) pos.x = nx;
    const nz = pos.z + vel.y * dt; if (!blocked(pos.x, nz)) pos.z = nz;
    const sp = Math.hypot(vel.x, vel.y);
    phase += sp / 0.8 * dt * Math.PI * 2;
    const bob = reduce ? 0 : 1;
    camera.position.set(pos.x + Math.cos(phase / 2) * 0.01 * (sp / CFG.walk) * bob, pos.y + Math.sin(phase) * 0.018 * (sp / CFG.walk) * bob, pos.z);
    camera.rotation.set(pitch, yaw, Math.sin(phase / 2) * 0.004 * (sp / CFG.walk) * bob);

    // animasi laci/pintu
    anims.forEach(a => a.update(dt));
    for (let i = slideDoors.length - 1; i >= 0; i--) {
      const d = slideDoors[i]; d.t = Math.min(1, d.t + dt / 1.1); d.slab.position[d.horiz ? 'x' : 'z'] = d.p0 + ease(d.t) * 2.15;
      if (d.t >= 1) slideDoors.splice(i, 1);
    }

    // benda
    items.forEach(it => {
      if (it.taken) return;
      const show = it.spot.anim.p > 0.4; it.group.visible = show; if (!show) return;
      it.spot.getPos(tmpV); it.group.position.copy(tmpV); it.group.position.y += 0.012;
      it.glow.material.opacity = 0.55 + 0.35 * Math.sin(clock * 3 + it.seed);
      if (it.kind === 'key') it.group.children[0].rotation.y += dt * 0.25;
    });
    for (let i = fly.length - 1; i >= 0; i--) {
      const f = fly[i]; f.t += dt / 0.35; const e = ease(Math.min(1, f.t));
      camera.getWorldDirection(fwd); tmpV.copy(camera.position).addScaledVector(fwd, 0.35).y -= 0.12;
      f.it.group.visible = true; f.it.group.position.lerpVectors(f.from, tmpV, e); f.it.group.scale.setScalar(1 - e * 0.9);
      if (f.t >= 1) { scene.remove(f.it.group); fly.splice(i, 1); }
    }

    lobbyTick(dt);
    // lampu berkedip (ruang arsip)
    flickers.forEach(f => {
      f.next -= dt; if (f.next < 0) { f.t = 0.3; f.next = 3 + rnd() * 7; }
      let m = 1; if (f.t > 0) { f.t -= dt; m = rnd() > 0.5 ? 0.25 : 1; } if (f.boost > 0) { f.boost -= dt; m = rnd() > 0.4 ? 0.1 : 1; }
      if (reduce) m = 1; f.pl.intensity = f.base * m; f.pm.color.copy(f.tint).multiplyScalar(2.4 * (0.25 + 0.75 * m));
    });

    // debu
    const p = dg.attributes.position;
    for (let i = 0; i < DN; i++) {
      const s = dseed[i]; p.array[i * 3] += Math.sin(clock * 0.2 + s) * 0.0016; p.array[i * 3 + 1] += Math.sin(clock * 0.3 + s * 1.7) * 0.0012 - 0.0005; p.array[i * 3 + 2] += Math.cos(clock * 0.17 + s) * 0.0012;
      if (p.array[i * 3 + 1] < 0) p.array[i * 3 + 1] = 3;
    }
    p.needsUpdate = true;

    // target interaksi (raycast dari tengah layar)
    target = null;
    if (!modal && !S.won) {
      ray.setFromCamera(centre, camera); ray.far = CFG.reach;
      const hits = ray.intersectObjects(rayList.filter(isActive), false);
      if (hits.length) { const sp2 = hits[0].object.userData.inter; if (sp2) { const lb = sp2.label(); if (lb) target = { spec: sp2, label: lb }; } }
    }
    elX.classList.toggle('on', !!target); elAct.classList.toggle('on', !!target);
    elPrompt.classList.toggle('on', !!target); if (target) elPrompt.textContent = target.label;

    if (S.exitOpen && !S.won && pos.z > rect.X.z1 + 1.1 && pos.x > rect.X.x1 && pos.x < rect.X.x2) win();
    lightT -= dt; if (lightT < 0) { lightT = 0.3; updateLights(pos.x, pos.z); }
    const cc = cellAt(Math.floor(pos.x), Math.floor(pos.z));
    if (cc !== curRoom) { curRoom = cc; elRoom.textContent = MAP.names[cc] || ''; elRoom.classList.add('on'); clearTimeout(roomTimer); roomTimer = setTimeout(() => elRoom.classList.remove('on'), 2200); }
  }

  const onResize = () => { composer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); };
  addEventListener('resize', onResize); onResize();

  const api = {
    update,
    render() { composer.render(); },
    dispose(why = 'lobby') {
      removeEventListener('keydown', kd); removeEventListener('keyup', ku); removeEventListener('resize', onResize);
      hud.remove(); style.remove(); renderer.toneMappingExposure = prevExposure; pmrem.dispose();
      onExit(why);
    }
  };
  return api;
}

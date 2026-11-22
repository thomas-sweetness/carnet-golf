(function () {
  "use strict";

  // =====================================================================
  // Outils
  // =====================================================================
  var app = document.getElementById("app");
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function load(key, fb) {
    try { var r = localStorage.getItem(key); return r ? JSON.parse(r) : fb; } catch (e) { return fb; }
  }
  function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function signed(n) { return n > 0 ? "+" + n : (n === 0 ? "E" : String(n)); }
  function fmtDate(iso, opt) { return new Date(iso).toLocaleDateString("fr-FR", opt || { day: "numeric", month: "short", year: "numeric" }); }
  function fmtShort(iso) { var d = new Date(iso); return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2); }
  function avg(a) { return a.length ? a.reduce(function (s, v) { return s + v; }, 0) / a.length : null; }
  function r1(v) { return Math.round(v * 10) / 10; }

  var toastTimer = null;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("on"); }, 2600);
  }

  // ---------- Icônes (traits fins) ----------
  var P = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    next: '<path d="M9 18l6-6-6-6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h11l-2.5 4L16 12H5"/>',
    club: '<path d="M7 3l6.5 14.5"/><path d="M13.5 17.5c1.5-.6 3.6-.4 4.5.7.8 1 .3 2.3-1.2 2.6l-3.6.7c-.9.2-1.6-.9-1.1-1.7z"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
    chart: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    shuffle: '<path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/>',
    doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8"/><path d="M8 17h6"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14"/><path d="M15 6v14"/>',
    list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    upload: '<path d="M12 15V3"/><path d="M7 8l5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4"/><path d="M15.4 6.5l-6.8 4"/>',
    pin: '<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    expand: '<path d="M4 9V4h5"/><path d="M20 9V4h-5"/><path d="M4 15v5h5"/><path d="M20 15v5h-5"/>',
    shrink: '<path d="M9 4v5H4"/><path d="M15 4v5h5"/><path d="M9 20v-5H4"/><path d="M15 20v-5h5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',
    locate: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/><circle cx="12" cy="12" r="7"/>',
    ball: '<circle cx="12" cy="12" r="8"/><circle cx="10" cy="9" r=".6"/><circle cx="13" cy="9.5" r=".6"/><circle cx="11.5" cy="12.5" r=".6"/><circle cx="14.5" cy="12.5" r=".6"/>',
    swing: '<path d="M5 19c4-1 8-5 10-10"/><circle cx="17" cy="6" r="2.5"/>',
    putt: '<path d="M4 18h16"/><circle cx="16" cy="15.5" r="2.5"/><path d="M6 18V6l5 2-5 2"/>',
    driver: '<path d="M4 20l9-9"/><path d="M13 11c2-2 5-3 7-1s0 4-2 5-4 0-5-4z"/>',
    irons: '<path d="M5 3l7 14"/><path d="M12 17l5 1-1 3-5-1z"/><path d="M17 3l-2 6"/>',
    approach: '<path d="M3 19c3-9 9-13 18-13"/><path d="M17 4l4 2-3 3"/><circle cx="4" cy="19" r="1.5"/>',
    bunker: '<path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M5 13c2-3 5-4 7-4s5 1 7 4"/>',
    body: '<circle cx="12" cy="4.5" r="2"/><path d="M12 7v7"/><path d="M8 21l4-7 4 7"/><path d="M6 10l6-2 6 2"/>',
    game: '<path d="M5 21V8"/><path d="M5 8h8l-2 3 2 3H5"/><path d="M14 21c0-2.5 2-4 4-4s3 1.5 3 4"/>',
    // météo
    sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.2"/><path d="M12 19.8V22"/><path d="M4.9 4.9l1.6 1.6"/><path d="M17.5 17.5l1.6 1.6"/><path d="M2 12h2.2"/><path d="M19.8 12H22"/><path d="M4.9 19.1l1.6-1.6"/><path d="M17.5 6.5l1.6-1.6"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    partly: '<path d="M8 3v1.5"/><path d="M3.8 5.8l1 1"/><path d="M2 10h1.5"/><path d="M5.3 13.2A4 4 0 1 1 11.5 8"/><path d="M17.5 20H9a4 4 0 1 1 .8-7.9A5 5 0 0 1 19.5 13a3.5 3.5 0 0 1-2 7z"/>',
    cloud: '<path d="M17.5 19H8a5 5 0 1 1 1-9.9A6 6 0 0 1 20.4 11 4 4 0 0 1 17.5 19z"/>',
    rain: '<path d="M17.5 15H8a5 5 0 1 1 1-9.9A6 6 0 0 1 20.4 7 4 4 0 0 1 17.5 15z"/><path d="M8 18l-1 3"/><path d="M12 18l-1 3"/><path d="M16 18l-1 3"/>',
    snow: '<path d="M17.5 14H8a5 5 0 1 1 1-9.9A6 6 0 0 1 20.4 6 4 4 0 0 1 17.5 14z"/><path d="M8 18h.01"/><path d="M12 20h.01"/><path d="M16 18h.01"/>',
    storm: '<path d="M17.5 14H8a5 5 0 1 1 1-9.9A6 6 0 0 1 20.4 6 4 4 0 0 1 17.5 14z"/><path d="M12 15l-2 4h4l-2 4"/>',
    fog: '<path d="M4 9h16"/><path d="M3 13h18"/><path d="M5 17h14"/>',
    wind: '<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h16a3 3 0 1 1-3 3"/><path d="M3 16h7"/>'
  };
  function ic(name, cls) { return '<svg class="i ' + (cls || "") + '" viewBox="0 0 24 24">' + (P[name] || "") + "</svg>"; }

  // =====================================================================
  // Stockage
  // =====================================================================
  var K = {
    round: "golf_round_v1", history: "golf_history_v1", notes: "golf_notes_v1", seeded: "golf_seeded_v1",
    ucourses: "golf_courses_v1", geo: "golf_geo_v1", profile: "golf_profile_v1", clubs: "golf_clubs_v2",
    plans: "golf_plans_v1", weather: "golf_weather_v1"
  };
  var profile = load(K.profile, { name: "", theme: "auto" });
  var history = load(K.history, []);
  var notes = load(K.notes, {});
  var userCourses = load(K.ucourses, {});
  var geoOver = load(K.geo, {});
  var round = load(K.round, null);
  var plansState = load(K.plans, { custom: [], checks: {}, hidden: [] });
  function persist(what) {
    if (what === "profile") save(K.profile, profile);
    if (what === "history") save(K.history, history);
    if (what === "notes") save(K.notes, notes);
    if (what === "courses") { save(K.ucourses, userCourses); rebuildCourses(); }
    if (what === "geo") save(K.geo, geoOver);
    if (what === "round") save(K.round, round);
    if (what === "plans") save(K.plans, plansState);
    if (what === "clubs") save(K.clubs, clubs);
  }

  function applyTheme() {
    var t = profile.theme || "auto";
    if (t === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
  }
  applyTheme();

  // =====================================================================
  // Parcours
  // =====================================================================
  var BUILTIN = window.BUILTIN_COURSES || {};
  if (BUILTIN.barbaroux) BUILTIN.barbaroux.center = [43.40622, 6.17148];
  if (BUILTIN.merignies) BUILTIN.merignies.center = [50.51053, 3.13689];
  if (BUILTIN.vertparc) BUILTIN.vertparc.center = [50.57015, 2.83700];
  try {
    var GB = window.GEO_BARBAROUX;
    if (BUILTIN.barbaroux && Array.isArray(GB) && GB.length === BUILTIN.barbaroux.holes.length) {
      GB.forEach(function (x, k) {
        if (!x) return;
        if (x.g) BUILTIN.barbaroux.holes[k].g = x.g;
        if (Array.isArray(x.hz)) BUILTIN.barbaroux.holes[k].hz = x.hz;
      });
    }
  } catch (e) {}

  var COURSES, COURSE_IDS, resolvedCache = { k: "", v: null };
  function rebuildCourses() {
    COURSES = Object.assign({}, BUILTIN, userCourses);
    COURSE_IDS = Object.keys(COURSES);
    resolvedCache = { k: "", v: null };
  }
  rebuildCourses();

  function teeOf(c, id) {
    for (var k = 0; k < c.tees.length; k++) if (c.tees[k].id === id) return c.tees[k];
    return c.tees[0];
  }
  function rawHole(cid, key) {
    var c = COURSES[cid];
    if (!c) return null;
    if (c.loops) {
      var m = String(key).match(/^(.+)-(\d+)$/);
      return m && c.loops[m[1]] ? c.loops[m[1]].holes[+m[2] - 1] : null;
    }
    return c.holes[key] || null;
  }
  function allKeys(cid) {
    var c = COURSES[cid], out = [];
    if (!c) return out;
    if (c.loops) Object.keys(c.loops).forEach(function (l) { for (var n = 1; n <= 9; n++) out.push(l + "-" + n); });
    else c.holes.forEach(function (h, k) { out.push(k); });
    return out;
  }
  function holeGeo(cid, key) {
    var h = rawHole(cid, key);
    var g = Object.assign({}, (h && h.g) || {}, (geoOver[cid] && geoOver[cid][key]) || {});
    Object.keys(g).forEach(function (k) { if (g[k] === null) delete g[k]; });
    return g;
  }
  function holeHazards(cid, key) {
    var h = rawHole(cid, key);
    return h && Array.isArray(h.hz) ? h.hz : [];
  }
  function loopsLabel(c, loops) { return loops.map(function (l) { return c.loops[l].name; }).join(" + "); }
  function nbHolesOf(cid) { var c = COURSES[cid]; return c.loops ? 18 : c.holes.length; }

  // Options de partie : {loops:[a,b]} (golf à boucles), {part:"all"|"out"|"in"|"twice"}
  function playOptions(cid) {
    var c = COURSES[cid];
    if (!c) return [];
    if (c.loops) return null;
    if (c.holes.length === 18) return [
      { v: "all", l: "18 trous", n: 18 }, { v: "out", l: "9 trous aller", n: 9 }, { v: "in", l: "9 trous retour", n: 9 }];
    return [{ v: "all", l: "9 trous", n: 9 }, { v: "twice", l: "18 trous (2 tours)", n: 18 }];
  }

  function resolveCourse(cid, opt) {
    var c = COURSES[cid];
    if (!c) return null;
    opt = opt || {};
    var ck = cid + "|" + JSON.stringify(opt);
    if (resolvedCache.k === ck && resolvedCache.v) return resolvedCache.v;
    var holes = [], label = "";
    if (c.loops) {
      var loops = opt.loops && opt.loops.length ? opt.loops : c.defaultLoops;
      var table = loops.length === 2 && c.pairIndex ? c.pairIndex[loops.slice().sort().join("|")] : null;
      loops.forEach(function (l, li) {
        c.loops[l].holes.forEach(function (h, n) {
          var i;
          if (loops.length === 1) i = h.r;
          else if (table && table[l]) i = table[l][n];
          else i = li === 0 ? 2 * h.r - 1 : 2 * h.r;
          holes.push(Object.assign({}, h, { i: i, key: l + "-" + (n + 1), loopName: c.loops[l].name }));
        });
      });
      label = loopsLabel(c, loops);
    } else {
      var base = c.holes.map(function (h, k) { return Object.assign({}, h, { key: k }); });
      var part = opt.part || "all";
      if (part === "out") { holes = base.slice(0, 9); label = "Aller"; }
      else if (part === "in") { holes = base.slice(9, 18); label = "Retour"; }
      else if (part === "twice") {
        holes = base.map(function (h) { return Object.assign({}, h, { i: h.i ? 2 * h.i - 1 : null }); })
          .concat(base.map(function (h) { return Object.assign({}, h, { i: h.i ? 2 * h.i : null }); }));
        label = "2 tours";
      } else holes = base;
      // Sur 9 trous, l'index devient le rang de difficulté (1 à 9)
      if (holes.length === 9 && holes.some(function (h) { return h.i > 9; })) {
        var order = holes.map(function (h, k) { return { k: k, i: h.i || 99 }; }).sort(function (a, b) { return a.i - b.i; });
        order.forEach(function (o, rank) { holes[o.k] = Object.assign({}, holes[o.k], { i: rank + 1 }); });
      }
    }
    var v = Object.assign({}, c, { id: cid, holes: holes, optLabel: label,
      fullName: c.name + (label ? " (" + label + ")" : "") });
    resolvedCache = { k: ck, v: v };
    return v;
  }
  function roundCourse() { return round && round.course && COURSES[round.course.id] ? resolveCourse(round.course.id, round.course.opt) : null; }
  function curHole() { return round.holes[round.holeIndex]; }
  function curKey(idx) {
    var c = roundCourse();
    var k = idx == null ? round.holeIndex : idx;
    return c && c.holes[k] ? c.holes[k].key : k;
  }

  // Anciennes versions : migration
  (function migrate() {
    var map = function (k) { k = +k; return k < 9 ? "valutte-" + (k + 1) : "rupilly-" + (k - 8); };
    [geoOver, notes].forEach(function (store) {
      var s = store.merignies;
      if (!s) return;
      Object.keys(s).forEach(function (k) { if (/^\d+$/.test(k)) { s[map(k)] = s[k]; delete s[k]; } });
    });
    if (round && round.course) {
      if (round.course.loops && !round.course.opt) round.course.opt = { loops: round.course.loops };
      if (round.course.id === "merignies" && !round.course.opt) round.course.opt = { loops: ["valutte", "rupilly"] };
      if (!COURSES[round.course.id]) round = null;
    }
    if (round && (!round.holes || !round.course)) round = null;
    save(K.geo, geoOver); save(K.notes, notes); save(K.round, round);
  })();

  // Partie déjà jouée, injectée une seule fois
  if (!load(K.seeded, false)) {
    var mer = [[4,4],[4,3],[5,5],[3,3],[7,4],[5,4],[5,4],[4,3],[6,4],[4,4],[6,3],[5,5],[4,3],[5,5],[5,4],[5,4],[7,4],[5,5]];
    var already = history.some(function (r) { return String(r.date).slice(0, 10) === "2026-07-23"; });
    if (!already && (!profile.name || /thomas/i.test(profile.name))) {
      history.push({
        date: "2026-07-23T12:00:00.000Z", course: "Golf de Mérignies (La Valutte + Rupilly)", courseId: "merignies",
        format: "stableford", type: "competition", countsForIndex: true, totalScore: 89, totalPar: 71,
        holes: mer.map(function (x, k) { return { hole: k + 1, score: x[0], par: x[1] }; }),
        putts: 32, avgPutts: "1.8", fwHit: 6, fwCount: 12, girHit: 4, girCount: 17, udHit: 2, udCount: 5, stablefordPoints: 33
      });
      persist("history");
    }
    save(K.seeded, true);
  }

  // =====================================================================
  // Clubs
  // =====================================================================
  var DEFAULT_CLUBS = [
    { id: "dr", name: "Driver", manual: 223 }, { id: "b3", name: "Bois 3", manual: 195 },
    { id: "f5", name: "Fer 5", manual: 175 }, { id: "f6", name: "Fer 6", manual: 160 },
    { id: "f7", name: "Fer 7", manual: 145 }, { id: "f8", name: "Fer 8", manual: 138 },
    { id: "f9", name: "Fer 9", manual: 128 }, { id: "pw", name: "PW", manual: 110 },
    { id: "w56", name: "56°", manual: 70 }, { id: "w60", name: "60°", manual: 43 },
    { id: "pt", name: "Putter", manual: null, putter: true }
  ];
  var clubs = load(K.clubs, null) || { list: clone(DEFAULT_CLUBS), shots: {} };
  function clubById(id) { return clubs.list.filter(function (c) { return c.id === id; })[0]; }
  function clubStats(id) {
    var s = (clubs.shots[id] || []).map(function (x) { return x.d; });
    if (!s.length) return { n: 0, avg: null };
    // moyenne sans les coups ratés extrêmes (on écarte le 1/5 le plus court au-delà de 5 coups)
    var sorted = s.slice().sort(function (a, b) { return a - b; });
    var cut = sorted.length >= 5 ? Math.floor(sorted.length / 5) : 0;
    var kept = sorted.slice(cut);
    return { n: s.length, avg: Math.round(avg(kept)), max: Math.round(sorted[sorted.length - 1]) };
  }
  function clubDistance(c) {
    var st = clubStats(c.id);
    if (st.n >= 3) return { d: st.avg, src: "auto", n: st.n };
    return { d: c.manual, src: "manual", n: st.n };
  }
  function suggestClub(dist) {
    if (dist == null || dist < 20) return null;
    var best = null;
    clubs.list.forEach(function (c) {
      if (c.putter) return;
      var d = clubDistance(c).d;
      if (!d) return;
      var diff = Math.abs(d - dist);
      if (!best || diff < best.diff) best = { c: c, d: d, diff: diff };
    });
    return best;
  }

  // =====================================================================
  // Navigation (avec le bouton retour d'Android)
  // =====================================================================
  var VIEWS = {};
  var current = { name: null, params: null };
  var leaveHook = null;
  function go(name, params, replace) {
    var st = { name: name, params: params || {} };
    if (replace) history_replace(st); else history_push(st);
    show(st);
  }
  function history_push(st) { try { window.history.pushState(st, ""); } catch (e) {} }
  function history_replace(st) { try { window.history.replaceState(st, ""); } catch (e) {} }
  function back() { window.history.length > 1 ? window.history.back() : go("home", {}, true); }
  window.addEventListener("popstate", function (e) {
    closeSheet();
    show(e.state && e.state.name ? e.state : { name: "home", params: {} });
  });
  function show(st) {
    if (leaveHook) { try { leaveHook(); } catch (e) {} leaveHook = null; }
    current = st;
    var fn = VIEWS[st.name] || VIEWS.home;
    fn(st.params || {});
    window.scrollTo(0, 0);
  }
  function page(html, cls) {
    app.innerHTML = '<section class="view ' + (cls || "") + '">' + html + "</section>";
    $$("[data-back]", app).forEach(function (b) { b.addEventListener("click", back); });
    $$("[data-go]", app).forEach(function (b) {
      b.addEventListener("click", function () { go(b.getAttribute("data-go"), JSON.parse(b.getAttribute("data-p") || "{}")); });
    });
    return app.firstChild;
  }
  function topbar(title, right) {
    return '<div class="topbar"><button class="icon-btn" data-back aria-label="Retour">' + ic("back") + "</button><h1>" + esc(title) + "</h1>" + (right || "") + "</div>";
  }
  function on(id, ev, fn) { var e = document.getElementById(id); if (e) e.addEventListener(ev, fn); return e; }

  // ---------- Feuille du bas ----------
  function openSheet(html, bind) {
    $("#sheetBody").innerHTML = html;
    $("#sheet").classList.add("on");
    $("#sheetBg").classList.add("on");
    if (bind) bind($("#sheetBody"));
  }
  function closeSheet() { $("#sheet").classList.remove("on"); $("#sheetBg").classList.remove("on"); }
  $("#sheetBg").addEventListener("click", closeSheet);
  function confirmSheet(title, text, okLabel, onOk, danger) {
    openSheet("<h3>" + esc(title) + "</h3><p>" + esc(text) + '</p><button class="btn ' + (danger ? "danger" : "") + '" id="shOk">' + esc(okLabel) +
      '</button><button class="btn ghost" id="shNo">Annuler</button>', function () {
      on("shOk", "click", function () { closeSheet(); onOk(); });
      on("shNo", "click", closeSheet);
    });
  }

  // =====================================================================
  // Géométrie
  // =====================================================================
  function distM(a, b) {
    var R = 6371000, t = Math.PI / 180;
    var dLat = (b[0] - a[0]) * t, dLon = (b[1] - a[1]) * t;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a[0] * t) * Math.cos(b[0] * t) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function toXY(o, p) { return [(p[1] - o[1]) * 111320 * Math.cos(o[0] * Math.PI / 180), (p[0] - o[0]) * 110540]; }
  function fromXY(o, xy) { return [o[0] + xy[1] / 110540, o[1] + xy[0] / (111320 * Math.cos(o[0] * Math.PI / 180))]; }
  function r6(p) { return [Math.round(p[0] * 1e6) / 1e6, Math.round(p[1] * 1e6) / 1e6]; }

  // =====================================================================
  // Position GPS (partagée par la météo et la carte)
  // =====================================================================
  var me = null, watchId = null, gpsListeners = [], gpsError = null;
  function startWatch() {
    if (watchId !== null || !("geolocation" in navigator)) return;
    watchId = navigator.geolocation.watchPosition(function (p) {
      me = { pos: [p.coords.latitude, p.coords.longitude], acc: p.coords.accuracy, t: Date.now() };
      gpsError = null;
      gpsListeners.forEach(function (f) { f(); });
    }, function (err) {
      gpsError = err.code === 1 ? "refus" : "introuvable";
      gpsListeners.forEach(function (f) { f(); });
    }, { enableHighAccuracy: true, maximumAge: 3000, timeout: 30000 });
  }
  function stopWatch() { if (watchId !== null) { navigator.geolocation.clearWatch(watchId); watchId = null; } }
  function oncePosition(cb) {
    if (me && Date.now() - me.t < 10 * 60000) { cb(me.pos); return; }
    if (!("geolocation" in navigator)) { cb(null, "indispo"); return; }
    navigator.geolocation.getCurrentPosition(function (p) {
      me = { pos: [p.coords.latitude, p.coords.longitude], acc: p.coords.accuracy, t: Date.now() };
      cb(me.pos);
    }, function (err) { cb(null, err.code === 1 ? "refus" : "introuvable"); }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 });
  }

  // =====================================================================
  // Premier lancement
  // =====================================================================
  VIEWS.welcome = function () {
    page('<div class="welcome"><div class="logo">' + ic("flag") + "</div><h1>Bienvenue dans ton carnet de golf</h1>" +
      "<p>Carte GPS des trous, parties, clubs, entraînement. Comment tu t'appelles ?</p>" +
      '<input class="input" id="wName" placeholder="Ton prénom" autocomplete="given-name" />' +
      '<button class="btn" id="wGo">C\'est parti</button></div>');
    on("wGo", "click", function () {
      var n = $("#wName").value.trim();
      if (!n) { $("#wName").focus(); return; }
      profile.name = n;
      persist("profile");
      go("home", {}, true);
    });
  };

  // =====================================================================
  // Accueil
  // =====================================================================
  function greeting() {
    var h = new Date().getHours();
    return h >= 18 || h < 5 ? "Bonsoir" : "Bonjour";
  }
  VIEWS.home = function () {
    if (!profile.name) { VIEWS.welcome(); return; }
    var today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    var rc = roundCourse();
    var resume = rc ? '<button class="resume-banner" data-go="play"><span class="dot"></span><span>Reprendre la partie<span class="s">' +
      esc(rc.short + (rc.optLabel ? " · " + rc.optLabel : "")) + " · trou " + (round.holeIndex + 1) + "/" + round.holes.length + "</span></span>" +
      '<span style="margin-left:auto">' + ic("next") + "</span></button>" : "";
    var nt = nextTaskAny();
    page('<div class="home-head"><div class="hello">' + greeting() + " " + esc(profile.name) + "<small>" + esc(today) + "</small></div>" +
      '<button class="icon-btn" data-go="settings" aria-label="Réglages">' + ic("gear") + "</button></div>" +
      '<div class="hero" id="wx"><div class="wx-empty">Météo en cours de chargement…</div></div>' + resume +
      '<div class="bento">' +
      '<button class="tile wide play" data-go="newround"><span class="ic">' + ic("flag") + '</span><span><span class="lb">Jouer une partie</span>' +
      '<span class="ds">Entraînement ou compétition, 9 ou 18 trous</span></span><span class="go">' + ic("next") + "</span></button>" +
      '<button class="tile" data-go="train"><span class="ic">' + ic("target") + '</span><span><span class="lb">Entraînement</span><span class="ds">' +
      esc(nt ? nt.sectorLabel + " · " + shorten(nt.task.text, 38) : "Secteurs et plans") + "</span></span></button>" +
      '<button class="tile" data-go="clubs"><span class="ic gold">' + ic("club") + '</span><span><span class="lb">Mes clubs</span><span class="ds">Distances de chaque club</span></span></button>' +
      '<button class="tile" data-go="carnet"><span class="ic gold">' + ic("book") + '</span><span><span class="lb">Carnet de parcours</span><span class="ds">' +
      COURSE_IDS.length + " parcours, notes par trou</span></span></button>" +
      '<button class="tile" data-go="stats"><span class="ic">' + ic("chart") + '</span><span><span class="lb">Statistiques</span><span class="ds">' +
      history.length + " partie" + (history.length > 1 ? "s" : "") + " enregistrée" + (history.length > 1 ? "s" : "") + "</span></span></button>" +
      "</div>");
    renderWeather();
  };
  function shorten(s, n) { s = String(s).replace(/\*\*/g, ""); return s.length > n ? s.slice(0, n - 1) + "…" : s; }

  // ---------- Météo (Open-Meteo, sans clé) ----------
  var WMO = function (code, isDay) {
    if (code === 0 || code === 1) return isDay === 0 ? "moon" : "sun";
    if (code === 2) return "partly";
    if (code === 3) return "cloud";
    if (code === 45 || code === 48) return "fog";
    if (code >= 51 && code <= 67) return "rain";
    if (code >= 71 && code <= 77) return "snow";
    if (code >= 80 && code <= 82) return "rain";
    if (code >= 85 && code <= 86) return "snow";
    if (code >= 95) return "storm";
    return "cloud";
  };
  var WMO_TXT = function (code) {
    if (code === 0) return "Ciel dégagé";
    if (code === 1) return "Plutôt dégagé";
    if (code === 2) return "Éclaircies";
    if (code === 3) return "Couvert";
    if (code === 45 || code === 48) return "Brouillard";
    if (code >= 51 && code <= 57) return "Bruine";
    if (code >= 61 && code <= 67) return "Pluie";
    if (code >= 71 && code <= 77) return "Neige";
    if (code >= 80 && code <= 82) return "Averses";
    if (code >= 95) return "Orage";
    return "Nuageux";
  };
  function windDir(deg) {
    var d = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
    return d[Math.round(((deg % 360) / 45)) % 8];
  }
  function renderWeather() {
    var box = $("#wx");
    if (!box) return;
    var cache = load(K.weather, null);
    if (cache && Date.now() - cache.t < 20 * 60000) { drawWeather(cache); return; }
    if (cache) drawWeather(cache);
    oncePosition(function (pos, err) {
      if (!pos) {
        if (!cache) {
          box.innerHTML = '<div class="wx-empty">' + (err === "refus" ? "Autorise la localisation pour voir la météo là où tu es." :
            "Position introuvable pour la météo.") + '<br><button id="wxRetry">Réessayer</button></div>';
          on("wxRetry", "click", function () { me = null; renderWeather(); });
        }
        return;
      }
      var url = "https://api.open-meteo.com/v1/forecast?latitude=" + pos[0].toFixed(3) + "&longitude=" + pos[1].toFixed(3) +
        "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,is_day" +
        "&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m,is_day&forecast_hours=9&timezone=auto&wind_speed_unit=kmh";
      var place = cache && cache.place && cache.pos && distM(cache.pos, pos) < 5000 ? Promise.resolve(cache.place) :
        fetch("https://nominatim.openstreetmap.org/reverse?format=json&zoom=10&accept-language=fr&lat=" + pos[0].toFixed(3) + "&lon=" + pos[1].toFixed(3))
          .then(function (r) { return r.json(); })
          .then(function (j) { var a = j.address || {}; return a.city || a.town || a.village || a.municipality || ""; })
          .catch(function () { return ""; });
      Promise.all([fetch(url).then(function (r) { return r.json(); }), place]).then(function (res) {
        var d = { t: Date.now(), pos: pos, place: res[1], data: res[0] };
        save(K.weather, d);
        drawWeather(d);
      }).catch(function () {
        if (!cache) box.innerHTML = '<div class="wx-empty">Météo indisponible (pas de réseau ?).</div>';
      });
    });
  }
  function drawWeather(w) {
    var box = $("#wx");
    if (!box || !w.data || !w.data.current) return;
    var c = w.data.current, h = w.data.hourly || {};
    var hours = "";
    var times = h.time || [];
    for (var k = 1; k < times.length && k <= 8; k++) {
      var pp = h.precipitation_probability ? h.precipitation_probability[k] : null;
      hours += '<div class="wx-h"><span class="h">' + times[k].slice(11, 13) + "h</span>" + ic(WMO(h.weather_code[k], h.is_day ? h.is_day[k] : 1)) +
        '<span class="num">' + Math.round(h.temperature_2m[k]) + '°</span><span class="p">' + (pp >= 20 ? pp + "%" : "") + "</span></div>";
    }
    box.innerHTML = '<div class="wx-now">' + ic(WMO(c.weather_code, c.is_day)) + '<div class="t num">' + Math.round(c.temperature_2m) + '°</div>' +
      '<div class="wx-meta"><b>' + WMO_TXT(c.weather_code) + "</b><br>" + (w.place ? esc(w.place) + " · " : "") + "ressenti " + Math.round(c.apparent_temperature) +
      "°<br>Vent " + Math.round(c.wind_speed_10m) + " km/h " + windDir(c.wind_direction_10m) + "</div></div>" +
      (hours ? '<div class="wx-hours">' + hours + "</div>" : "");
  }

  // =====================================================================
  // Réglages
  // =====================================================================
  VIEWS.settings = function () {
    page(topbar("Réglages") +
      '<div class="card"><div class="field"><label>Ton prénom</label><input class="input" id="sName" value="' + esc(profile.name) + '" /></div>' +
      '<div class="field" style="margin-bottom:0"><label>Apparence</label><div class="seg" id="sTheme">' +
      ["auto", "light", "dark"].map(function (t) {
        return '<button data-t="' + t + '" class="' + ((profile.theme || "auto") === t ? "on" : "") + '">' + { auto: "Auto", light: "Clair", dark: "Sombre" }[t] + "</button>";
      }).join("") + "</div></div></div>" +
      '<div class="card"><h2>Sauvegarde</h2><p class="muted small" style="margin:0 0 12px;line-height:1.45">Tes données restent dans ce téléphone. ' +
      "Exporte un fichier de temps en temps : tu pourras tout restaurer si tu changes de téléphone.</p>" +
      '<button class="btn ghost" id="sExport">' + ic("share") + "Exporter mes données</button>" +
      '<button class="btn ghost" id="sImport">' + ic("upload") + "Restaurer une sauvegarde</button>" +
      '<input type="file" id="sFile" accept="application/json,.json" hidden /></div>' +
      '<p class="muted small" style="text-align:center">Imagerie satellite © Esri · données de parcours © OpenStreetMap · météo Open-Meteo</p>');
    on("sName", "change", function () { var v = $("#sName").value.trim(); if (v) { profile.name = v; persist("profile"); toast("Prénom enregistré"); } });
    $$("#sTheme button").forEach(function (b) {
      b.addEventListener("click", function () {
        profile.theme = b.getAttribute("data-t"); persist("profile"); applyTheme();
        $$("#sTheme button").forEach(function (x) { x.classList.toggle("on", x === b); });
      });
    });
    on("sExport", "click", function () {
      var data = { app: "carnet-golf", version: 4, exportedAt: new Date().toISOString(), profile: profile, history: history, notes: notes,
        courses: userCourses, geo: geoOver, clubs: clubs, plans: plansState, round: round };
      shareFile("carnet-golf-" + new Date().toISOString().slice(0, 10) + ".json", data, "Sauvegarde du carnet de golf");
    });
    on("sImport", "click", function () { $("#sFile").click(); });
    on("sFile", "change", function (e) {
      readJsonFile(e.target, function (d) {
        if (d.app === "carnet-golf" && d.type === "course") { importCourseData(d); return; }
        if (d.app !== "carnet-golf" || !Array.isArray(d.history)) { toast("Ce fichier n'est pas une sauvegarde du carnet"); return; }
        confirmSheet("Restaurer cette sauvegarde ?", d.history.length + " parties. Tes données actuelles seront remplacées.", "Restaurer", function () {
          history = d.history; notes = d.notes || {}; userCourses = d.courses || {}; geoOver = d.geo || {};
          if (d.clubs && d.clubs.list) clubs = d.clubs;
          if (d.plans) plansState = d.plans;
          if (d.profile && d.profile.name) profile = d.profile;
          round = d.round && d.round.holes ? d.round : null;
          ["history", "notes", "courses", "geo", "clubs", "plans", "profile", "round"].forEach(persist);
          save(K.seeded, true);
          applyTheme();
          toast("Sauvegarde restaurée");
          go("home", {}, true);
        });
      });
    });
  };
  function shareFile(fname, data, title) {
    var blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    var file = null;
    try { file = new File([blob], fname, { type: "application/json" }); } catch (e) {}
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: title }).catch(function () {});
      return;
    }
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fname;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    toast("Fichier enregistré dans tes téléchargements");
  }
  function readJsonFile(input, cb) {
    var f = input.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      input.value = "";
      try { cb(JSON.parse(reader.result)); } catch (e) { toast("Fichier illisible"); }
    };
    reader.readAsText(f);
  }

  // =====================================================================
  // Entraînement : secteurs et plans
  // =====================================================================
  var SECTORS = [
    { id: "putting", label: "Putting", icon: "putt", desc: "Putts courts, longs, lecture", color: "#17834f",
      re: /putt/i },
    { id: "driver", label: "Driver", icon: "driver", desc: "Mises en jeu, bois 3", color: "#2f7fd1",
      re: /driver|drive\b|drives|bois 3|couloir de d[ée]part|d[ée]parts? de pr[ée]cision|mise en jeu/i },
    { id: "long", label: "Long jeu", icon: "irons", desc: "Fers, par 3 longs", color: "#7a5bd1",
      re: /\bfers?\b|par 3 longs?|grand jeu|carrys?/i },
    { id: "approche", label: "Approche", icon: "approach", desc: "Pitching, wedging, chip", color: "#c9952b",
      re: /wedge|approche|pitch|chip|petit jeu|\b56°|\b60°|80 et 105|80-105/i },
    { id: "bunker", label: "Bunker", icon: "bunker", desc: "Sorties de bunker", color: "#b8862e",
      re: /bunker/i },
    { id: "physique", label: "Physique", icon: "body", desc: "Mobilité, gainage", color: "#c4452f",
      re: /physique|mobilit[ée]|gainage|renforcement/i },
    { id: "situation", label: "Mise en situation", icon: "game", desc: "Parcours, up & down, jeux", color: "#0f6b6b",
      re: /parcours d'[ée]cole|9 trous|18 trous|partie|virtuel|up ?& ?down|tours?\b|stableford|simulation|jeux? de/i }
  ];
  function sectorById(id) { return SECTORS.filter(function (s) { return s.id === id; })[0]; }
  function sectorsOf(text) { return SECTORS.filter(function (s) { return s.re.test(text); }).map(function (s) { return s.id; }); }

  function allPlans() {
    var b = (window.BUILTIN_PLANS || []).filter(function (p) { return plansState.hidden.indexOf(p.id) < 0; });
    return b.concat(plansState.custom || []);
  }
  function planById(id) { return allPlans().filter(function (p) { return p.id === id; })[0]; }

  var MONTHS = { janv: 0, jan: 0, "févr": 1, fev: 1, "fév": 1, mars: 2, mar: 2, avr: 3, mai: 4, juin: 5, juil: 6, "août": 7, aout: 7, sept: 8, sep: 8, oct: 9, nov: 10, "déc": 11, dec: 11 };
  function parseDayMonth(s) {
    var m = String(s).toLowerCase().match(/(\d{1,2})\s*(janv?|f[ée]vr?|mars?|avr|mai|juin|juil|ao[uû]t|sept?|oct|nov|d[ée]c)/);
    if (!m) return null;
    var key = m[2].replace("û", "u");
    var mo = MONTHS[key];
    if (mo == null) mo = MONTHS[key.slice(0, 3)];
    if (mo == null) return null;
    return { d: +m[1], m: mo };
  }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }

  // Analyse d'un plan Markdown : tâches à cocher (avec semaine), lignes de tableau, exercices de référence
  var parsedCache = {};
  function parsePlan(plan) {
    var ck = plan.id + ":" + hash(plan.md);
    if (parsedCache[ck]) return parsedCache[ck];
    var lines = plan.md.split(/\r?\n/);
    var tasks = [], refs = [], rows = [], h2 = "", h3 = "", week = null, weeks = [];
    var year = new Date().getFullYear(), lastMonth = null, firstDone = false;
    var seen = {};
    var tableHead = null;
    lines.forEach(function (ln) {
      var t = ln.trim();
      var mh = t.match(/^(#{1,4})\s+(.*)$/);
      if (mh) {
        if (mh[1].length <= 2) { h2 = mh[2]; h3 = ""; } else h3 = mh[2];
        tableHead = null;
        return;
      }
      var mw = t.match(/^\*\*(S\d+[^*]*)\*\*\s*$/);
      if (mw) {
        var dm = parseDayMonth(mw[1]);
        var date = null;
        if (dm) {
          if (!firstDone) {
            var now = new Date();
            if (dm.m < now.getMonth() - 5) year = now.getFullYear() + 1;
            firstDone = true;
          } else if (lastMonth != null && dm.m < lastMonth) year++;
          lastMonth = dm.m;
          date = new Date(year, dm.m, dm.d);
        }
        week = { label: mw[1].replace(/\s+/g, " "), date: date, phase: h3 };
        weeks.push(week);
        return;
      }
      var mt = t.match(/^[-*]\s+\[( |x|X)\]\s+(.*)$/);
      if (mt) {
        var text = mt[2];
        var base = hash(text);
        seen[base] = (seen[base] || 0) + 1;
        tasks.push({ key: base + "-" + seen[base], text: text, week: week, section: h3 || h2, sectors: sectorsOf(text + " " + (week ? week.label : "")), doneInFile: mt[1] !== " " });
        return;
      }
      if (/^\|/.test(t)) {
        var cells = t.replace(/^\||\|$/g, "").split("|").map(function (c) { return c.trim(); });
        if (cells.every(function (c) { return /^:?-+:?$/.test(c); })) return;
        if (!tableHead) { tableHead = cells; return; }
        if (/jour/i.test(tableHead[0])) rows.push({ day: cells[0], text: cells.slice(1).join(" · "), sectors: sectorsOf(cells.slice(1).join(" ")) });
        return;
      }
      tableHead = null;
      var mb = t.match(/^[-*]\s+(.*)$/);
      if (mb && !/^\[/.test(mb[1])) {
        var ctx = (h3 || h2);
        var sec = sectorsOf(mb[1] + " " + ctx);
        if (/ressources|vid[ée]os|fiches|jalons|li[ée]es/i.test(h2) && !/exercices/i.test(h2)) sec = sectorsOf(ctx + " " + mb[1]);
        refs.push({ text: mb[1], ctx: ctx, h2: h2, sectors: sec });
      }
    });
    var res = { tasks: tasks, refs: refs, rows: rows, weeks: weeks };
    parsedCache[ck] = res;
    return res;
  }
  function isDone(planId, key) { return !!(plansState.checks[planId] && plansState.checks[planId][key]); }
  function setDone(planId, key, v) {
    plansState.checks[planId] = plansState.checks[planId] || {};
    if (v) plansState.checks[planId][key] = new Date().toISOString(); else delete plansState.checks[planId][key];
    persist("plans");
  }
  function weekStatus(w) {
    if (!w || !w.date) return null;
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var end = new Date(w.date); end.setDate(end.getDate() + 7);
    if (now < w.date) return "futur";
    if (now >= end) return "passe";
    return "en-cours";
  }
  // Prochaine tâche d'un secteur : d'abord les tâches en retard ou de la semaine, sinon la prochaine à venir
  function nextTasks(sectorId) {
    var out = [];
    allPlans().forEach(function (p) {
      parsePlan(p).tasks.forEach(function (t) {
        if (sectorId && t.sectors.indexOf(sectorId) < 0) return;
        if (t.doneInFile || isDone(p.id, t.key)) return;
        var st = weekStatus(t.week);
        out.push({ plan: p, task: t, st: st, order: st === "passe" ? 0 : st === "en-cours" ? 1 : st === "futur" ? 2 : 3, date: t.week && t.week.date ? +t.week.date : 0 });
      });
    });
    out.sort(function (a, b) { return a.order - b.order || a.date - b.date; });
    return out;
  }
  function nextTaskAny() {
    var n = nextTasks(null).filter(function (x) { return x.task.sectors.length; })[0];
    if (!n) return null;
    n.sectorLabel = sectorById(n.task.sectors[0]).label;
    return n;
  }

  function inline(md) {
    return esc(md)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  VIEWS.train = function () {
    var grid = SECTORS.map(function (s) {
      var n = nextTasks(s.id).length;
      return '<button class="sector" data-go="sector" data-p=\'{"id":"' + s.id + '"}\'><span class="ic" style="background:' + s.color + '22;color:' + s.color + '">' +
        ic(s.icon) + '</span><span><span class="lb">' + s.label + '</span><span class="ds">' + (n ? n + " exercice" + (n > 1 ? "s" : "") + " à faire" : s.desc) + "</span></span></button>";
    }).join("");
    var plans = allPlans().map(function (p) {
      var pp = parsePlan(p);
      var done = pp.tasks.filter(function (t) { return t.doneInFile || isDone(p.id, t.key); }).length;
      return '<button class="list-btn" data-go="plan" data-p=\'{"id":"' + esc(p.id) + '"}\'><span class="ic">' + ic("doc") + '</span><span><span class="t">' + esc(p.title) +
        '</span><span class="s">' + (pp.tasks.length ? done + "/" + pp.tasks.length + " séances faites" : "Document") + '</span></span><span class="go">' + ic("next") + "</span></button>";
    }).join("");
    page(topbar("Entraînement") + '<p class="lead">Choisis un secteur : l\'appli t\'affiche ton prochain exercice prévu dans ton plan.</p>' +
      '<div class="sector-grid">' + grid + '<button class="random" id="tRand"><span class="ic">' + ic("shuffle") +
      "</span><span>Secteur au hasard<small>Laisse l'appli choisir ta séance du jour</small></span></button></div>" +
      '<h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:24px 4px 12px">Mes plans</h2>' +
      (plans || "<div class=\"card\"><div class=\"empty\">Aucun plan pour l'instant. Importe ton plan d'entraînement : il restera uniquement dans ce téléphone.</div></div>") +
      '<div class="row" style="margin-top:4px"><button class="btn ghost" id="tImport">' + ic("upload") + 'Importer</button><button class="btn ghost" id="tAdd">' + ic("plus") + "Ajouter un exercice</button></div>" +
      '<input type="file" id="tFile" accept=".md,.txt,text/markdown,text/plain" hidden />' +
      '<p class="muted small" style="margin:12px 4px 0;line-height:1.45">Import : un fichier texte ou Markdown (.md), avec des titres « ## » et des exercices sous la forme « - [ ] texte ». Les semaines s\'écrivent « **S1 · 23 nov — Thème** ».</p>');
    on("tRand", "click", function () {
      var withTasks = SECTORS.filter(function (s) { return nextTasks(s.id).length; });
      var pool = withTasks.length ? withTasks : SECTORS;
      var s = pool[Math.floor(Math.random() * pool.length)];
      toast("Aujourd'hui : " + s.label);
      go("sector", { id: s.id });
    });
    on("tImport", "click", function () {
      openSheet("<h3>Importer un plan</h3><p>Ton plan reste uniquement dans ce téléphone.</p>" +
        '<button class="btn ghost" id="imFile">' + ic("upload") + "Choisir un fichier .md</button>" +
        '<div class="field" style="margin-top:14px"><label>Ou colle le texte du plan</label><textarea class="input" id="imText" style="min-height:30vh;font-size:13px" placeholder="# Mon plan&#10;- [ ] 20 putts de 1,5 m"></textarea></div>' +
        '<button class="btn" id="imOk">Importer le texte</button>', function () {
        on("imFile", "click", function () { closeSheet(); $("#tFile").click(); });
        on("imOk", "click", function () {
          var md = $("#imText").value;
          if (!md.trim()) return;
          closeSheet();
          addPlan(md, "Mon plan");
        });
      });
    });
    on("tFile", "change", function (e) {
      var f = e.target.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        addPlan(String(reader.result), f.name.replace(/\.(md|txt)$/i, ""));
      };
      reader.readAsText(f);
    });
    on("tAdd", "click", function () { addExerciseSheet(); });
  };

  function addPlan(md, fallback) {
    md = md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1");
    var title = ((md.match(/^#\s+(.+)$/m) || [])[1] || fallback).trim();
    var id = "p_" + Date.now().toString(36);
    plansState.custom.push({ id: id, title: title, md: md });
    persist("plans");
    toast("Plan importé");
    go("plan", { id: id });
  }
  function myPlan() {
    var p = plansState.custom.filter(function (x) { return x.id === "mine"; })[0];
    if (!p) { p = { id: "mine", title: "Mes exercices", md: "# Mes exercices\n" }; plansState.custom.unshift(p); }
    return p;
  }
  function addExerciseSheet(presetSector) {
    var sel = presetSector || "putting";
    openSheet("<h3>Ajouter un exercice</h3><p>Il rejoint ton plan « Mes exercices » et apparaîtra dans le secteur choisi.</p>" +
      '<div class="field"><label>Secteur</label><div class="chips" id="axS"></div></div>' +
      '<div class="field"><label>Exercice</label><textarea class="input" id="axT" placeholder="Ex. 20 putts de 1,5 m, viser 18/20"></textarea></div>' +
      '<button class="btn" id="axOk">Ajouter</button>', function () {
      function chips() {
        $("#axS").innerHTML = SECTORS.map(function (s) { return '<button class="chip ' + (s.id === sel ? "on" : "") + '" data-s="' + s.id + '">' + s.label + "</button>"; }).join("");
        $$("#axS .chip").forEach(function (b) { b.addEventListener("click", function () { sel = b.getAttribute("data-s"); chips(); }); });
      }
      chips();
      on("axOk", "click", function () {
        var t = $("#axT").value.trim().replace(/\n+/g, " ");
        if (!t) return;
        var s = sectorById(sel);
        var p = myPlan();
        var head = "## " + s.label;
        if (p.md.indexOf(head + "\n") < 0) p.md = p.md.replace(/\s*$/, "\n\n" + head + "\n");
        var idx = p.md.indexOf(head + "\n") + head.length + 1;
        // on ajoute le mot-clé du secteur pour qu'il soit bien classé
        var line = "- [ ] " + t + (s.re.test(t) ? "" : " (" + s.label.toLowerCase() + ")") + "\n";
        p.md = p.md.slice(0, idx) + line + p.md.slice(idx);
        persist("plans");
        closeSheet();
        toast("Exercice ajouté");
        show(current);
      });
    });
  }

  VIEWS.sector = function (prm) {
    var s = sectorById(prm.id) || SECTORS[0];
    var list = nextTasks(s.id);
    var first = list[0];
    var html = topbar(s.label);
    if (first) {
      var wk = first.task.week ? first.task.week.label : first.task.section;
      var badge = first.st === "passe" ? '<span class="pill red">En retard</span>' : first.st === "en-cours" ? '<span class="pill gold">Cette semaine</span>' : first.st === "futur" ? '<span class="pill">À venir</span>' : "";
      html += '<div class="next-card"><div class="k">Prochain entraînement ' + esc(s.label.toLowerCase()) + "</div>" +
        '<div class="tx">' + inline(first.task.text) + '</div><div class="wk">' + esc(wk || "") + " · " + esc(first.plan.title) + "</div>" +
        (badge ? '<div style="margin-top:10px">' + badge.replace('class="pill', 'style="background:rgba(255,255,255,.18);color:#fff" class="pill') + "</div>" : "") +
        '<button class="btn" id="sDone">' + ic("check") + "C'est fait</button></div>";
    } else {
      html += '<div class="card"><div class="empty">Aucun exercice « ' + esc(s.label) + " » en attente dans tes plans.<br>Ajoute-en un, ou pioche dans les exercices de référence ci-dessous.</div></div>";
    }
    if (list.length > 1) {
      html += '<div class="card"><h2>Ensuite</h2>' + list.slice(1, 6).map(function (x) {
        return '<label class="task"><input type="checkbox" class="check" data-plan="' + esc(x.plan.id) + '" data-key="' + x.task.key + '" /><span><span class="tx">' +
          inline(x.task.text) + '</span><span class="wk" style="display:block">' + esc(x.task.week ? x.task.week.label : x.task.section) + "</span></span></label>";
      }).join("") + "</div>";
    }
    // Jour prévu dans la semaine type
    var rows = [];
    allPlans().forEach(function (p) { parsePlan(p).rows.forEach(function (r) { if (r.sectors.indexOf(s.id) >= 0) rows.push(r); }); });
    if (rows.length) {
      html += '<div class="card"><h2>Dans ta semaine type</h2>' + rows.map(function (r) {
        return '<div class="ref"><strong>' + esc(r.day) + "</strong> · " + inline(r.text) + "</div>";
      }).join("") + "</div>";
    }
    var refs = [];
    allPlans().forEach(function (p) { parsePlan(p).refs.forEach(function (r) { if (r.sectors.indexOf(s.id) >= 0) refs.push(r); }); });
    if (refs.length) {
      html += '<div class="card"><h2>Exercices et ressources</h2>' + refs.slice(0, 14).map(function (r) { return '<div class="ref">' + inline(r.text) + "</div>"; }).join("") + "</div>";
    }
    html += '<button class="btn ghost" id="sAdd">' + ic("plus") + "Ajouter un exercice " + esc(s.label.toLowerCase()) + "</button>";
    page(html);
    on("sDone", "click", function () { setDone(first.plan.id, first.task.key, true); toast("Bravo, c'est noté"); show(current); });
    $$("input.check[data-key]").forEach(function (cb) {
      cb.addEventListener("change", function () { setDone(cb.getAttribute("data-plan"), cb.getAttribute("data-key"), cb.checked); setTimeout(function () { show(current); }, 300); });
    });
    on("sAdd", "click", function () { addExerciseSheet(s.id); });
  };

  // Affichage d'un plan comme un document
  VIEWS.plan = function (prm) {
    var p = planById(prm.id);
    if (!p) { go("train", {}, true); return; }
    var pp = parsePlan(p);
    var taskIdx = 0;
    var out = [], inList = false, inTable = false, tableHead = true;
    function closeList() { if (inList) { out.push("</ul>"); inList = false; } }
    function closeTable() { if (inTable) { out.push("</table>"); inTable = false; tableHead = true; } }
    var weekIdx = 0;
    p.md.split(/\r?\n/).forEach(function (ln) {
      var t = ln.trim();
      if (!t) { closeList(); closeTable(); return; }
      var mh = t.match(/^(#{1,4})\s+(.*)$/);
      if (mh) { closeList(); closeTable(); var lv = Math.min(3, mh[1].length); out.push("<h" + lv + ">" + inline(mh[2]) + "</h" + lv + ">"); return; }
      var mw = t.match(/^\*\*(S\d+[^*]*)\*\*\s*$/);
      if (mw) {
        closeList(); closeTable();
        var w = pp.weeks[weekIdx++];
        out.push('<div class="week ' + (weekStatus(w) === "en-cours" ? "now" : "") + '" ' + (weekStatus(w) === "en-cours" ? 'id="nowWeek"' : "") + ">" +
          esc(mw[1]) + (weekStatus(w) === "en-cours" ? " · cette semaine" : "") + "</div>");
        return;
      }
      var mt = t.match(/^[-*]\s+\[( |x|X)\]\s+(.*)$/);
      if (mt) {
        closeList(); closeTable();
        var task = pp.tasks[taskIdx++];
        var done = mt[1] !== " " || isDone(p.id, task.key);
        out.push('<label class="task ' + (done ? "done" : "") + '"><input type="checkbox" class="check" data-key="' + task.key + '" ' + (done ? "checked" : "") +
          (mt[1] !== " " ? " disabled" : "") + ' /><span class="tx">' + inline(mt[2]) + "</span></label>");
        return;
      }
      if (/^\|/.test(t)) {
        closeList();
        var cells = t.replace(/^\||\|$/g, "").split("|").map(function (c) { return c.trim(); });
        if (cells.every(function (c) { return /^:?-+:?$/.test(c); })) return;
        if (!inTable) { out.push("<table>"); inTable = true; tableHead = true; }
        var tag = tableHead ? "th" : "td";
        out.push("<tr>" + cells.map(function (c) { return "<" + tag + ">" + inline(c) + "</" + tag + ">"; }).join("") + "</tr>");
        tableHead = false;
        return;
      }
      closeTable();
      var mb = t.match(/^[-*]\s+(.*)$/);
      if (mb) { if (!inList) { out.push("<ul>"); inList = true; } out.push("<li>" + inline(mb[1]) + "</li>"); return; }
      closeList();
      out.push("<p>" + inline(t) + "</p>");
    });
    closeList(); closeTable();
    var isCustom = (plansState.custom || []).some(function (x) { return x.id === p.id; });
    page(topbar("Plan", '<button class="icon-btn" id="pMenu" aria-label="Options">' + ic("list") + "</button>") +
      '<div class="card doc">' + out.join("\n") + "</div>");
    $$(".doc input.check").forEach(function (cb) {
      cb.addEventListener("change", function () { setDone(p.id, cb.getAttribute("data-key"), cb.checked); cb.closest(".task").classList.toggle("done", cb.checked); });
    });
    var nw = $("#nowWeek");
    if (nw) setTimeout(function () { nw.scrollIntoView({ block: "center" }); }, 150);
    on("pMenu", "click", function () {
      openSheet("<h3>" + esc(p.title) + '</h3><p>Plan au format Markdown.</p><button class="btn ghost" id="pmEdit">' + ic("edit") + "Modifier le texte</button>" +
        '<button class="btn ghost" id="pmShare">' + ic("share") + "Partager</button>" +
        '<button class="btn danger" id="pmDel">' + ic("trash") + (isCustom ? "Supprimer ce plan" : "Masquer ce plan") + "</button>", function () {
        on("pmEdit", "click", function () {
          openSheet('<h3>Modifier le plan</h3><textarea class="input" id="pmText" style="min-height:55vh;font-size:13px">' + esc(p.md) + "</textarea>" +
            '<button class="btn" id="pmSave" style="margin-top:10px">Enregistrer</button>', function () {
            on("pmSave", "click", function () {
              var md = $("#pmText").value;
              if (isCustom) { p.md = md; }
              else {
                plansState.hidden.push(p.id);
                plansState.custom.push({ id: p.id + "_m", title: p.title, md: md });
                if (plansState.checks[p.id]) plansState.checks[p.id + "_m"] = plansState.checks[p.id];
              }
              persist("plans"); closeSheet(); toast("Plan enregistré");
              go("plan", { id: isCustom ? p.id : p.id + "_m" }, true);
            });
          });
        });
        on("pmShare", "click", function () {
          closeSheet();
          var blob = new Blob([p.md], { type: "text/markdown" });
          var file = null;
          try { file = new File([blob], p.title.replace(/[^\w\- ]+/g, "").trim() + ".md", { type: "text/markdown" }); } catch (e) {}
          if (file && navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], title: p.title }).catch(function () {});
          else { var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "plan.md"; a.click(); }
        });
        on("pmDel", "click", function () {
          confirmSheet(isCustom ? "Supprimer ce plan ?" : "Masquer ce plan ?", isCustom ? "Il disparaîtra de l'appli." : "Tu pourras le réafficher en réinstallant les plans d'origine.", isCustom ? "Supprimer" : "Masquer", function () {
            if (isCustom) plansState.custom = plansState.custom.filter(function (x) { return x.id !== p.id; });
            else plansState.hidden.push(p.id);
            persist("plans");
            go("train", {}, true);
          }, true);
        });
      });
    });
  };

  // =====================================================================
  // Nouvelle partie
  // =====================================================================
  var setup = null;
  function defaultSetup() {
    var last = history.length ? history[history.length - 1] : null;
    var cid = last && last.courseId && COURSES[last.courseId] ? last.courseId : COURSE_IDS[0];
    return { type: "entrainement", format: "stableford", n: 18, cid: cid, opt: null, tee: null, hcp: null, hcpTouched: false };
  }
  function normalizeSetup() {
    var c = COURSES[setup.cid];
    if (!c) { setup.cid = COURSE_IDS[0]; c = COURSES[setup.cid]; }
    if (!setup.tee || !c.tees.some(function (t) { return t.id === setup.tee; })) setup.tee = c.tees[0].id;
    if (c.loops) {
      if (!setup.opt || !setup.opt.loops) setup.opt = { loops: c.defaultLoops.slice() };
      if (setup.n === 9) setup.opt.loops = setup.opt.loops.slice(0, 1);
      else if (setup.opt.loops.length < 2) {
        var other = Object.keys(c.loops).filter(function (l) { return l !== setup.opt.loops[0]; })[0];
        setup.opt.loops = [setup.opt.loops[0], other];
      }
    } else {
      var n = c.holes.length;
      if (n === 18) { if (!setup.opt || ["all", "out", "in"].indexOf(setup.opt.part) < 0 || (setup.n === 18) !== (setup.opt.part === "all")) setup.opt = { part: setup.n === 18 ? "all" : "out" }; }
      else setup.opt = { part: setup.n === 18 ? "twice" : "all" };
    }
    if (!setup.hcpTouched) {
      var h = teeOf(c, setup.tee).hcp;
      setup.hcp = setup.n === 9 ? Math.round(h / 2) : h;
    }
  }
  VIEWS.newround = function () {
    if (!setup) setup = defaultSetup();
    normalizeSetup();
    var c = COURSES[setup.cid];
    function seg(id, items, val) {
      return '<div class="seg" id="' + id + '">' + items.map(function (it) {
        return '<button data-v="' + it.v + '" class="' + (String(it.v) === String(val) ? "on" : "") + '">' + it.l + "</button>";
      }).join("") + "</div>";
    }
    var courses = COURSE_IDS.map(function (id) {
      var cc = COURSES[id];
      var placed = allKeys(id).filter(function (k) { return holeGeo(id, k).c; }).length;
      var info = (cc.loops ? "3 boucles de 9 trous" : cc.holes.length + " trous") + (placed ? " · carte GPS" : "");
      return '<button class="list-btn ' + (id === setup.cid ? "on" : "") + '" data-c="' + esc(id) + '"><span class="ic">' + ic("flag") + '</span><span><span class="t">' + esc(cc.short) +
        '</span><span class="s">' + esc(info) + "</span></span>" + (id === setup.cid ? '<span class="go" style="color:var(--primary)">' + ic("check") + "</span>" : "") + "</button>";
    }).join("");
    var opts = "";
    if (c.loops) {
      var ids = Object.keys(c.loops);
      opts += '<div class="field"><label>' + (setup.n === 9 ? "Boucle" : "Aller") + '</label><div class="chips" id="nLoop0">' + ids.map(function (l) {
        return '<button class="chip ' + (setup.opt.loops[0] === l ? "on" : "") + '" data-v="' + l + '">' + esc(c.loops[l].name) + "</button>";
      }).join("") + "</div></div>";
      if (setup.n === 18) opts += '<div class="field"><label>Retour</label><div class="chips" id="nLoop1">' + ids.filter(function (l) { return l !== setup.opt.loops[0]; }).map(function (l) {
        return '<button class="chip ' + (setup.opt.loops[1] === l ? "on" : "") + '" data-v="' + l + '">' + esc(c.loops[l].name) + "</button>";
      }).join("") + "</div></div>";
    } else if (c.holes.length === 18 && setup.n === 9) {
      opts += '<div class="field"><label>Quels 9 trous ?</label>' + seg("nPart", [{ v: "out", l: "Aller (1-9)" }, { v: "in", l: "Retour (10-18)" }], setup.opt.part) + "</div>";
    }
    if (c.tees.length > 1) opts += '<div class="field"><label>Départs</label><div class="chips" id="nTee">' + c.tees.map(function (t) {
      return '<button class="chip ' + (t.id === setup.tee ? "on" : "") + '" data-v="' + t.id + '">' + esc(t.label) + "</button>";
    }).join("") + "</div></div>";
    page(topbar("Nouvelle partie") +
      '<div class="card"><div class="field"><label>Type de partie</label>' + seg("nType", [{ v: "entrainement", l: "Entraînement" }, { v: "competition", l: "Compétition" }], setup.type) + "</div>" +
      '<div class="field"><label>Formule</label>' + seg("nFormat", [{ v: "stroke", l: "Stroke play" }, { v: "stableford", l: "Stableford" }], setup.format) + "</div>" +
      '<div class="field" style="margin-bottom:0"><label>Nombre de trous</label>' + seg("nHoles", [{ v: 9, l: "9 trous" }, { v: 18, l: "18 trous" }], setup.n) + "</div></div>" +
      '<h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:20px 4px 12px">Parcours</h2>' + courses +
      '<button class="btn line" data-go="carnet" style="margin-bottom:14px">' + ic("plus") + "Ajouter un parcours</button>" +
      '<div class="card">' + opts + '<div class="line-row" style="padding-top:0"><div><div class="t">Handicap de jeu</div><div class="s">' + esc(c.hcpNote || "Calculé avec ton index et la carte du golf") +
      '</div></div><div class="stepper"><button id="hM">−</button><span class="v num" id="hV">' + setup.hcp + '</span><button id="hP">+</button></div></div></div>' +
      '<button class="btn gold" id="nStart">' + ic("flag") + "Démarrer la partie</button>");
    function bindSeg(id, key, num) {
      $$("#" + id + " button").forEach(function (b) {
        b.addEventListener("click", function () {
          var v = b.getAttribute("data-v");
          setup[key] = num ? +v : v;
          if (key === "n") setup.hcpTouched = false;
          show(current);
        });
      });
    }
    bindSeg("nType", "type"); bindSeg("nFormat", "format"); bindSeg("nHoles", "n", true);
    $$("[data-c]").forEach(function (b) {
      b.addEventListener("click", function () { setup.cid = b.getAttribute("data-c"); setup.opt = null; setup.tee = null; setup.hcpTouched = false; show(current); });
    });
    $$("#nLoop0 .chip").forEach(function (b) {
      b.addEventListener("click", function () {
        var v = b.getAttribute("data-v");
        if (setup.opt.loops[1] === v) setup.opt.loops[1] = setup.opt.loops[0];
        setup.opt.loops[0] = v; show(current);
      });
    });
    $$("#nLoop1 .chip").forEach(function (b) { b.addEventListener("click", function () { setup.opt.loops[1] = b.getAttribute("data-v"); show(current); }); });
    $$("#nPart button").forEach(function (b) { b.addEventListener("click", function () { setup.opt.part = b.getAttribute("data-v"); show(current); }); });
    $$("#nTee .chip").forEach(function (b) { b.addEventListener("click", function () { setup.tee = b.getAttribute("data-v"); setup.hcpTouched = false; show(current); }); });
    on("hM", "click", function () { setup.hcp = Math.max(0, setup.hcp - 1); setup.hcpTouched = true; $("#hV").textContent = setup.hcp; });
    on("hP", "click", function () { setup.hcp = Math.min(54, setup.hcp + 1); setup.hcpTouched = true; $("#hV").textContent = setup.hcp; });
    on("nStart", "click", function () {
      var startIt = function () {
        var rc = resolveCourse(setup.cid, setup.opt);
        round = {
          date: new Date().toISOString(), holeIndex: 0, type: setup.type, format: setup.format,
          course: { id: setup.cid, tee: setup.tee, hcp: setup.hcp, opt: clone(setup.opt) },
          holes: rc.holes.map(function (h) { return { par: h.p, score: h.p, fairway: h.p === 3 ? "na" : null, gir: null, putts: 2, upDown: null }; }),
          shots: []
        };
        persist("round");
        go("play", { tab: "map" }, true);
      };
      if (round) confirmSheet("Remplacer la partie en cours ?", "Elle n'a pas été enregistrée.", "Démarrer quand même", startIt, true);
      else startIt();
    });
  };

  // =====================================================================
  // Partie en cours
  // =====================================================================
  var map = null, layers = null, target = null, editMode = false, editPoint = "tee", lastFitKey = "", wakeLock = null, isFull = false;
  var POINTS = [
    { k: "tee", label: "Départ", color: "#f4f1e4", text: "#1c2318", short: "D" },
    { k: "f", label: "Avant green", color: "#35b872", text: "#fff", short: "A" },
    { k: "c", label: "Centre green", color: "#d0452e", text: "#fff", short: "C" },
    { k: "b", label: "Fond green", color: "#1f5d8c", text: "#fff", short: "F" }
  ];

  function strokesFor(si, hcp, n) {
    n = n || 18;
    if (!si) return Math.floor(hcp / n);
    return Math.floor(hcp / n) + (si <= hcp % n ? 1 : 0);
  }
  function holePoints(idx) {
    var c = roundCourse();
    if (!c) return null;
    var h = round.holes[idx];
    return Math.max(0, h.par + strokesFor(c.holes[idx].i, round.course.hcp, round.holes.length) + 2 - h.score);
  }
  function totals(r) {
    var o = { score: 0, par: 0, fwHit: 0, fwCount: 0, girHit: 0, girCount: 0, putts: 0, udHit: 0, udCount: 0, pen: 0 };
    r.holes.forEach(function (h) {
      o.score += h.score; o.par += h.par; o.putts += h.putts; o.pen += h.pen || 0;
      if (h.fairway === "oui" || h.fairway === "non") { o.fwCount++; if (h.fairway === "oui") o.fwHit++; }
      if (h.gir === "oui" || h.gir === "non") { o.girCount++; if (h.gir === "oui") o.girHit++; }
      if (h.upDown === "oui" || h.upDown === "non") { o.udCount++; if (h.upDown === "oui") o.udHit++; }
    });
    return o;
  }
  function totalPoints(all) { var s = 0, n = all ? round.holes.length : round.holeIndex + 1; for (var k = 0; k < n; k++) s += holePoints(k); return s; }
  function playedTotals() {
    // score « vs par » sur les trous déjà joués (jusqu'au trou en cours inclus)
    var s = 0, p = 0;
    for (var k = 0; k <= round.holeIndex; k++) { s += round.holes[k].score; p += round.holes[k].par; }
    return { s: s, p: p };
  }

  VIEWS.play = function (prm) {
    if (!round || !roundCourse()) { go("newround", {}, true); return; }
    var tab = prm.tab || "map";
    page('<div class="play-head"><button class="icon-btn" id="pHome" aria-label="Accueil">' + ic("back") + '</button><div class="hole-badge num" id="pNum"></div>' +
      '<div class="play-info"><div class="a" id="pA"></div><div class="b" id="pB"></div></div></div>' +
      '<div class="play-tabs" id="pTabs"><button data-t="map">' + ic("map") + '<span>GPS</span></button><button data-t="score">' + ic("edit") + '<span>Score du trou</span></button><button data-t="card">' + ic("list") + "<span>Carte de score</span></button></div>" +
      '<div id="pBody"></div>' +
      '<div class="play-bar"><div class="inner"><button id="pPrev">' + ic("back") + 'Trou</button><button class="main" id="pNext">Trou suivant' + ic("next") + "</button></div></div>", "has-bar");
    $$("#pTabs button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-t") === tab);
      b.addEventListener("click", function () { go("play", { tab: b.getAttribute("data-t") }, true); });
    });
    on("pHome", "click", function () { go("home", {}, false); });
    on("pPrev", "click", function () { moveHole(-1); });
    on("pNext", "click", nextHole);
    renderPlayHead();
    // GPS actif sur tout l'écran de jeu : distance marchée, arrivée sur le green
    startWatch();
    gpsListeners = [function () {
      trackWalk();
      checkGreen();
      if ((current.params.tab || "map") === "map") renderMapContent(false);
    }];
    if ("wakeLock" in navigator) navigator.wakeLock.request("screen").then(function (w) { wakeLock = w; }).catch(function () {});
    if (tab === "map") renderMapTab();
    else if (tab === "score") renderScoreTab();
    else renderCardTab();
    leaveHook = function () {
      stopWatch();
      stopCompass();
      setFull(false, true);
      gpsListeners = [];
      if (wakeLock) { try { wakeLock.release(); } catch (e) {} wakeLock = null; }
      if (map) { map.remove(); map = null; }
    };
  };
  function nextHole() {
    if (!curHole().done) { openValidation(); return; }
    afterHole();
  }
  function afterHole() {
    var idx = round.holeIndex, n = round.holes.length;
    if (idx >= n - 1) { finishSheet(); return; }
    if (n === 18 && idx === 8 && !round.midShown) {
      round.midShown = true;
      moveHole(1);
      midRecap();
      return;
    }
    moveHole(1);
  }
  function moveHole(d) {
    var n = round.holeIndex + d;
    if (n < 0 || n >= round.holes.length) return;
    closeOpenShot("keep");
    round.holeIndex = n;
    target = null;
    persist("round");
    renderPlayHead();
    var tab = current.params.tab || "map";
    if (tab === "map") renderMapContent(true);
    else if (tab === "score") renderScoreTab();
    else renderCardTab();
    window.scrollTo(0, 0);
  }
  function renderPlayHead() {
    var c = roundCourse();
    var hd = c.holes[round.holeIndex];
    var h = curHole();
    $("#pNum").textContent = round.holeIndex + 1;
    var len = hd[round.course.tee];
    $("#pA").textContent = "Par " + h.par + (hd.i ? " · index " + hd.i : "") + (len ? " · " + len + " m" : "");
    var pt = playedTotals();
    var extra = round.format === "stableford" ? totalPoints() + " pts" : signed(pt.s - pt.p);
    $("#pB").textContent = c.short + (hd.loopName ? " · " + hd.loopName : "") + " · " + extra;
    $("#pPrev").disabled = round.holeIndex === 0;
    $("#pNext").innerHTML = !h.done ? ic("edit") + "Valider le trou" : round.holeIndex >= round.holes.length - 1 ? ic("check") + "Terminer" : "Trou suivant" + ic("next");
  }

  // ---------- Distance marchée, chrono, arrivée sur le green ----------
  function trackWalk() {
    if (!round || !me || !round.t0 || me.acc > 25) return;
    var p = me.pos, lp = round.wk;
    if (!lp) { round.wk = { p: r6(p), t: me.t }; persist("round"); return; }
    var d = distM(lp.p, p);
    if (d < 10) return;
    var dt = Math.max(1, (me.t - lp.t) / 1000);
    if (d / dt <= 3.5 && d < 1500) round.walk = (round.walk || 0) + d;
    round.wk = { p: r6(p), t: me.t };
    persist("round");
  }
  function onGreen(g) {
    if (!me || !g.c || me.acc > 25) return false;
    var r = g.f && g.b ? Math.max(12, distM(g.f, g.b) / 2 + 5) : 16;
    if (g.est) r += 6;
    return distM(me.pos, g.c) <= r;
  }
  var greenSeen = {};
  function checkGreen() {
    if (!round) return;
    var idx = round.holeIndex, h = curHole();
    var on_ = onGreen(holeGeo(round.course.id, curKey()));
    if (!on_ || h.done || greenSeen[round.date + ":" + idx]) return;
    greenSeen[round.date + ":" + idx] = true;
    var s = closeOpenShot(true);
    if (navigator.vibrate) navigator.vibrate([120, 80, 120]);
    toast(s && s.d ? "Sur le green · " + (clubById(s.club) || {}).name + " : " + s.d + " m" : "Sur le green : touche le crayon pour valider le trou");
  }
  function holeShots(idx) { return (round.shots || []).filter(function (s) { return s.hole === idx; }); }
  function fmtDur(ms) {
    var m = Math.max(0, Math.round(ms / 60000)), h = Math.floor(m / 60);
    return h ? h + " h " + ("0" + (m % 60)).slice(-2) : m + " min";
  }

  // ---------- Validation du trou (façon montre) ----------
  function openValidation() {
    var idx = round.holeIndex, h = curHole();
    var shots = holeShots(idx).length;
    var v = {
      score: h.done ? h.score : (shots ? shots + 2 : h.score),
      putts: h.done ? h.putts : null,
      pen: h.done ? (h.pen || 0) : 0,
      fw: h.fwDir || (h.fairway === "oui" ? "hit" : null)
    };
    var steps = ["score", "putts", "pen"];
    if (h.par > 3) steps.push("fw");
    var k = 0;
    function defPutts() {
      if (v.putts != null) return;
      v.putts = shots ? Math.max(0, v.score - shots) : Math.min(2, Math.max(0, v.score - 1));
      v.putts = Math.min(v.putts, v.score);
    }
    function scoreName(d) { return d <= -3 ? "Albatros" : d === -2 ? "Eagle" : d === -1 ? "Birdie" : d === 0 ? "Par" : d === 1 ? "Bogey" : d === 2 ? "Double bogey" : "+" + d; }
    function render() {
      var st = steps[k], body, lbl = "", q;
      if (st === "score") { q = "Combien de coups sur ce trou ?"; lbl = scoreName(v.score - h.par); body = v.score; }
      if (st === "putts") { defPutts(); q = "Combien de putts ?"; lbl = (v.score - v.putts) + " coup" + (v.score - v.putts > 1 ? "s" : "") + " pour toucher le green"; body = v.putts; }
      if (st === "fw") q = "Fairway au départ ?";
      if (st === "pen") { q = "Des pénalités ?"; lbl = v.pen ? "Comptées dans ton score de " + v.score : "Aucune pénalité"; body = v.pen; }
      var dots = '<div class="wz-dots">' + steps.map(function (s, i) { return '<span class="' + (i <= k ? "on" : "") + '"></span>'; }).join("") + "</div>";
      var head = "<h3>Trou " + (idx + 1) + " · par " + h.par + "</h3>" + dots + '<p class="wz-q">' + q + "</p>";
      var html;
      if (st === "fw") {
        html = head + '<div class="fw-pick">' +
          '<button data-v="left" class="' + (v.fw === "left" ? "on" : "") + '"><span class="ar">←</span>Gauche</button>' +
          '<button data-v="hit" class="hit ' + (v.fw === "hit" ? "on" : "") + '"><span class="ar">' + ic("check") + "</span>Touché</button>" +
          '<button data-v="right" class="' + (v.fw === "right" ? "on" : "") + '"><span class="ar">→</span>Droite</button></div>' +
          '<div class="row" style="margin-top:14px"><button class="btn ghost" id="wzBack">Retour</button><button class="btn ghost" id="wzSkip">Je ne sais plus</button></div>';
      } else {
        var last = k === steps.length - 1;
        html = head + '<div class="score-big"><button id="wzM">−</button><span class="v num">' + body + '</span><button id="wzP">+</button></div>' +
          '<div class="score-lbl">' + esc(lbl) + "</div>" +
          (st === "score" && shots ? '<p class="muted small wz-hint">' + shots + " coup" + (shots > 1 ? "s" : "") + " enregistré" + (shots > 1 ? "s" : "") + " + 2 putts</p>" : "") +
          '<div class="row" style="margin-top:14px">' + (k ? '<button class="btn ghost" id="wzBack">Retour</button>' : "") +
          '<button class="btn" id="wzNext">' + (last ? ic("check") + "Valider" : "Suivant" + ic("next")) + "</button></div>";
      }
      openSheet(html, function () {
        on("wzM", "click", function () { bump(-1); });
        on("wzP", "click", function () { bump(1); });
        on("wzNext", "click", function () { if (k < steps.length - 1) { k++; render(); } else finish(); });
        on("wzBack", "click", function () { k--; render(); });
        on("wzSkip", "click", function () { v.fw = null; finish(); });
        $$(".fw-pick button").forEach(function (b) { b.addEventListener("click", function () { v.fw = b.getAttribute("data-v"); finish(); }); });
      });
    }
    function bump(d) {
      var st = steps[k];
      if (st === "score") { v.score = Math.max(1, Math.min(15, v.score + d)); v.putts = null; v.pen = Math.min(v.pen, v.score - 1); }
      if (st === "putts") v.putts = Math.max(0, Math.min(v.score, v.putts + d));
      if (st === "pen") v.pen = Math.max(0, Math.min(Math.max(0, v.score - v.putts - 1), v.pen + d));
      render();
    }
    function finish() {
      defPutts();
      h.score = v.score; h.putts = v.putts; h.pen = v.pen;
      if (h.par > 3) { h.fwDir = v.fw; h.fairway = v.fw === "hit" ? "oui" : v.fw ? "non" : null; }
      h.gir = v.score - v.putts <= h.par - 2 ? "oui" : "non";
      h.upDown = h.gir === "non" ? (v.score <= h.par ? "oui" : "non") : null;
      h.done = true;
      if (!round.t0) round.t0 = Date.now();
      persist("round");
      closeSheet();
      renderPlayHead();
      afterHole();
    }
    render();
  }
  function midRecap() {
    var hs = round.holes.slice(0, 9), t = totals({ holes: hs });
    var pts = 0; for (var k = 0; k < 9; k++) pts += holePoints(k);
    var time = round.t0 ? fmtDur(Date.now() - round.t0) : "—";
    var km = round.walk ? (round.walk / 1000).toFixed(1).replace(".", ",") : "—";
    openSheet("<h3>Mi-parcours</h3><p>Les 9 premiers trous, pour te situer dans ton plan de jeu.</p>" +
      '<div class="stat-grid">' +
      stat(t.score, "Score", "(" + signed(t.score - t.par) + ")") +
      (round.format === "stableford" ? stat(pts, "Points stableford") : stat(t.putts, "Putts")) +
      stat(t.girHit + "/" + hs.length, "Greens en régul.") +
      stat(t.fwCount ? t.fwHit + "/" + t.fwCount : "—", "Fairways touchés") +
      (round.format === "stableford" ? stat(t.putts, "Putts") : stat(r1(t.putts / 9).toString().replace(".", ","), "Putts par trou")) +
      stat(t.pen, "Pénalités") +
      stat(time, "Temps de jeu") +
      stat(km, "Distance", round.walk ? "km" : "") +
      "</div>" +
      '<button class="btn" id="mrGo" style="margin-top:14px">' + ic("flag") + "Reprendre le parcours</button>", function () {
      on("mrGo", "click", closeSheet);
    });
  }

  // ---------- Onglet carte ----------
  function renderMapTab() {
    $("#pBody").innerHTML =
      '<div id="mEmpty"></div>' +
      '<div class="dist-row"><div class="dist-main"><div class="big num"><span id="dC">—</span><small> m</small></div><div class="lbl">Centre du green</div></div>' +
      '<div class="dist-side"><div><span class="l">Fond</span><span class="v num" id="dB">—</span></div><div><span class="l">Avant</span><span class="v num" id="dF">—</span></div></div></div>' +
      '<div class="status-line"><span id="gSt"><span class="dot"></span>GPS en attente</span><span id="gOr"></span></div>' +
      '<div id="caddie"></div><div class="haz" id="haz"></div>' +
      '<div class="map-wrap" id="mapWrap"><div id="map"></div>' +
      '<div class="fs-top" id="fsTop"></div>' +
      '<div class="map-tools"><button class="map-tool" id="mFull" aria-label="Plein écran">' + ic("expand") + '</button><button class="map-tool" id="mCompass" aria-label="Boussole">' + ic("compass") + "</button></div>" +
      '<button class="fs-exit" id="fsExit">' + ic("shrink") + "Quitter</button>" +
      '<div class="fs-bottom" id="fsBottom"></div></div>' +
      '<div id="shotZone"></div>' +
      '<div id="editZone"></div>';
    if (typeof L !== "undefined") {
      var canRotate = !!L.Map.prototype.setBearing;
      map = L.map("map", { zoomControl: false, attributionControl: true, maxZoom: 20, doubleClickZoom: false,
        rotate: canRotate, bearing: 0, touchRotate: false, shiftKeyRotate: false, rotateControl: false, compassBearing: false });
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 20, maxNativeZoom: 19, attribution: "© Esri · © OpenStreetMap"
      }).addTo(map);
      map.attributionControl.setPrefix(false);
      layers = L.layerGroup().addTo(map);
      map.on("click", onMapClick);
      map.on("dblclick", function () { if (editMode) return; clearTimeout(tapTimer); tapTimer = null; setFull(!isFull); });
      var cc = roundCourse();
      map.setView(cc.center || [46.6, 2.4], cc.center ? 15 : 6);
    } else {
      $("#map").innerHTML = '<div class="empty" style="color:#fff">Carte indisponible sans connexion au premier lancement. Les distances restent affichées.</div>';
    }
    on("mFull", "click", function () { setFull(true); });
    on("fsExit", "click", function () { setFull(false); });
    on("mCompass", "click", toggleCompass);
    lastFitKey = "";
    renderMapContent(true);
  }
  function setFull(v, silent) {
    isFull = v;
    document.body.classList.toggle("map-fs", v);
    if (silent || !map) return;
    renderMapContent(false);
    setTimeout(function () { if (map) { map.invalidateSize(); fitHole(holeGeo(round.course.id, curKey())); } }, 60);
  }
  function origin(g) {
    var ref = g.c || g.tee;
    if (me && ref && distM(me.pos, ref) < 1000) return { pos: me.pos, kind: "me" };
    if (g.tee) return { pos: g.tee, kind: "tee" };
    return null;
  }
  // point de départ de la mesure vers la cible : ta position dès que le GPS te situe sur le parcours
  function targetFrom(g) {
    var ref = g.c || g.tee;
    if (me && (!ref || distM(me.pos, ref) < 3000)) return { pos: me.pos, kind: "me" };
    return origin(g);
  }
  function renderMapContent(refit) {
    if (!$("#dC")) return;
    var c = roundCourse(), cid = round.course.id, key = curKey();
    var g = holeGeo(cid, key), o = origin(g);
    var dC = o && g.c ? distM(o.pos, g.c) : null, dF = o && g.f ? distM(o.pos, g.f) : null, dB = o && g.b ? distM(o.pos, g.b) : null;
    var ap = g.est ? "≈" : "";
    var tC = dC == null ? "—" : Math.round(dC), tF = dF == null ? "—" : ap + Math.round(dF), tB = dB == null ? "—" : ap + Math.round(dB);
    $("#dC").textContent = tC;
    $("#dF").textContent = tF;
    $("#dB").textContent = tB;
    var st = $("#gSt");
    if (gpsError === "refus") st.innerHTML = '<span class="dot warn"></span>Localisation refusée';
    else if (!me) st.innerHTML = '<span class="dot warn"></span>Recherche du GPS…';
    else st.innerHTML = '<span class="dot ' + (me.acc <= 15 ? "ok" : "warn") + '"></span>GPS ± ' + Math.round(me.acc) + " m";
    $("#gOr").textContent = !o ? "" : o.kind === "me" ? "depuis ta position" : "depuis le départ";
    // Caddie
    var tf = targetFrom(g);
    var sug = suggestClub(target && tf ? distM(tf.pos, target) : dC);
    $("#caddie").innerHTML = sug && !editMode ? '<div class="caddie"><span class="ic">' + ic("club") + "</span><span>Club conseillé : <b>" + esc(sug.c.name) + "</b> <span class=\"muted\">(" + sug.d + " m" +
      (target ? ", jusqu'à la cible" : "") + ")</span></span></div>" : "";
    renderHazards(holeHazards(cid, key), o, g);
    var em = $("#mEmpty");
    em.innerHTML = !g.c && !editMode ? '<div class="caddie" style="background:var(--primary-soft)"><span class="ic" style="color:var(--primary)">' + ic("pin") +
      "</span><span>Le green de ce trou n'est pas encore placé. Touche <b>Placer les points</b> sous la carte.</span></div>" : "";
    // Plein écran : distances en haut, actions en bas
    var green = onGreen(g) && !curHole().done;
    $("#fsTop").innerHTML = '<div class="fs-hole"><b class="num">' + (round.holeIndex + 1) + "</b><span>Par " + curHole().par + "</span></div>" +
      '<div class="fs-d"><div class="c num">' + tC + "<small>m</small></div><div class=\"fb\"><span>F <b class=\"num\">" + tB + "</b></span><span>A <b class=\"num\">" + tF + "</b></span></div></div>";
    $("#fsBottom").innerHTML = editMode ? "" : (green ? '<button class="btn gold" id="fsVal">' + ic("edit") + "Valider le trou</button>" :
      '<button class="btn" id="fsShot">' + ic("swing") + "Je tape d'ici</button>");
    on("fsShot", "click", shotHere);
    on("fsVal", "click", openValidation);
    $("#mCompass").classList.toggle("on", compassOn);
    renderShotZone(green);
    renderEditZone();
    if (!map) return;
    drawLayers(g, o, cid, key);
    var fk = cid + ":" + key;
    var didFit = refit || fk !== lastFitKey;
    map.invalidateSize();
    if (didFit) { fitHole(g); lastFitKey = fk; }
    setTimeout(function () { if (map) { map.invalidateSize(); if (didFit && lastFitKey === fk) fitHole(holeGeo(cid, curKey())); } }, 90);
  }
  var HZ_IC = {
    s: '<svg class="hz-ic" viewBox="0 0 30 20" aria-hidden="true"><path d="M2 16C3.6 9.4 8.6 5 15 5s11.4 4.4 13 11c-3.4 2.7-22.6 2.7-26 0z" fill="#e6c77f" stroke="#b48a33" stroke-width="1.3"/>' +
      '<circle cx="9.5" cy="12.5" r="1.1" fill="#b48a33"/><circle cx="15" cy="9.6" r="1.1" fill="#b48a33"/><circle cx="20" cy="13" r="1.1" fill="#b48a33"/><circle cx="14" cy="14.6" r="1" fill="#b48a33"/></svg>',
    w: '<svg class="hz-ic" viewBox="0 0 30 20" aria-hidden="true"><path d="M3 10.5C3 6 8.4 3 15 3s12 3 12 7.5S21.6 18 15 18 3 15 3 10.5z" fill="#3d8bd9"/>' +
      '<path d="M8 9.6c1.7-1.3 3.4-1.3 5.1 0s3.4 1.3 5.1 0 3.4-1.3 4.6 0" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M10 13.6c1.5-1.1 3-1.1 4.5 0s3 1.1 4.5 0" fill="none" stroke="#cfe4f7" stroke-width="1.4" stroke-linecap="round"/></svg>'
  };
  function renderHazards(hz, o, g) {
    var box = $("#haz");
    box.innerHTML = "";
    if (!hz.length || !o || !g.c || editMode) return;
    var dir = toXY(o.pos, g.c), len = Math.hypot(dir[0], dir[1]);
    if (!len) return;
    var u = [dir[0] / len, dir[1] / len];
    var rows = hz.filter(function (z) { return z.f && z.b; }).map(function (z) {
      var vb = toXY(o.pos, z.b);
      return { z: z, ahead: vb[0] * u[0] + vb[1] * u[1], df: distM(o.pos, z.f), db: distM(o.pos, z.b) };
    }).filter(function (r) { return r.ahead > 0; }).sort(function (a, b) { return a.df - b.df; }).slice(0, 4);
    box.innerHTML = rows.map(function (r) {
      return '<div class="haz-row"><span class="n">' + (r.z.t === "w" ? HZ_IC.w : HZ_IC.s) +
        (r.z.t === "w" ? "Eau" : "Bunker") + (r.z.s ? " " + esc(r.z.s) : "") + '</span><span class="d num">' + Math.round(r.df) + " <small>/</small> " + Math.round(r.db) + " <small>m</small></span></div>";
    }).join("") + (rows.length ? '<div class="muted small" style="margin:0 4px">Obstacles devant toi : pour l\'atteindre / pour le passer</div>' : "");
  }
  function drawLayers(g, o, cid, key) {
    layers.clearLayers();
    holeHazards(cid, key).forEach(function (z) {
      if (!z.p || z.p.length < 3) return;
      var col = z.t === "w" ? "#3d8bd9" : "#e3c27a";
      L.polygon(z.p, { color: col, weight: 1.5, opacity: 0.95, fillColor: col, fillOpacity: 0.18, interactive: false }).addTo(layers);
    });
    // coups joués sur ce trou
    holeShots(round.holeIndex).forEach(function (s) {
      if (s.end) L.polyline([s.pos, s.end], { color: "#f2b134", weight: 3, opacity: 0.9, interactive: false }).addTo(layers);
      L.circleMarker(s.pos, { radius: 5, color: "#fff", weight: 2, fillColor: "#f2b134", fillOpacity: 1, interactive: false }).addTo(layers);
    });
    var tf = targetFrom(g);
    if (!editMode && g.c && (o || (target && tf))) {
      var line = target && tf ? [tf.pos, target, g.c] : [o.pos, g.c];
      L.polyline(line, { color: "#fff", weight: 2.5, opacity: 0.9, dashArray: "6 6", interactive: false }).addTo(layers);
    }
    if (target && tf && !editMode) {
      var html = Math.round(distM(tf.pos, target)) + " m <small>" + (tf.kind === "me" ? "depuis toi" : "depuis le départ") + "</small>";
      if (g.c) html += "<br><small>reste " + Math.round(distM(target, g.c)) + " m au centre</small>";
      L.circleMarker(target, { radius: 7, color: "#fff", weight: 3, fillColor: "#f2b134", fillOpacity: 1, interactive: false }).addTo(layers)
        .bindTooltip(html, { permanent: true, direction: "top", offset: [0, -8], className: "dist-tip" });
    }
    POINTS.forEach(function (p) {
      if (!g[p.k]) return;
      if (!editMode) {
        if (p.k === "c") L.circleMarker(g.c, { radius: 8, color: "#fff", weight: 3, fillColor: "#d0452e", fillOpacity: 1, interactive: false }).addTo(layers);
        else if (p.k === "tee") L.circleMarker(g.tee, { radius: 6, color: "#1c2318", weight: 2, fillColor: "#f4f1e4", fillOpacity: 1, interactive: false }).addTo(layers);
        else L.circleMarker(g[p.k], { radius: 4, color: "#fff", weight: 1.5, fillColor: p.color, fillOpacity: 1, interactive: false }).addTo(layers);
        return;
      }
      var mk = L.marker(g[p.k], { icon: L.divIcon({ className: "pt-label", html: p.short, iconSize: [28, 28] }), draggable: true }).addTo(layers);
      setTimeout(function () { var el = mk.getElement(); if (el) { el.style.background = p.color; el.style.color = p.text; } }, 0);
      mk.on("dragend", function () { var ll = mk.getLatLng(); setGeoPoint(p.k, [ll.lat, ll.lng]); });
    });
    if (me) {
      L.circle(me.pos, { radius: me.acc, color: "#2f7cf6", weight: 1, fillOpacity: 0.12, interactive: false }).addTo(layers);
      L.marker(me.pos, { icon: L.divIcon({ className: "me-dot", iconSize: [18, 18] }), interactive: false }).addTo(layers);
    }
  }
  // cap (en degrés depuis le nord, sens horaire) pour aller de a vers b
  function headingTo(a, b) { var v = toXY(a, b); return (Math.atan2(v[0], v[1]) * 180 / Math.PI + 360) % 360; }
  function fitHole(g) {
    if (!map) return;
    var from = me && g.c && distM(me.pos, g.c) < 1000 && !onGreen(g) ? me.pos : g.tee;
    var to = g.b || g.c;
    if (from && to && g.c && map.setBearing) {
      // trou vers le haut : départ (ou ta position) en bas, green en haut
      if (!compassOn) map.setBearing(-headingTo(from, g.c));
      var L_ = Math.max(60, distM(from, to));
      var sz = map.getSize(), h = Math.max(150, sz.y - (isFull ? 230 : 50));
      var mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
      var z = Math.log(156543.03 * Math.cos(mid[0] * Math.PI / 180) * h / (L_ * 1.12)) / Math.LN2;
      z = Math.max(14, Math.min(19, Math.floor(z * 4) / 4));
      if (isFull) {
        // laisse la place au bandeau des distances en haut
        var shift = 90 * 156543.03 * Math.cos(mid[0] * Math.PI / 180) / Math.pow(2, z);
        var u = toXY(from, to), n = Math.hypot(u[0], u[1]) || 1;
        mid = fromXY(mid, [u[0] / n * shift, u[1] / n * shift]);
      }
      map.setView(mid, z, { animate: false });
      return;
    }
    var pts = [];
    if (g.tee) pts.push(g.tee);
    if (g.c) pts.push(g.c);
    if (g.b) pts.push(g.b);
    if (me && g.c && distM(me.pos, g.c) < 1000) pts.push(me.pos);
    if (pts.length >= 2) map.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 19 });
    else if (pts.length === 1) map.setView(pts[0], 17);
    else {
      var c = roundCourse(), near = null;
      for (var d = 1; d < round.holes.length && !near; d++) {
        var a = holeGeo(round.course.id, curKey((round.holeIndex - d + round.holes.length) % round.holes.length));
        if (a.c) near = a.c;
      }
      var center = near || c.center || (me && me.pos);
      if (center) map.setView(center, 16);
    }
  }
  // ---------- Boussole : la carte suit le téléphone ----------
  var compassOn = false, headS = null, lastBearing = null, lastTurn = 0, compassEvt = null, compassCheck = null;
  function onOrient(e) {
    var hd = e.webkitCompassHeading != null ? e.webkitCompassHeading : (e.alpha == null ? null : 360 - e.alpha);
    if (hd == null || (compassEvt === "deviceorientation" && e.webkitCompassHeading == null && !e.absolute)) return;
    var so = (screen.orientation && screen.orientation.angle) || window.orientation || 0;
    hd = (hd + so + 360) % 360;
    if (headS == null) headS = hd;
    var diff = ((hd - headS + 540) % 360) - 180;
    headS = (headS + diff * 0.25 + 360) % 360;
    var now = Date.now();
    if (!map || !map.setBearing || now - lastTurn < 80) return;
    if (lastBearing != null && Math.abs(((headS - lastBearing + 540) % 360) - 180) < 1.5) return;
    lastTurn = now; lastBearing = headS;
    map.setBearing(-headS);
  }
  function startCompass() {
    compassEvt = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    headS = null; lastBearing = null;
    window.addEventListener(compassEvt, onOrient);
    compassCheck = setTimeout(function () {
      if (compassOn && headS == null) { toast("Boussole indisponible sur ce téléphone"); toggleCompass(); }
    }, 2500);
  }
  function stopCompass() {
    if (compassEvt) window.removeEventListener(compassEvt, onOrient);
    compassEvt = null; clearTimeout(compassCheck);
  }
  function toggleCompass() {
    if (!map || !map.setBearing) { toast("Rotation de la carte indisponible hors connexion"); return; }
    if (compassOn) {
      compassOn = false; stopCompass();
      toast("Trou vers le haut");
      fitHole(holeGeo(round.course.id, curKey()));
    } else {
      var go_ = function () {
        compassOn = true; startCompass();
        toast("Boussole : la carte suit ton téléphone");
        if (me) map.panTo(me.pos);
      };
      if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission().then(function (r) { if (r === "granted") go_(); else toast("Boussole refusée"); }).catch(function () { toast("Boussole indisponible"); });
      } else go_();
    }
    var b = $("#mCompass"); if (b) b.classList.toggle("on", compassOn);
  }
  var tapTimer = null;
  function onMapClick(e) {
    var p = [e.latlng.lat, e.latlng.lng];
    if (editMode) {
      setGeoPoint(editPoint, p);
      var i = POINTS.map(function (x) { return x.k; }).indexOf(editPoint);
      if (i < POINTS.length - 1) editPoint = POINTS[i + 1].k;
      renderMapContent(false);
      return;
    }
    // on attend un peu : un double tap ouvre/ferme le plein écran au lieu de poser une cible
    clearTimeout(tapTimer);
    tapTimer = setTimeout(function () { tapTimer = null; target = p; renderMapContent(false); }, 280);
  }
  function setGeoPoint(k, p) {
    var cid = round.course.id, key = curKey();
    geoOver[cid] = geoOver[cid] || {};
    var o = geoOver[cid][key] = geoOver[cid][key] || {};
    o[k] = p ? r6(p) : null;
    if (k !== "tee") o.est = 0;
    if (p && userCourses[cid] && !userCourses[cid].center) { userCourses[cid].center = r6(p); persist("courses"); }
    persist("geo");
    renderMapContent(false);
  }

  // ---------- Suivi des coups ----------
  function openShot() {
    var s = (round.shots || [])[round.shots.length - 1];
    return s && !s.end && s.hole === round.holeIndex ? s : null;
  }
  function closeOpenShot(withPos) {
    var s = openShot();
    if (!s) return null;
    if (withPos === true && me) {
      s.end = r6(me.pos);
      s.d = Math.round(distM(s.pos, s.end));
      var club = clubById(s.club);
      if (club && !club.putter && s.d >= 15 && s.d <= 400) {
        clubs.shots[s.club] = clubs.shots[s.club] || [];
        clubs.shots[s.club].push({ d: s.d, date: new Date().toISOString() });
        persist("clubs");
      }
    } else if (withPos) {
      // pas de GPS : le coup reste compté, sans distance
      s.end = s.pos; s.d = null;
    } else {
      round.shots.pop();
    }
    persist("round");
    return s;
  }
  function shotHere() {
    if (!me) { toast(gpsError === "refus" ? "Autorise la localisation pour mesurer tes coups" : "GPS pas encore prêt, patiente un instant"); return; }
    if (me.acc > 30) toast("GPS peu précis (± " + Math.round(me.acc) + " m), la distance sera approximative");
    var g = holeGeo(round.course.id, curKey()), o = origin(g), tf = targetFrom(g);
    var dist = target && tf ? distM(tf.pos, target) : (o && g.c ? distM(o.pos, g.c) : null);
    var sug = suggestClub(dist);
    var list = clubs.list.filter(function (cl) { return !cl.putter; });
    if (sug) list = [sug.c].concat(list.filter(function (cl) { return cl.id !== sug.c.id; }));
    openSheet("<h3>Quel club ?</h3><p>" + (dist ? "Il te reste " + Math.round(dist) + " m." : "Choisis le club de ce coup.") + " Un seul toucher suffit.</p>" +
      '<div class="club-pick">' + list.map(function (cl) {
        var cd = clubDistance(cl).d, isSug = sug && sug.c.id === cl.id;
        return '<button data-c="' + esc(cl.id) + '" class="' + (isSug ? "sug" : "") + '">' + esc(cl.name) + "<small>" + (isSug ? "Conseillé" + (cd ? " · " + cd + " m" : "") : cd ? cd + " m" : "&nbsp;") + "</small></button>";
      }).join("") + "</div>", function () {
      $$(".club-pick button").forEach(function (b) {
        b.addEventListener("click", function () {
          var prev = closeOpenShot(true);
          round.shots = round.shots || [];
          round.shots.push({ hole: round.holeIndex, club: b.getAttribute("data-c"), pos: r6(me.pos), t: Date.now() });
          if (!round.t0) round.t0 = Date.now();
          target = null;
          persist("round");
          closeSheet();
          var n = holeShots(round.holeIndex).length;
          toast((prev && prev.d ? (clubById(prev.club) || {}).name + " : " + prev.d + " m · " : "") + "Coup " + n + " enregistré");
          renderMapContent(false);
        });
      });
    });
  }
  function renderShotZone(green) {
    var z = $("#shotZone");
    if (!z) return;
    if (editMode) { z.innerHTML = ""; return; }
    var s = openShot();
    var all = holeShots(round.holeIndex);
    var done = all.filter(function (x) { return x.end && x.d; });
    var info = (all.length ? "<b>" + all.length + " coup" + (all.length > 1 ? "s" : "") + "</b> enregistré" + (all.length > 1 ? "s" : "") + " sur ce trou" : "Avant chaque coup, touche « Je tape d'ici » et choisis ton club.") +
      (done.length ? "<br>" + done.map(function (x) { return esc((clubById(x.club) || {}).name || "?") + " " + x.d + " m"; }).join(" · ") : "") +
      (s ? "<br>" + esc((clubById(s.club) || {}).name || "?") + " en cours : mesuré au prochain coup ou à l'arrivée sur le green." : "");
    z.innerHTML = (green ? '<button class="btn gold big-act" id="valHere">' + ic("edit") + "Valider le trou</button>" : "") +
      '<button class="btn big-act' + (green ? " ghost" : "") + '" id="shotHere">' + ic("swing") + "Je tape d'ici</button>" +
      '<div class="shot-info">' + info + (s ? ' <button class="link-btn" id="shotUndo">Annuler ce coup</button>' : "") + "</div>" +
      '<div class="map-mini"><button class="btn ghost sm" id="mRecenter">' + ic("locate") + 'Recentrer</button><button class="btn ghost sm" id="mClear">Effacer la cible</button><button class="btn ghost sm" id="mEdit">' + ic("pin") + "Placer les points</button></div>";
    on("shotHere", "click", shotHere);
    on("valHere", "click", openValidation);
    on("shotUndo", "click", function () { closeOpenShot(false); toast("Coup annulé"); renderMapContent(false); });
    on("mRecenter", "click", function () { fitHole(holeGeo(round.course.id, curKey())); });
    on("mClear", "click", function () { target = null; renderMapContent(false); });
    on("mEdit", "click", function () {
      editMode = true; target = null;
      if (isFull) setFull(false);
      var g = holeGeo(round.course.id, curKey());
      editPoint = !g.tee ? "tee" : (!g.c ? "c" : "f");
      renderMapContent(false);
    });
  }
  function renderEditZone() {
    var z = $("#editZone");
    if (!z) return;
    if (!editMode) { z.innerHTML = ""; return; }
    var g = holeGeo(round.course.id, curKey());
    z.innerHTML = '<div class="card" style="margin-top:10px"><h3>Placer les points · trou ' + (round.holeIndex + 1) + "</h3>" +
      '<p class="muted small" style="margin:0 0 10px;line-height:1.45">Touche la carte pour placer : <b>' + pointDef(editPoint).label.toLowerCase() +
      "</b>. Tu peux faire glisser les repères. Change de trou avec la barre du bas.</p>" +
      '<div class="chips" id="ePts">' + POINTS.map(function (p) { return '<button class="chip ' + (p.k === editPoint ? "on" : "") + '" data-k="' + p.k + '">' + (g[p.k] ? "✓ " : "") + p.label + "</button>"; }).join("") + "</div>" +
      '<div class="row" style="margin-top:12px"><button class="btn ghost sm" id="eHere">' + ic("locate") + 'À ma position</button><button class="btn ghost sm" id="eDel">' + ic("trash") + "Effacer</button></div>" +
      '<div class="row" style="margin-top:10px"><input class="input" id="eQ" placeholder="Aller à un lieu" /><button class="btn ghost sm" id="eGo" style="flex:0 0 auto">Aller</button></div><div id="eRes"></div>' +
      '<button class="btn" id="eDone" style="margin-top:12px">Terminé</button></div>';
    $$("#ePts .chip").forEach(function (b) { b.addEventListener("click", function () { editPoint = b.getAttribute("data-k"); renderMapContent(false); }); });
    on("eHere", "click", function () { if (!me) { toast("Pas encore de position GPS"); return; } setGeoPoint(editPoint, me.pos); });
    on("eDel", "click", function () { setGeoPoint(editPoint, null); });
    on("eDone", "click", function () { editMode = false; renderMapContent(false); });
    on("eGo", "click", function () {
      var q = $("#eQ").value.trim();
      if (!q) return;
      $("#eRes").innerHTML = '<p class="muted small">Recherche…</p>';
      nominatim(q).then(function (res) {
        $("#eRes").innerHTML = res.length ? "" : '<p class="muted small">Aucun lieu trouvé.</p>';
        res.forEach(function (r) {
          var b = document.createElement("button");
          b.className = "result-btn";
          b.textContent = r.display_name.split(",").slice(0, 2).join(",");
          b.addEventListener("click", function () { if (map) map.setView([+r.lat, +r.lon], 17); $("#eRes").innerHTML = ""; });
          $("#eRes").appendChild(b);
        });
      }).catch(function () { $("#eRes").innerHTML = '<p class="muted small">Recherche impossible (pas de réseau ?).</p>'; });
    });
  }
  function pointDef(k) { return POINTS.filter(function (p) { return p.k === k; })[0]; }
  function nominatim(q) {
    return fetch("https://nominatim.openstreetmap.org/search?format=json&limit=5&accept-language=fr&q=" + encodeURIComponent(q)).then(function (r) { return r.json(); });
  }

  // ---------- Onglet score ----------
  function renderScoreTab() {
    var h = curHole(), c = roundCourse(), idx = round.holeIndex;
    function yn(id, val, opts) {
      return '<div class="seg" id="' + id + '" style="max-width:220px;flex:none;width:100%">' + opts.map(function (o) {
        return '<button data-v="' + o[0] + '" class="' + (val === o[0] ? "on" : "") + '">' + o[1] + "</button>";
      }).join("") + "</div>";
    }
    var diff = h.score - h.par;
    var name = diff <= -2 ? "Eagle" : diff === -1 ? "Birdie" : diff === 0 ? "Par" : diff === 1 ? "Bogey" : diff === 2 ? "Double bogey" : "+" + diff;
    var pts = holePoints(idx);
    var key = curKey();
    $("#pBody").innerHTML =
      '<div class="card"><div class="score-big"><button id="scM">−</button><span class="v num" id="scV">' + h.score + '</span><button id="scP">+</button></div>' +
      '<div class="score-lbl"><b>' + name + "</b>" + (round.format === "stableford" || pts != null ? " · " + pts + " point" + (pts > 1 ? "s" : "") : "") + "</div></div>" +
      '<div class="card">' +
      '<div class="line-row"><span class="t">Par</span>' + yn("sPar", h.par, [[3, "3"], [4, "4"], [5, "5"]]) + "</div>" +
      (h.par > 3 ? '<div class="line-row"><span class="t">Fairway</span>' + yn("sFw", h.fairway, [["oui", "Touché"], ["non", "Raté"]]) + "</div>" : "") +
      '<div class="line-row"><span class="t">Green en régul.</span>' + yn("sGir", h.gir, [["oui", "Oui"], ["non", "Non"]]) + "</div>" +
      '<div class="line-row"><span class="t">Putts</span><div class="stepper"><button id="puM">−</button><span class="v num">' + h.putts + '</span><button id="puP">+</button></div></div>' +
      '<div class="line-row"><span class="t">Pénalités</span><div class="stepper"><button id="peM">−</button><span class="v num">' + (h.pen || 0) + '</span><button id="peP">+</button></div></div>' +
      (h.gir === "non" ? '<div class="line-row"><span class="t">Up &amp; down</span>' + yn("sUd", h.upDown, [["oui", "Réussi"], ["non", "Raté"]]) + "</div>" : "") +
      "</div>" +
      '<div class="card"><h2>Ma note sur ce trou</h2><textarea class="input" id="sNote" placeholder="Danger, club, plan de jeu… Elle reviendra à chaque partie ici.">' +
      esc(getNote(round.course.id, key)) + '</textarea><div class="muted small" style="margin-top:8px">Enregistrée automatiquement dans ton carnet de parcours.</div></div>';
    function setv(k, v) { h[k] = v; h.done = true; if (!round.t0) round.t0 = Date.now(); persist("round"); renderScoreTab(); renderPlayHead(); }
    on("scM", "click", function () { setv("score", Math.max(1, h.score - 1)); });
    on("scP", "click", function () { setv("score", h.score + 1); });
    on("puM", "click", function () { setv("putts", Math.max(0, h.putts - 1)); });
    on("puP", "click", function () { setv("putts", h.putts + 1); });
    on("peM", "click", function () { setv("pen", Math.max(0, (h.pen || 0) - 1)); });
    on("peP", "click", function () { setv("pen", (h.pen || 0) + 1); });
    $$("#sPar button").forEach(function (b) { b.addEventListener("click", function () { var v = +b.getAttribute("data-v"); h.fairway = v === 3 ? "na" : (h.fairway === "na" ? null : h.fairway); setv("par", v); }); });
    [["sFw", "fairway"], ["sGir", "gir"], ["sUd", "upDown"]].forEach(function (x) {
      $$("#" + x[0] + " button").forEach(function (b) { b.addEventListener("click", function () { setv(x[1], b.getAttribute("data-v")); }); });
    });
    on("sNote", "input", function () {
      notes[round.course.id] = notes[round.course.id] || {};
      notes[round.course.id][key] = $("#sNote").value;
      persist("notes");
    });
  }
  function defaultNote(cid, key) {
    var h = rawHole(cid, key);
    if (!h) return "";
    var parts = [];
    if (h.danger) parts.push("Danger : " + h.danger);
    if (h.plan) parts.push("Plan : " + h.plan);
    if (h.club) parts.push("Clubs : " + h.club);
    return parts.join("\n");
  }
  function getNote(cid, key) {
    if (notes[cid] && notes[cid][key] != null) return notes[cid][key];
    return defaultNote(cid, key);
  }

  // ---------- Onglet carte de score ----------
  function renderCardTab() {
    var c = roundCourse(), t = totals({ holes: round.holes.slice(0, round.holeIndex + 1) });
    function block(a, b) {
      var hs = "", ps = "", ss = "", pt = "";
      for (var k = a; k < b; k++) {
        var h = round.holes[k], d = h.score - h.par;
        var cls = (k === round.holeIndex ? "cur " : "") + (d < 0 ? "bird" : d === 1 ? "bog" : d >= 2 ? "dbl" : "");
        hs += "<td>" + (k + 1) + "</td>"; ps += "<td>" + h.par + "</td>";
        ss += '<td class="' + cls + '" data-h="' + k + '">' + (k <= round.holeIndex ? h.score : "·") + "</td>";
        pt += "<td>" + (k <= round.holeIndex ? holePoints(k) : "·") + "</td>";
      }
      return '<div class="card-scroll"><table class="sc num"><tr><th>Trou</th>' + hs + "</tr><tr><th>Par</th>" + ps + "</tr><tr><th>Score</th>" + ss + "</tr>" +
        (round.format === "stableford" ? "<tr><th>Points</th>" + pt + "</tr>" : "") + "</table></div>";
    }
    var n = round.holes.length;
    var pl = playedTotals();
    $("#pBody").innerHTML = '<div class="card">' + block(0, Math.min(9, n)) + (n > 9 ? '<div class="spacer"></div>' + block(9, n) : "") +
      '<div class="muted small" style="margin-top:8px">Touche un score pour aller sur ce trou.</div></div>' +
      '<div class="card"><div class="stat-grid">' +
      stat(pl.s, "Score (" + (round.holeIndex + 1) + " trous)", "(" + signed(pl.s - pl.p) + ")") +
      stat(totalPoints(), "Points stableford") +
      stat(t.putts, "Putts") +
      stat(t.girCount ? Math.round(t.girHit / t.girCount * 100) + "%" : "—", "Greens en régul.") +
      "</div></div>" +
      '<div class="card"><div class="line-row" style="padding-top:0"><span class="t">Type</span><span class="pill ' + (round.type === "competition" ? "gold" : "") + '">' +
      (round.type === "competition" ? "Compétition" : "Entraînement") + '</span></div><div class="line-row"><span class="t">Formule</span><span class="pill">' +
      (round.format === "stableford" ? "Stableford" : "Stroke play") + "</span></div></div>" +
      '<button class="btn gold" id="cFinish">' + ic("check") + "Terminer et enregistrer</button>" +
      '<button class="btn danger" id="cAbandon">Abandonner la partie</button>';
    $$("table.sc td[data-h]").forEach(function (td) {
      td.addEventListener("click", function () { round.holeIndex = +td.getAttribute("data-h"); persist("round"); go("play", { tab: "score" }, true); });
    });
    on("cFinish", "click", finishSheet);
    on("cAbandon", "click", function () {
      confirmSheet("Abandonner la partie ?", "Elle ne sera pas enregistrée dans tes statistiques.", "Abandonner", function () { round = null; persist("round"); go("home", {}, true); }, true);
    });
  }
  function stat(n, l, small) {
    return '<div class="stat"><div class="n num">' + n + (small ? " <small>" + esc(small) + "</small>" : "") + '</div><div class="l">' + esc(l) + "</div></div>";
  }
  function finishSheet() {
    var played = round.holeIndex + 1, n = round.holes.length;
    confirmSheet("Terminer la partie ?", played < n ? "Tu es au trou " + played + " sur " + n + ". Les trous suivants seront comptés au score du par." : "La partie sera enregistrée dans tes statistiques.", "Enregistrer la partie", finishRound);
  }
  function finishRound() {
    closeOpenShot(true);
    var c = roundCourse(), t = totals(round);
    var entry = {
      date: round.date, course: c.fullName, courseId: round.course.id, type: round.type, format: round.format,
      countsForIndex: round.type === "competition", totalScore: t.score, totalPar: t.par, putts: t.putts,
      avgPutts: (t.putts / round.holes.length).toFixed(1), fwHit: t.fwHit, fwCount: t.fwCount, girHit: t.girHit, girCount: t.girCount,
      udHit: t.udHit, udCount: t.udCount, stablefordPoints: totalPoints(true), hcp: round.course.hcp, penalties: t.pen,
      durationMin: round.t0 ? Math.round((Date.now() - round.t0) / 60000) : null, walkKm: round.walk ? r1(round.walk / 1000) : null,
      holes: round.holes.map(function (h, k) { return { hole: k + 1, score: h.score, par: h.par }; })
    };
    history.push(entry);
    persist("history");
    round = null;
    persist("round");
    toast("Partie enregistrée");
    go("stats", {}, true);
  }

  // =====================================================================
  // Mes clubs
  // =====================================================================
  VIEWS.clubs = function () {
    var max = 0;
    clubs.list.forEach(function (c) { var d = clubDistance(c).d; if (d > max) max = d; });
    var rows = clubs.list.map(function (c) {
      var cd = clubDistance(c), st = clubStats(c.id);
      var info = c.putter ? "Pas de distance" : st.n ? (st.n >= 3 ? "Moyenne de " + st.n + " coups mesurés" : st.n + " coup" + (st.n > 1 ? "s" : "") + " mesuré" + (st.n > 1 ? "s" : "") + ", moyenne dès 3") +
        (st.max ? " · max " + st.max + " m" : "") : "Saisie manuelle";
      return '<div class="club" data-id="' + esc(c.id) + '"><div class="top"><div><div class="nm">' + esc(c.name) + '</div><div class="info">' + info + "</div></div>" +
        '<div class="dist num">' + (cd.d ? cd.d + " <small>m</small>" : "—") + "</div></div>" +
        (cd.d ? '<div class="club-bar"><div style="width:' + Math.round(cd.d / max * 100) + '%"></div></div>' : "") + "</div>";
    }).join("");
    page(topbar("Mes clubs", '<button class="icon-btn" id="clAdd" aria-label="Ajouter un club">' + ic("plus") + "</button>") +
      '<p class="lead">Touche un club pour corriger sa distance. Pendant une partie, « Je tape d\'ici » mesure tes coups : dès 3 coups, la moyenne remplace ta saisie.</p>' +
      '<div class="card">' + rows + "</div>");
    $$(".club").forEach(function (row) { row.addEventListener("click", function () { clubSheet(clubById(row.getAttribute("data-id"))); }); });
    on("clAdd", "click", function () { clubSheet(null); });
  }
  function clubSheet(c) {
    var isNew = !c;
    c = c || { id: "c_" + Date.now().toString(36), name: "", manual: null };
    var st = clubStats(c.id);
    openSheet("<h3>" + (isNew ? "Nouveau club" : esc(c.name)) + "</h3>" +
      '<div class="field"><label>Nom</label><input class="input" id="cN" value="' + esc(c.name) + '" placeholder="Ex. Hybride 4" /></div>' +
      (c.putter ? "" : '<div class="field"><label>Ma distance (mètres)</label><input class="input" id="cD" type="number" inputmode="numeric" value="' + (c.manual || "") + '" /></div>') +
      (st.n ? '<p>' + st.n + " coups mesurés, moyenne " + (st.avg || "—") + " m.</p>" : "") +
      '<button class="btn" id="cSave">Enregistrer</button>' +
      (st.n ? '<button class="btn ghost" id="cReset">Effacer les coups mesurés</button>' : "") +
      (!isNew ? '<button class="btn danger" id="cDel">Retirer ce club du sac</button>' : ""), function () {
      on("cSave", "click", function () {
        var n = $("#cN").value.trim();
        if (!n) return;
        c.name = n;
        if ($("#cD")) { var d = parseInt($("#cD").value, 10); c.manual = isNaN(d) ? null : d; }
        if (isNew) clubs.list.push(c);
        clubs.list.sort(function (a, b) { if (a.putter) return 1; if (b.putter) return -1; return (clubDistance(b).d || 0) - (clubDistance(a).d || 0); });
        persist("clubs"); closeSheet(); show(current);
      });
      on("cReset", "click", function () { delete clubs.shots[c.id]; persist("clubs"); closeSheet(); show(current); });
      on("cDel", "click", function () { clubs.list = clubs.list.filter(function (x) { return x.id !== c.id; }); persist("clubs"); closeSheet(); show(current); });
    });
  }

  // =====================================================================
  // Carnet de parcours
  // =====================================================================
  VIEWS.carnet = function () {
    var list = COURSE_IDS.map(function (id) {
      var c = COURSES[id];
      var nNotes = notes[id] ? Object.keys(notes[id]).filter(function (k) { return notes[id][k]; }).length : 0;
      var nDef = allKeys(id).filter(function (k) { return defaultNote(id, k); }).length;
      var placed = allKeys(id).filter(function (k) { return holeGeo(id, k).c; }).length;
      var total = allKeys(id).length;
      return '<button class="list-btn" data-go="course" data-p=\'{"id":"' + esc(id) + '"}\'><span class="ic">' + ic("flag") + '</span><span><span class="t">' + esc(c.name) +
        '</span><span class="s">' + (c.loops ? "3 boucles · " : total + " trous · ") + (Math.max(nNotes, nDef) ? Math.max(nNotes, nDef) + " notes · " : "") +
        (placed === total ? "carte GPS complète" : placed + "/" + total + " greens placés") + '</span></span><span class="go">' + ic("next") + "</span></button>";
    }).join("");
    page(topbar("Carnet de parcours") + '<p class="lead">Tes parcours et tes notes trou par trou.</p>' + list +
      '<div class="card" style="margin-top:6px"><h2>Ajouter un parcours</h2>' +
      '<button class="btn ghost" data-go="osm">' + ic("map") + "Depuis la carte (OpenStreetMap)</button>" +
      '<button class="btn ghost" id="kFile">' + ic("upload") + "Fichier reçu d'un ami</button>" +
      '<button class="btn ghost" id="kNew">' + ic("edit") + "Créer à la main</button>" +
      '<input type="file" id="kInput" accept="application/json,.json" hidden /></div>');
    on("kFile", "click", function () { $("#kInput").click(); });
    on("kInput", "change", function (e) {
      readJsonFile(e.target, function (d) {
        if (d.app !== "carnet-golf" || d.type !== "course") { toast("Ce fichier n'est pas un parcours du carnet"); return; }
        importCourseData(d);
      });
    });
    on("kNew", "click", function () {
      var hs = []; for (var k = 0; k < 18; k++) hs.push({ p: 4, i: null });
      openEditor({ id: null, name: "", hcp: 16, holes: hs });
    });
  };

  VIEWS.course = function (prm) {
    var id = prm.id, c = COURSES[id];
    if (!c) { go("carnet", {}, true); return; }
    var groups = [];
    if (c.loops) Object.keys(c.loops).forEach(function (l) {
      groups.push({ title: c.loops[l].name, holes: c.loops[l].holes.map(function (h, n) { return { key: l + "-" + (n + 1), num: n + 1, p: h.p, i: h.r ? "rang " + h.r : "" }; }) });
    });
    else groups.push({ title: "", holes: c.holes.map(function (h, k) { return { key: k, num: k + 1, p: h.p, i: h.i ? "index " + h.i : "" }; }) });
    var html = groups.map(function (g) {
      return '<div class="card">' + (g.title ? "<h2>" + esc(g.title) + "</h2>" : "") + g.holes.map(function (h) {
        return '<div class="note-hole"><div class="h"><b>Trou ' + h.num + '</b><span>Par ' + h.p + (h.i ? " · " + h.i : "") + "</span></div>" +
          '<textarea class="input" data-k="' + h.key + '" placeholder="Ta note : danger, club, plan de jeu…">' + esc(getNote(id, h.key)) + "</textarea></div>";
      }).join("") + "</div>";
    }).join("");
    var isUser = !!userCourses[id];
    page(topbar(c.short, '<button class="icon-btn" id="coMenu" aria-label="Options">' + ic("list") + "</button>") +
      '<p class="lead">' + esc(c.name) + (c.hcpNote ? " · " + esc(c.hcpNote) : "") + "</p>" + html);
    $$("textarea[data-k]").forEach(function (t) {
      t.addEventListener("input", function () {
        notes[id] = notes[id] || {};
        notes[id][t.getAttribute("data-k")] = t.value;
        persist("notes");
      });
    });
    on("coMenu", "click", function () {
      openSheet("<h3>" + esc(c.name) + '</h3><p>Partage-le à un ami : il recevra les pars, les points GPS et tes notes.</p>' +
        '<button class="btn ghost" id="coShare">' + ic("share") + "Partager ce parcours</button>" +
        (isUser ? '<button class="btn ghost" id="coEdit">' + ic("edit") + "Modifier pars et index</button>" : "") +
        (isUser ? '<button class="btn danger" id="coDel">' + ic("trash") + "Supprimer ce parcours</button>" : ""), function () {
        on("coShare", "click", function () { closeSheet(); shareFile("parcours-" + String(id).replace(/^u_/, "") + ".json", courseExport(id), c.name); });
        on("coEdit", "click", function () {
          closeSheet();
          openEditor({ id: id, name: c.name, hcp: c.tees[0].hcp, center: c.center, holes: c.holes.map(function (h) { return { p: h.p, i: h.i }; }) });
        });
        on("coDel", "click", function () {
          confirmSheet("Supprimer " + c.name + " ?", "Ses points sur la carte et ses notes seront effacés. Tes parties restent dans l'historique.", "Supprimer", function () {
            delete userCourses[id]; delete geoOver[id]; delete notes[id];
            persist("courses"); persist("geo"); persist("notes");
            if (round && round.course.id === id) { round = null; persist("round"); }
            go("carnet", {}, true);
          }, true);
        });
      });
    });
  };

  function courseExport(cid) {
    var c = COURSES[cid], geo = {};
    allKeys(cid).forEach(function (k) { var g = holeGeo(cid, k); if (Object.keys(g).length) geo[k] = g; });
    return {
      app: "carnet-golf", type: "course", version: 2, id: cid,
      course: { name: c.name, short: c.short, center: c.center || null, tees: c.tees, hcpNote: c.hcpNote || "",
        holes: c.holes ? c.holes.map(function (h) { return { p: h.p, i: h.i || null }; }) : null },
      geo: geo, notes: notes[cid] || {}
    };
  }
  function slug(s) {
    return "u_" + s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
  }
  function shortName(name) {
    return name.replace(/^(golf club|golf)\s+(de la |de l'|du |des |de |d')?/i, "").trim() || name;
  }
  function importCourseData(data) {
    var c = data.course;
    if (!c || (!BUILTIN[data.id] && (!Array.isArray(c.holes) || (c.holes.length !== 18 && c.holes.length !== 9)))) { toast("Parcours incomplet"); return; }
    var id = BUILTIN[data.id] ? data.id : (data.id && String(data.id).indexOf("u_") === 0 ? data.id : slug(c.name));
    var doIt = function () {
      if (!BUILTIN[id]) {
        userCourses[id] = { name: c.name, short: c.short || shortName(c.name), user: true, center: c.center || null,
          tees: [{ id: "std", label: "Habituels", hcp: (c.tees && c.tees[0] && c.tees[0].hcp) || 16 }], hcpNote: "",
          holes: c.holes.map(function (h) { return { p: h.p, i: h.i || null }; }) };
        persist("courses");
      }
      if (data.geo) { geoOver[id] = Object.assign({}, geoOver[id] || {}, data.geo); persist("geo"); }
      if (data.notes && Object.keys(data.notes).length) { notes[id] = Object.assign({}, notes[id] || {}, data.notes); persist("notes"); }
      toast("Parcours " + c.name + " importé");
      go("course", { id: id }, true);
    };
    if (BUILTIN[id]) confirmSheet("Mettre à jour " + BUILTIN[id].short + " ?", "Les points GPS et notes reçus seront ajoutés aux tiens.", "Mettre à jour", doIt);
    else if (userCourses[id]) confirmSheet("Remplacer " + c.name + " ?", "Ce parcours existe déjà dans ton carnet.", "Remplacer", doIt);
    else doIt();
  }

  // ---------- Éditeur de parcours ----------
  var ce = null;
  function openEditor(data) { ce = data; go("editor"); }
  VIEWS.editor = function () {
    if (!ce) { go("carnet", {}, true); return; }
    var isEdit = ce.id && userCourses[ce.id];
    var rows = ce.holes.map(function (h, k) {
      return '<div class="hole-edit"><span class="n num">' + (k + 1) + '</span><div class="chips">' + [3, 4, 5].map(function (p) {
        return '<button class="chip ' + (h.p === p ? "on" : "") + '" data-h="' + k + '" data-p="' + p + '">' + p + "</button>";
      }).join("") + '</div><input class="input num" type="number" inputmode="numeric" min="1" max="' + ce.holes.length + '" data-i="' + k + '" value="' + (h.i || "") + '" placeholder="idx" /></div>';
    }).join("");
    var par = ce.holes.reduce(function (s, h) { return s + h.p; }, 0);
    page(topbar(isEdit ? "Modifier le parcours" : "Nouveau parcours") +
      '<div class="card"><div class="field"><label>Nom</label><input class="input" id="eN" value="' + esc(ce.name) + '" placeholder="Ex. Golf du Sart" /></div>' +
      '<div class="field"><label>Nombre de trous</label><div class="seg" id="eCount"><button data-v="9" class="' + (ce.holes.length === 9 ? "on" : "") + '">9 trous</button><button data-v="18" class="' + (ce.holes.length === 18 ? "on" : "") + '">18 trous</button></div></div>' +
      '<div class="line-row" style="padding-bottom:0;border:none"><div><div class="t">Ton handicap de jeu ici</div><div class="s">Modifiable à chaque partie</div></div><input class="input num" id="eH" type="number" inputmode="numeric" style="width:80px;text-align:center" value="' + (ce.hcp || 16) + '" /></div>' +
      (ce.note ? '<p class="muted small" style="margin:12px 0 0;line-height:1.45">' + esc(ce.note) + "</p>" : "") + "</div>" +
      '<div class="card"><h2>Par ' + par + " · par et index de chaque trou</h2>" + rows + '<div class="warn" id="eW"></div></div>' +
      '<button class="btn" id="eSave">Enregistrer le parcours</button>');
    function sync() { ce.name = $("#eN").value; ce.hcp = parseInt($("#eH").value, 10); }
    $$("#eCount button").forEach(function (b) {
      b.addEventListener("click", function () {
        sync();
        var v = +b.getAttribute("data-v");
        if (v === 9) ce.holes = ce.holes.slice(0, 9); else while (ce.holes.length < 18) ce.holes.push({ p: 4, i: null });
        show(current);
      });
    });
    $$(".hole-edit .chip").forEach(function (b) { b.addEventListener("click", function () { sync(); ce.holes[+b.getAttribute("data-h")].p = +b.getAttribute("data-p"); show(current); }); });
    $$("input[data-i]").forEach(function (inp) {
      inp.addEventListener("input", function () { ce.holes[+inp.getAttribute("data-i")].i = inp.value ? parseInt(inp.value, 10) : null; check(); });
    });
    function check() {
      var idx = ce.holes.map(function (h) { return h.i; }).filter(Boolean);
      var miss = ce.holes.length - idx.length;
      var dup = idx.filter(function (v, k) { return idx.indexOf(v) !== k; });
      $("#eW").textContent = dup.length ? "Index en double : " + dup.join(", ") : miss ? miss + " index manquant" + (miss > 1 ? "s" : "") + " : le stableford sera approximatif." : "";
    }
    check();
    on("eSave", "click", function () {
      sync();
      var name = (ce.name || "").trim();
      if (!name) { toast("Donne un nom au parcours"); return; }
      var id = ce.id || slug(name);
      if (!ce.id && (userCourses[id] || BUILTIN[id])) id += "-" + Date.now().toString(36).slice(-4);
      userCourses[id] = { name: name, short: shortName(name), user: true, tees: [{ id: "std", label: "Habituels", hcp: isNaN(ce.hcp) ? 16 : ce.hcp }], hcpNote: "",
        center: ce.center || (userCourses[id] && userCourses[id].center) || null, holes: ce.holes.map(function (h) { return { p: h.p, i: h.i || null }; }) };
      if (ce.geo) { geoOver[id] = Object.assign({}, geoOver[id] || {}, ce.geo); persist("geo"); }
      persist("courses");
      ce = null;
      toast("Parcours enregistré");
      go("course", { id: id }, true);
    });
  };

  // ---------- Import OpenStreetMap ----------
  var OVERPASS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter", "https://overpass.private.coffee/api/interpreter"];
  function overpass(q) {
    var i = 0;
    function attempt() {
      return fetch(OVERPASS[i % OVERPASS.length], { method: "POST", body: "data=" + encodeURIComponent(q), headers: { "Content-Type": "application/x-www-form-urlencoded" } })
        .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
        .catch(function (err) { i++; if (i < OVERPASS.length * 2) return new Promise(function (ok) { setTimeout(ok, 1500 * i); }).then(attempt); throw err; });
    }
    return attempt();
  }
  var osmPending = null;
  VIEWS.osm = function () {
    page(topbar("Importer un golf") + '<p class="lead">Beaucoup de golfs sont dessinés sur OpenStreetMap avec leurs trous et leurs greens. Sinon, tu placeras les points toi-même sur la carte.</p>' +
      '<div class="card"><button class="btn" id="oNear">' + ic("locate") + "Golfs autour de moi</button>" +
      '<div class="row" style="margin-top:10px"><input class="input" id="oQ" placeholder="Ou une ville (ex. Brignoles)" /><button class="btn ghost sm" id="oS" style="flex:0 0 auto">Chercher</button></div>' +
      '<p class="muted small" id="oSt" style="margin:12px 0 0"></p><div id="oRes"></div></div><div id="oLoops"></div>' +
      '<p class="muted small" style="text-align:center">Données © contributeurs OpenStreetMap (ODbL)</p>');
    on("oNear", "click", function () {
      $("#oSt").textContent = "Localisation…";
      oncePosition(function (pos) { if (pos) findGolfs(pos); else $("#oSt").textContent = "Position introuvable. Cherche plutôt par ville."; });
    });
    on("oS", "click", function () {
      var q = $("#oQ").value.trim();
      if (!q) return;
      $("#oSt").textContent = "Recherche de " + q + "…";
      nominatim(q).then(function (res) {
        if (!res.length) { $("#oSt").textContent = "Lieu introuvable."; return; }
        findGolfs([+res[0].lat, +res[0].lon]);
      }).catch(function () { $("#oSt").textContent = "Recherche impossible (pas de réseau ?)."; });
    });
  };
  function findGolfs(pos) {
    $("#oSt").textContent = "Recherche des golfs dans un rayon de 25 km… (jusqu'à 20 s)";
    $("#oRes").innerHTML = "";
    overpass('[out:json][timeout:40];nwr["leisure"="golf_course"](around:25000,' + pos[0] + "," + pos[1] + ");out tags center;").then(function (d) {
      var list = d.elements.filter(function (e) { return e.tags && e.tags.name; }).map(function (e) {
        var c = e.center || { lat: e.lat, lon: e.lon };
        return { type: e.type, id: e.id, name: e.tags.name, pos: [c.lat, c.lon], d: distM(pos, [c.lat, c.lon]) };
      }).sort(function (a, b) { return a.d - b.d; });
      if (!list.length) { $("#oSt").textContent = "Aucun golf trouvé autour."; return; }
      $("#oSt").textContent = "Choisis ton golf :";
      list.slice(0, 15).forEach(function (g) {
        var b = document.createElement("button");
        b.className = "result-btn";
        b.innerHTML = esc(g.name) + "<span>" + (g.d / 1000).toFixed(1) + " km</span>";
        b.addEventListener("click", function () { loadGolf(g); });
        $("#oRes").appendChild(b);
      });
    }).catch(function () { $("#oSt").textContent = "Le serveur de cartes ne répond pas, réessaie dans une minute."; });
  }
  function loadGolf(gc) {
    $("#oRes").innerHTML = "";
    $("#oSt").textContent = "Lecture des trous de " + gc.name + "…";
    var sel = (gc.type === "relation" ? "rel" : gc.type) + "(" + gc.id + ")";
    overpass("[out:json][timeout:60];" + sel + ";map_to_area->.a;" + '(way(area.a)["golf"="hole"];nwr(area.a)["golf"="green"];node(area.a)["golf"="pin"];);out tags geom;')
      .then(function (d) { parseGolf(gc, d); })
      .catch(function () { $("#oSt").textContent = "Le serveur de cartes ne répond pas, réessaie dans une minute."; });
  }
  function polyOf(e) {
    if (e.geometry) return e.geometry.map(function (p) { return [p.lat, p.lon]; });
    if (e.members) { var o = e.members.filter(function (m) { return m.role === "outer" && m.geometry; })[0]; if (o) return o.geometry.map(function (p) { return [p.lat, p.lon]; }); }
    return null;
  }
  function inPoly(pt, poly) {
    var x = pt[1], y = pt[0], ins = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][1], yi = poly[i][0], xj = poly[j][1], yj = poly[j][0];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) ins = !ins;
    }
    return ins;
  }
  function holeFromWay(line, greens, pins) {
    var tee = line[0], last = line[line.length - 1], pin = null, best = 25;
    pins.forEach(function (p) { var d = distM(last, p); if (d < best) { best = d; pin = p; } });
    var green = null;
    greens.forEach(function (poly) { if (!green && inPoly(pin || last, poly)) green = poly; });
    if (!green) {
      var bd = 40;
      greens.forEach(function (poly) {
        var cx = poly.reduce(function (s, p) { return [s[0] + p[0] / poly.length, s[1] + p[1] / poly.length]; }, [0, 0]);
        var d = distM(last, cx); if (d < bd) { bd = d; green = poly; }
      });
    }
    var c = pin || last, g = { tee: r6(tee) };
    var prev = line.length > 1 ? line[line.length - 2] : tee;
    var dir = toXY(prev, c), len = Math.hypot(dir[0], dir[1]) || 1, u = [dir[0] / len, dir[1] / len];
    if (green) {
      var gc = green.reduce(function (s, p) { return [s[0] + p[0] / green.length, s[1] + p[1] / green.length]; }, [0, 0]);
      if (!pin) c = gc;
      var mn = 0, mx = 0;
      green.forEach(function (p) {
        var v = toXY(c, p), proj = v[0] * u[0] + v[1] * u[1], lat = Math.abs(-v[0] * u[1] + v[1] * u[0]);
        if (lat < 6) { mn = Math.min(mn, proj); mx = Math.max(mx, proj); }
      });
      if (mn === 0 || mx === 0) green.forEach(function (p) { var v = toXY(c, p), proj = v[0] * u[0] + v[1] * u[1]; mn = Math.min(mn, proj); mx = Math.max(mx, proj); });
      g.c = r6(c); g.f = r6(fromXY(c, [u[0] * mn, u[1] * mn])); g.b = r6(fromXY(c, [u[0] * mx, u[1] * mx])); g.est = 0;
    } else {
      g.c = r6(c); g.f = r6(fromXY(c, [-u[0] * 12, -u[1] * 12])); g.b = r6(fromXY(c, [u[0] * 12, u[1] * 12])); g.est = 1;
    }
    return g;
  }
  function parseGolf(gc, d) {
    var greens = [], pins = [], holes = [];
    d.elements.forEach(function (e) {
      var t = e.tags || {};
      if (t.golf === "green") { var p = polyOf(e); if (p && p.length > 2) greens.push(p); }
      else if (t.golf === "pin") pins.push([e.lat, e.lon]);
      else if (t.golf === "hole" && e.geometry && e.geometry.length > 1) {
        var m = String(t.ref || t.name || "").match(/^(.*?)[\s\-–:#]*(\d+)\s*$/);
        if (!m) return;
        holes.push({ loop: m[1].trim(), n: parseInt(m[2], 10), par: parseInt(t.par, 10) || null, hcp: parseInt(t.handicap, 10) || null, line: e.geometry.map(function (p) { return [p.lat, p.lon]; }) });
      }
    });
    if (!holes.length) {
      $("#oSt").textContent = "Ce golf n'a pas de trous dessinés sur la carte. Crée-le à la main, puis place les greens pendant ta partie.";
      var b = document.createElement("button");
      b.className = "btn"; b.style.marginTop = "12px"; b.textContent = "Créer " + gc.name;
      b.addEventListener("click", function () { var hs = []; for (var k = 0; k < 18; k++) hs.push({ p: 4, i: null }); openEditor({ id: null, name: gc.name, hcp: 16, holes: hs, center: r6(gc.pos) }); });
      $("#oRes").appendChild(b);
      return;
    }
    var loops = {};
    holes.forEach(function (h) { (loops[h.loop] = loops[h.loop] || {})[h.n] = h; });
    var names = Object.keys(loops);
    var full = names.filter(function (k) { return Object.keys(loops[k]).length >= 18; });
    var nines = names.filter(function (k) { var n = Object.keys(loops[k]).length; return n >= 9 && n < 18; });
    osmPending = { gc: gc, greens: greens, pins: pins, loops: loops };
    if (full.length) buildFromOsm([[full[0], 1, 18]]);
    else if (nines.length >= 2) {
      $("#oSt").textContent = "";
      var outSel = nines[0], inSel = nines[1];
      var draw = function () {
        $("#oLoops").innerHTML = '<div class="card"><h3>Plusieurs boucles de 9 trous</h3><p class="muted small" style="margin:0 0 12px">Choisis l\'aller et le retour que tu joues.</p>' +
          '<div class="field"><label>Aller</label><div class="chips" id="olA">' + nines.map(function (n) { return '<button class="chip ' + (n === outSel ? "on" : "") + '" data-v="' + esc(n) + '">' + esc(n || "Sans nom") + "</button>"; }).join("") + "</div></div>" +
          '<div class="field"><label>Retour</label><div class="chips" id="olB">' + nines.map(function (n) { return '<button class="chip ' + (n === inSel ? "on" : "") + '" data-v="' + esc(n) + '">' + esc(n || "Sans nom") + "</button>"; }).join("") + "</div></div>" +
          '<button class="btn" id="olOk">Continuer</button></div>';
        $$("#olA .chip").forEach(function (b) { b.addEventListener("click", function () { outSel = b.getAttribute("data-v"); draw(); }); });
        $$("#olB .chip").forEach(function (b) { b.addEventListener("click", function () { inSel = b.getAttribute("data-v"); draw(); }); });
        on("olOk", "click", function () { buildFromOsm([[outSel, 1, 9], [inSel, 1, 9]]); });
      };
      draw();
    } else if (nines.length === 1) buildFromOsm([[nines[0], 1, 9]]);
    else $("#oSt").textContent = "Trous incomplets sur la carte (" + holes.length + " trouvés). Crée le parcours à la main.";
  }
  function buildFromOsm(segments) {
    var p = osmPending, hs = [], geo = {}, k = 0, missing = 0;
    segments.forEach(function (seg) {
      for (var n = seg[1]; n <= seg[2]; n++) {
        var h = p.loops[seg[0]][n];
        if (!h) { hs.push({ p: 4, i: null }); missing++; k++; continue; }
        var len = 0; for (var q = 1; q < h.line.length; q++) len += distM(h.line[q - 1], h.line[q]);
        hs.push({ p: h.par || (len < 230 ? 3 : (len > 430 ? 5 : 4)), i: h.hcp && h.hcp <= 18 ? h.hcp : null });
        geo[k] = holeFromWay(h.line, p.greens, p.pins);
        k++;
      }
    });
    var name = p.gc.name + (segments.length === 2 && segments[0][0] && segments[0][0] !== segments[1][0] ? " (" + segments[0][0] + " + " + segments[1][0] + ")" : "");
    openEditor({ id: null, name: name, hcp: 16, holes: hs, geo: geo, center: r6(p.gc.pos),
      note: (hs.length - missing) + " trous récupérés sur la carte. Vérifie les pars (devinés d'après la longueur s'ils manquent) et recopie les index de la carte de score." });
  }

  // =====================================================================
  // Statistiques
  // =====================================================================
  var statsF = { course: "all", type: "all", metric: "vspar" };
  function entryCourseId(r) {
    if (r.courseId) return r.courseId;
    for (var k = 0; k < COURSE_IDS.length; k++) {
      var c = COURSES[COURSE_IDS[k]];
      if (r.course && (r.course === c.name || r.course.toLowerCase().indexOf(c.short.toLowerCase()) >= 0)) return COURSE_IDS[k];
    }
    return r.course ? "other" : null;
  }
  function entryType(r) { return r.type || (r.countsForIndex ? "competition" : "entrainement"); }
  VIEWS.stats = function () {
    var all = history.map(function (r, idx) { return { r: r, idx: idx }; }).sort(function (a, b) { return new Date(a.r.date) - new Date(b.r.date); });
    var list = all.filter(function (x) {
      return (statsF.course === "all" || entryCourseId(x.r) === statsF.course) && (statsF.type === "all" || entryType(x.r) === statsF.type);
    });
    var rs = list.map(function (x) { return x.r; });
    var full = rs.filter(function (r) { return !r.holes || r.holes.length === 18; });
    function ratio(h, c) { var a = 0, b = 0; rs.forEach(function (r) { if (r[h] != null && r[c]) { a += r[h]; b += r[c]; } }); return b ? Math.round(a / b * 100) + "%" : "—"; }
    var scores = full.map(function (r) { return r.totalScore; }), vs = full.map(function (r) { return r.totalScore - r.totalPar; });
    var stb = full.filter(function (r) { return r.stablefordPoints != null; }).map(function (r) { return r.stablefordPoints; });
    var putts = full.filter(function (r) { return r.putts != null; }).map(function (r) { return r.putts; });
    var courseChips = [{ v: "all", l: "Tous" }].concat(COURSE_IDS.filter(function (id) { return history.some(function (r) { return entryCourseId(r) === id; }); })
      .map(function (id) { return { v: id, l: COURSES[id].short }; }));
    function chips(id, items, val) { return '<div class="chips" id="' + id + '">' + items.map(function (i) { return '<button class="chip ' + (i.v === val ? "on" : "") + '" data-v="' + esc(i.v) + '">' + esc(i.l) + "</button>"; }).join("") + "</div>"; }
    var fn = {
      vspar: function (r) { return (!r.holes || r.holes.length === 18) ? r.totalScore - r.totalPar : null; },
      stb: function (r) { return (!r.holes || r.holes.length === 18) && r.stablefordPoints != null ? r.stablefordPoints : null; },
      putts: function (r) { return (!r.holes || r.holes.length === 18) && r.putts != null ? r.putts : null; }
    }[statsF.metric];
    var pts = rs.map(function (r) { return { r: r, v: fn(r) }; }).filter(function (p) { return p.v != null; }).slice(-10);
    var chart = "";
    if (pts.length >= 2) {
      var vals = pts.map(function (p) { return p.v; }), lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), base = Math.min(0, lo);
      chart = '<div class="bars">' + pts.map(function (p, k) {
        var h = hi === base ? 60 : 12 + 78 * (p.v - base) / (hi - base);
        return '<div class="bar-col"><div class="bar-v num">' + (statsF.metric === "vspar" ? signed(p.v) : p.v) + '</div><div class="bar ' + (k === pts.length - 1 ? "last" : "") +
          '" style="height:' + h + '%"></div><div class="bar-x">' + fmtShort(p.r.date) + "</div></div>";
      }).join("") + '</div><p class="muted small" style="margin:10px 0 0">' + (statsF.metric === "stb" ? "Plus c'est haut, mieux c'est." : "Plus c'est bas, mieux c'est.") + " La plus récente en vert.</p>";
    } else chart = '<div class="empty">' + (pts.length ? "La courbe apparaîtra dès ta deuxième partie de 18 trous." : "Pas encore de partie de 18 trous ici.") + "</div>";
    var hist = list.slice().reverse().map(function (x) {
      var r = x.r;
      return '<div class="hist"><div class="top"><span>' + esc(fmtDate(r.date)) + '</span><span class="num">' + r.totalScore + " (" + signed(r.totalScore - r.totalPar) + ")</span></div>" +
        '<div class="muted small" style="font-weight:600;margin-top:3px">' + esc(r.course || "Sans parcours") + "</div>" +
        '<div class="sub"><span><span class="pill ' + (entryType(r) === "competition" ? "gold" : "") + '">' + (entryType(r) === "competition" ? "Compétition" : "Entraînement") + "</span>" +
        (r.holes && r.holes.length !== 18 ? '<span class="pill">' + r.holes.length + " trous</span>" : "") +
        (r.stablefordPoints != null ? r.stablefordPoints + " pts" : "") + (r.putts != null ? " · " + r.putts + " putts" : "") + '</span><button class="link" data-del="' + x.idx + '">Supprimer</button></div></div>';
    }).join("");
    page(topbar("Statistiques") +
      '<div class="card">' + chips("fType", [{ v: "all", l: "Toutes" }, { v: "competition", l: "Compétitions" }, { v: "entrainement", l: "Entraînements" }], statsF.type) +
      '<div class="spacer"></div><div class="spacer"></div>' + chips("fCourse", courseChips, statsF.course) + "</div>" +
      '<div class="card"><div class="stat-grid">' +
      stat(rs.length, "Parties") +
      stat(scores.length ? r1(avg(scores)) : "—", "Score moyen", vs.length ? "(" + signed(Math.round(avg(vs))) + ")" : "") +
      stat(scores.length ? Math.min.apply(null, scores) : "—", "Meilleur score") +
      stat(stb.length ? r1(avg(stb)) : "—", "Stableford moyen", stb.length ? "(max " + Math.max.apply(null, stb) + ")" : "") +
      stat(putts.length ? r1(avg(putts)) : "—", "Putts / partie") +
      stat(ratio("fwHit", "fwCount"), "Fairways") +
      stat(ratio("girHit", "girCount"), "Greens en régul.") +
      stat(ratio("udHit", "udCount"), "Up & down") +
      "</div></div>" +
      '<div class="card"><h2>Évolution</h2>' + chips("fMetric", [{ v: "vspar", l: "Vs par" }, { v: "stb", l: "Stableford" }, { v: "putts", l: "Putts" }], statsF.metric) +
      '<div class="spacer"></div><div class="spacer"></div>' + chart + "</div>" +
      '<div class="card"><h2>Historique</h2>' + (hist || '<div class="empty">Aucune partie pour l\'instant.</div>') + "</div>" +
      '<button class="btn ghost" data-go="addround">' + ic("plus") + "Ajouter une partie jouée (carte papier)</button>");
    [["fType", "type"], ["fCourse", "course"], ["fMetric", "metric"]].forEach(function (x) {
      $$("#" + x[0] + " .chip").forEach(function (b) { b.addEventListener("click", function () { statsF[x[1]] = b.getAttribute("data-v"); show(current); }); });
    });
    $$("[data-del]").forEach(function (b) {
      b.addEventListener("click", function () {
        var i = +b.getAttribute("data-del");
        confirmSheet("Supprimer cette partie ?", fmtDate(history[i].date) + " · " + (history[i].course || ""), "Supprimer", function () { history.splice(i, 1); persist("history"); show(current); }, true);
      });
    });
  };

  // ---------- Saisie d'une partie passée ----------
  var addF = { type: "competition", format: "stableford" };
  VIEWS.addround = function () {
    function seg(id, items, val) { return '<div class="seg" id="' + id + '">' + items.map(function (i) { return '<button data-v="' + i.v + '" class="' + (i.v === val ? "on" : "") + '">' + i.l + "</button>"; }).join("") + "</div>"; }
    function pair(id, label) {
      return '<div class="line-row"><span class="t">' + label + '</span><span class="row" style="flex:0 0 auto;align-items:center;gap:6px"><input class="input num" id="' + id + 'H" type="number" inputmode="numeric" style="width:64px;text-align:center" />' +
        '<b class="muted">/</b><input class="input num" id="' + id + 'C" type="number" inputmode="numeric" style="width:64px;text-align:center" /></span></div>';
    }
    page(topbar("Partie jouée") + '<p class="lead">Pour ajouter une partie notée sur une carte papier.</p>' +
      '<div class="card"><div class="field"><label>Parcours</label><input class="input" id="aC" placeholder="Ex. Golf de Mérignies" /></div>' +
      '<div class="field"><label>Date</label><input class="input" id="aD" type="date" value="' + new Date().toISOString().slice(0, 10) + '" /></div>' +
      '<div class="field"><label>Type</label>' + seg("aT", [{ v: "entrainement", l: "Entraînement" }, { v: "competition", l: "Compétition" }], addF.type) + "</div>" +
      '<div class="field" style="margin-bottom:0"><label>Formule</label>' + seg("aF", [{ v: "stroke", l: "Stroke play" }, { v: "stableford", l: "Stableford" }], addF.format) + "</div></div>" +
      '<div class="card"><h2>Trou par trou</h2><p class="muted small" style="margin:0 0 10px">Format « trou: score/par », ex. 1: 4/4 2: 5/4 3: 3/3</p>' +
      '<textarea class="input" id="aH" placeholder="1: 4/4  2: 5/4  3: 3/3 …"></textarea><p class="muted small" id="aP" style="margin:8px 0 0"></p></div>' +
      '<div class="card"><h2>Statistiques (facultatif)</h2>' +
      '<div class="line-row"><span class="t">Putts au total</span><input class="input num" id="aPu" type="number" inputmode="numeric" style="width:80px;text-align:center" /></div>' +
      pair("aFw", "Fairways touchés") + pair("aGir", "Greens en régul.") + pair("aUd", "Up & down") +
      '<div class="line-row"><span class="t">Points stableford</span><input class="input num" id="aSt" type="number" inputmode="numeric" style="width:80px;text-align:center" /></div></div>' +
      '<button class="btn" id="aSave">Enregistrer la partie</button>');
    [["aT", "type"], ["aF", "format"]].forEach(function (x) {
      $$("#" + x[0] + " button").forEach(function (b) { b.addEventListener("click", function () { addF[x[1]] = b.getAttribute("data-v"); $$("#" + x[0] + " button").forEach(function (y) { y.classList.toggle("on", y === b); }); }); });
    });
    function parse() {
      var re = /(\d+)\s*:\s*(\d+)\s*\/\s*(\d+)/g, out = [], m;
      while ((m = re.exec($("#aH").value)) !== null) out.push({ hole: +m[1], score: +m[2], par: +m[3] });
      out.sort(function (a, b) { return a.hole - b.hole; });
      return out;
    }
    on("aH", "input", function () {
      var h = parse();
      if (!h.length) { $("#aP").textContent = ""; return; }
      var s = h.reduce(function (a, x) { return a + x.score; }, 0), p = h.reduce(function (a, x) { return a + x.par; }, 0);
      $("#aP").textContent = h.length + " trous reconnus · " + s + " coups, par " + p + " (" + signed(s - p) + ")";
    });
    function num(id) { var e = $("#" + id); return e && e.value !== "" ? parseInt(e.value, 10) : null; }
    on("aSave", "click", function () {
      var h = parse();
      if (!h.length) { toast("Renseigne le détail trou par trou"); return; }
      var d = $("#aD").value;
      if (!d) { toast("Renseigne la date"); return; }
      var s = h.reduce(function (a, x) { return a + x.score; }, 0), p = h.reduce(function (a, x) { return a + x.par; }, 0);
      var e = { date: new Date(d + "T12:00:00").toISOString(), course: $("#aC").value.trim() || null, type: addF.type, format: addF.format,
        countsForIndex: addF.type === "competition", totalScore: s, totalPar: p, holes: h, putts: num("aPu"),
        avgPutts: num("aPu") != null ? (num("aPu") / h.length).toFixed(1) : null,
        fwHit: num("aFwH"), fwCount: num("aFwC"), girHit: num("aGirH"), girCount: num("aGirC"), udHit: num("aUdH"), udCount: num("aUdC"), stablefordPoints: num("aSt") };
      var cid = entryCourseId(e);
      if (cid && cid !== "other") e.courseId = cid;
      history.push(e);
      persist("history");
      toast("Partie enregistrée");
      go("stats", {}, true);
    });
  };

  // =====================================================================
  // Démarrage
  // =====================================================================
  var start = { name: "home", params: {} };
  history_replace(start);
  show(start);
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})();

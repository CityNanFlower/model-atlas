/* 模型星图 · 交互与视图 */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const FAV_KEY = 'model-atlas:favs:v1';
  const PREFS_KEY = 'model-atlas:prefs:v1';
  const DATA_CUTOFF = '2026-11-26';

  const SORTS = [
    { id: 'newest', label: '最新发布' },
    { id: 'oldest', label: '最早发布' },
    { id: 'name', label: '名称 A–Z' },
    { id: 'org', label: '机构 A–Z' },
    { id: 'domain', label: '按领域' }
  ];

  const PRECISION = {
    day: { label: '日级', desc: '公开资料可定位到具体日期。' },
    month: { label: '月级', desc: '公开资料只给出月份，档案不推测具体日期。' },
    year: { label: '仅年份', desc: '早期记录只能确认年份，档案不做月日推测。' }
  };

  const REGION_ORDER = ['美国', '中国', '英国', '加拿大', '法国', '德国', '以色列', '阿联酋', '日本', '澳大利亚', '瑞士', '跨国'];

  const UI_PATHS = {
    search: ['M10.8 18.2a7.4 7.4 0 1 1 5.2-2.2L21 21'],
    close: ['M6 6l12 12', 'M18 6L6 18'],
    grid: ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M13 13h7v7h-7z'],
    timeline: ['M6 4v16', 'M6 7h5', 'M6 12h8', 'M6 17h11'],
    org: ['M4 20V9h6v11', 'M10 20V4h10v16', 'M4 20h16'],
    sun: ['M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8', 'M12 2v2', 'M12 20v2', 'M4.9 4.9l1.4 1.4', 'M17.7 17.7l1.4 1.4', 'M2 12h2', 'M20 12h2', 'M4.9 19.1l1.4-1.4', 'M17.7 6.3l1.4-1.4'],
    moon: ['M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z'],
    auto: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18'],
    dice: ['M4 4h16v16H4z', 'M8 8h.01', 'M16 8h.01', 'M8 16h.01', 'M16 16h.01', 'M12 12h.01'],
    arrow: ['M5 12h14', 'M13 6l6 6-6 6'],
    check: ['M4 12l5 5L20 6'],
    plus: ['M12 5v14', 'M5 12h14'],
    reset: ['M4 4v6h6', 'M4.5 10a8 8 0 1 0 2.1-5.5L4 10'],
    starOutline: ['M12 2.8l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5L2.6 9.6l6.5-.9z']
  };

  function h(tag, opts = {}, children = []) {
    const node = document.createElement(tag);
    if (opts.class) node.className = opts.class;
    if (opts.text != null) node.textContent = opts.text;
    if (opts.attrs) {
      for (const [key, value] of Object.entries(opts.attrs)) {
        if (value !== false && value != null) node.setAttribute(key, String(value));
      }
    }
    if (opts.dataset) {
      for (const [key, value] of Object.entries(opts.dataset)) node.dataset[key] = String(value);
    }
    if (opts.style) Object.assign(node.style, opts.style);
    for (const child of [].concat(children)) {
      if (child == null) continue;
      node.append(child.nodeType ? child : document.createTextNode(String(child)));
    }
    return node;
  }

  function uiIcon(name, size = 18) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.8');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    for (const d of (UI_PATHS[name] || [])) {
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', d);
      svg.append(path);
    }
    if (name === 'auto') {
      const half = document.createElementNS(SVG_NS, 'path');
      half.setAttribute('d', 'M12 3a9 9 0 0 1 0 18z');
      half.setAttribute('fill', 'currentColor');
      half.setAttribute('stroke', 'none');
      svg.append(half);
    }
    return svg;
  }

  function starIcon(filled) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '19');
    svg.setAttribute('height', '19');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', 'M12 2.8l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5L2.6 9.6l6.5-.9z');
    path.setAttribute('stroke-linejoin', 'round');
    if (filled) {
      path.setAttribute('fill', 'currentColor');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '1');
    } else {
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '1.7');
    }
    svg.append(path);
    return svg;
  }

  /* ---------- 偏好与收藏 ---------- */
  function readStore(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }
  function writeStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* private mode */ }
  }

  const storedPrefs = readStore(PREFS_KEY, {});
  const prefs = {
    theme: ['auto', 'light', 'dark'].includes(storedPrefs.theme) ? storedPrefs.theme : 'auto',
    view: ['cards', 'timeline', 'org'].includes(storedPrefs.view) ? storedPrefs.view : 'cards'
  };
  const favArray = readStore(FAV_KEY, []);
  const favorites = new Set(Array.isArray(favArray) ? favArray.filter(x => typeof x === 'string') : []);

  /* ---------- 数据标准化 ---------- */
  const RAW_MODELS = [].concat(
    DATA_ORIGIN, DATA_LANGUAGE, DATA_MULTIMODAL, DATA_IMAGE, DATA_VIDEO,
    DATA_AUDIO, DATA_CODE, DATA_SCIENCE, DATA_3D, DATA_WORLD,
    DATA_EXPANSION_A, DATA_EXPANSION_B, DATA_MORE
  );

  const MODELS = RAW_MODELS.map((m, index) => {
    const vendor = VENDORS[m.org];
    const regions = m.region && m.region.length ? m.region : vendor.regions;
    const domain = DOMAIN_MAP[m.domain];
    const openness = OPENNESS_MAP[m.openness];
    const year = m.date.slice(0, 4);
    const precision = m.date.length === 10 ? 'day' : m.date.length === 7 ? 'month' : 'year';
    const modelLogo = m.org === 'xai' && (!m.logo || m.logo === 'xai') ? 'grok' : m.logo;
    const searchBlob = [
      m.name, vendor.name, vendor.en, vendor.short || '', m.desc, domain.label, openness.label,
      regions.join(' '), year, m.date, ...(m.aliases || [])
    ].join(' ').toLowerCase();
    return Object.assign({}, m, {
      logo: modelLogo,
      _vendor: vendor,
      _regions: regions,
      _domain: domain,
      _openness: openness,
      _year: year,
      _precision: precision,
      _no: String(index + 1).padStart(3, '0'),
      _search: searchBlob
    });
  });

  const MODEL_BY_ID = new Map(MODELS.map(m => [m.id, m]));
  const VENDOR_IDS = Object.keys(VENDORS);
  const VENDOR_WITH_ENTRIES = new Set(MODELS.map(m => m.org));
  const MIN_YEAR = Math.min(...MODELS.map(m => Number(m._year)));
  const MAX_YEAR = Math.max(...MODELS.map(m => Number(m._year)));
  const ALL_YEARS = [];
  for (let y = MAX_YEAR; y >= MIN_YEAR; y -= 1) ALL_YEARS.push(String(y));
  const ALL_REGIONS = REGION_ORDER.filter(r => MODELS.some(m => m._regions.includes(r)))
    .concat(
      Array.from(new Set(MODELS.flatMap(m => m._regions)))
        .filter(r => !REGION_ORDER.includes(r))
        .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
    );

  const state = {
    q: '',
    queryTokens: [],
    domains: new Set(),
    openness: '',
    region: '',
    year: '',
    vendor: '',
    sort: 'newest',
    favOnly: false,
    view: prefs.view,
    vendorExpanded: false
  };

  const dom = {};
  let chartHadInit = false;
  let focusKey = null;
  let modalOpener = null;
  let modalTimer = 0;
  let searchTimer = 0;
  let resizeTimer = 0;

  const iconCache = new Map();

  function iconNode(key) {
    if (!key || !ICONS[key]) return null;
    if (!iconCache.has(key)) {
      try {
        const doc = new DOMParser().parseFromString(ICONS[key], 'image/svg+xml');
        const svg = doc.documentElement;
        if (!svg || svg.nodeName.toLowerCase() !== 'svg' || doc.querySelector('parsererror')) {
          iconCache.set(key, null);
          return null;
        }
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        iconCache.set(key, svg);
      } catch (_) {
        iconCache.set(key, null);
        return null;
      }
    }
    const cached = iconCache.get(key);
    return cached ? cached.cloneNode(true) : null;
  }

  function initialOf(vendor) {
    const chars = Array.from(String(vendor.name || 'AI').replace(/[\s·/]/g, ''));
    return chars[0] || 'A';
  }

  function fallbackBadge(vendor) {
    const badge = h('span', { class: 'logo-fallback', text: initialOf(vendor) });
    badge.style.setProperty('--c1', vendor.color || '#444');
    badge.style.setProperty('--c2', '#1f2937');
    return badge;
  }

  function logoTile(key, vendor, sizeClass = '') {
    const tile = h('span', { class: `logo-tile ${sizeClass}`.trim() });
    tile.style.color = vendor.color || 'var(--ink)';
    const svg = iconNode(key);
    if (svg) tile.append(svg);
    else tile.append(fallbackBadge(vendor));
    return tile;
  }

  function modelLogoTile(m, sizeClass = '') {
    return logoTile(m.logo || m._vendor.icon, m._vendor, sizeClass);
  }
  function vendorLogoTile(vendor, sizeClass = '') {
    return logoTile(vendor.icon, vendor, sizeClass);
  }

  function fmtDate(m, long = false) {
    const [y, mo, d] = m.date.split('-');
    if (long) return `${y}年${mo ? `${Number(mo)}月` : ''}${d ? `${Number(d)}日` : ''}`;
    return `${y}${mo ? `.${mo}` : ''}${d ? `.${d}` : ''}`;
  }

  function monthDay(m) {
    if (m._precision === 'year') return '—';
    const parts = m.date.split('-');
    return parts[2] ? `${parts[1]}.${parts[2]}` : `${parts[1]}月`;
  }

  function compareDate(a, b) {
    return String(a.date).localeCompare(String(b.date));
  }

  function sortModels(list) {
    const sorted = list.slice();
    switch (state.sort) {
      case 'oldest':
        sorted.sort((a, b) => compareDate(a, b) || a.name.localeCompare(b.name, 'zh-Hans-CN'));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN') || compareDate(b, a));
        break;
      case 'org':
        sorted.sort((a, b) => a._vendor.name.localeCompare(b._vendor.name, 'zh-Hans-CN') || compareDate(b, a));
        break;
      case 'domain':
        sorted.sort((a, b) => {
          const ai = DOMAINS.findIndex(d => d.id === a.domain);
          const bi = DOMAINS.findIndex(d => d.id === b.domain);
          return ai - bi || compareDate(b, a);
        });
        break;
      default:
        sorted.sort((a, b) => compareDate(b, a) || a.name.localeCompare(b.name, 'zh-Hans-CN'));
    }
    return sorted;
  }

  function matches(m, exclude = '') {
    if (state.favOnly && !favorites.has(m.id)) return false;
    if (state.queryTokens.length) {
      for (const token of state.queryTokens) {
        if (!m._search.includes(token)) return false;
      }
    }
    if (exclude !== 'domain' && state.domains.size && !state.domains.has(m.domain)) return false;
    if (exclude !== 'openness' && state.openness && m.openness !== state.openness) return false;
    if (exclude !== 'region' && state.region && !m._regions.includes(state.region)) return false;
    if (exclude !== 'year' && state.year && m._year !== state.year) return false;
    if (exclude !== 'vendor' && state.vendor && m.org !== state.vendor) return false;
    return true;
  }

  function currentList() {
    return sortModels(MODELS.filter(m => matches(m)));
  }

  /* ---------- 徽章 ---------- */
  function domainBadge(m) {
    const badge = h('span', { class: 'badge badge-domain', attrs: { title: m._domain.desc } });
    const dot = h('i', { class: 'badge-dot' });
    dot.style.background = m._domain.color;
    badge.append(dot, document.createTextNode(m._domain.short));
    return badge;
  }

  function opennessBadge(m) {
    const badge = h('span', { class: `badge badge-open badge-${m.openness}`, text: m._openness.short, attrs: { title: m._openness.desc } });
    badge.style.setProperty('--oc', m._openness.color);
    return badge;
  }

  function verifiedBadge(m) {
    const badge = h('span', {
      class: `badge badge-verified ${m.verified ? 'is-verified' : 'is-unverified'}`,
      text: m.verified ? '✓ 已核验' : '未核验',
      attrs: {
        title: m.verified
          ? '发布日期已在构建期对照官方公告、论文或权威百科核验。'
          : '日期仅作编年参考，未逐条比对官方公告。'
      }
    });
    return badge;
  }

  function precisionBadge(m) {
    return h('span', {
      class: 'badge badge-precision',
      text: PRECISION[m._precision].label,
      attrs: { title: PRECISION[m._precision].desc }
    });
  }

  function starButton(m, extraClass = '', labelText = '') {
    const on = favorites.has(m.id);
    const btn = h('button', {
      class: `star-btn ${on ? 'is-fav' : ''} ${extraClass}`.trim(),
      attrs: {
        type: 'button',
        'aria-label': `${on ? '取消收藏' : '收藏'} ${m.name}`,
        'aria-pressed': on ? 'true' : 'false',
        title: on ? '取消收藏' : '收藏'
      },
      dataset: { favId: m.id }
    });
    btn.append(starIcon(on));
    if (labelText) btn.append(h('span', { class: 'modal-fav-label', text: on ? '已收藏' : '收藏' }));
    return btn;
  }

  /* ---------- 渲染：统计与筛选 ---------- */
  function renderStats() {
    dom.statModels.textContent = String(MODELS.length);
    dom.heroCount.textContent = String(MODELS.length);
    dom.statVendors.textContent = String(VENDOR_WITH_ENTRIES.size);
    dom.statSpan.textContent = `${MIN_YEAR}–${MAX_YEAR}`;
    dom.statFavs.textContent = String(favorites.size);
    dom.favCount.textContent = String(favorites.size);
    dom.favOnlyBtn.classList.toggle('is-active', state.favOnly);
    dom.favOnlyBtn.setAttribute('aria-pressed', state.favOnly ? 'true' : 'false');
    dom.favOnlyBtn.setAttribute('aria-label', `${state.favOnly ? '关闭' : '开启'}只看收藏，当前 ${favorites.size} 条`);
    dom.footerCount.textContent = `${MODELS.length} 条记录 · ${VENDOR_WITH_ENTRIES.size} 家机构 · ${DOMAINS.length} 个领域`;
  }

  function renderDomainChips() {
    const base = MODELS.filter(m => matches(m, 'domain'));
    const counts = new Map(DOMAINS.map(d => [d.id, base.filter(m => m.domain === d.id).length]));
    dom.domainChips.replaceChildren();
    const all = h('button', {
      class: `chip chip-all ${state.domains.size === 0 ? 'is-active' : ''}`,
      attrs: { type: 'button', 'aria-pressed': state.domains.size === 0 ? 'true' : 'false' },
      dataset: { focusKey: 'domain:all' }
    });
    all.append(h('span', { class: 'chip-all-mark' }), document.createTextNode('全部'), h('span', { class: 'chip-count', text: String(base.length) }));
    dom.domainChips.append(all);

    for (const d of DOMAINS) {
      const active = state.domains.has(d.id);
      const count = counts.get(d.id) || 0;
      const btn = h('button', {
        class: `chip ${active ? 'is-active' : ''} ${count === 0 ? 'is-zero' : ''}`,
        attrs: { type: 'button', 'aria-pressed': active ? 'true' : 'false', title: `${d.label} · ${count} 条` },
        dataset: { domain: d.id, focusKey: `domain:${d.id}` }
      });
      btn.style.setProperty('--d', d.color);
      const dot = h('i', { class: 'chip-dot' });
      dot.style.background = d.color;
      btn.append(dot, document.createTextNode(d.short), h('span', { class: 'chip-count', text: String(count) }));
      dom.domainChips.append(btn);
    }
  }

  function renderVendors() {
    const base = MODELS.filter(m => matches(m, 'vendor'));
    const counts = new Map();
    for (const m of base) counts.set(m.org, (counts.get(m.org) || 0) + 1);

    let entries = VENDOR_IDS.map(id => ({ id, vendor: VENDORS[id], count: counts.get(id) || 0 }));
    if (!state.vendorExpanded) entries = entries.filter(e => e.count > 0 || e.id === state.vendor);
    entries.sort((a, b) => b.count - a.count || a.vendor.name.localeCompare(b.vendor.name, 'zh-Hans-CN'));

    const science = entries.find(e => e.id === 'science');
    let rest = entries.filter(e => e.id !== 'science');
    if (state.vendor && state.vendor !== 'science') {
      const i = rest.findIndex(e => e.id === state.vendor);
      if (i > 0) rest.unshift(rest.splice(i, 1)[0]);
    }

    const isMobile = window.matchMedia('(max-width: 680px)').matches;
    let visible;
    if (state.vendorExpanded) {
      visible = rest.concat(science ? [science] : []);
    } else {
      const limit = isMobile ? 12 : 20;
      const slots = Math.max(1, limit - (science ? 1 : 0));
      visible = rest.slice(0, slots);
      if (state.vendor && state.vendor !== 'science') {
        const selected = rest.find(e => e.id === state.vendor);
        if (selected && !visible.includes(selected)) {
          if (visible.length >= slots) visible.pop();
          visible.push(selected);
        }
      }
      if (science) visible.push(science);
    }

    dom.vendorGrid.replaceChildren();
    const all = h('button', {
      class: `vendor-btn vendor-all ${state.vendor ? '' : 'is-active'}`,
      attrs: { type: 'button', 'aria-pressed': state.vendor ? 'false' : 'true', title: '全部厂商' },
      dataset: { vendor: '__all__', focusKey: 'vendor:all' }
    });
    const allMark = h('span', { class: 'vendor-logo vendor-all-mark' });
    allMark.append(h('i'), h('i'), h('i'), h('i'));
    all.append(allMark, h('span', { class: 'vendor-name', text: '全部' }), h('span', { class: 'vendor-count', text: String(base.length) }));
    dom.vendorGrid.append(all);

    for (const entry of visible) {
      const active = state.vendor === entry.id;
      const btn = h('button', {
        class: `vendor-btn ${active ? 'is-active' : ''} ${entry.count === 0 ? 'is-zero' : ''}`,
        attrs: {
          type: 'button',
          'aria-pressed': active ? 'true' : 'false',
          title: `${entry.vendor.name} · ${entry.count} 条`
        },
        dataset: { vendor: entry.id, focusKey: `vendor:${entry.id}` }
      });
      btn.append(vendorLogoTile(entry.vendor), h('span', { class: 'vendor-name', text: entry.vendor.name }), h('span', { class: 'vendor-count', text: String(entry.count) }));
      dom.vendorGrid.append(btn);
    }

    if (state.vendorExpanded || VENDOR_IDS.length > visible.length) {
      dom.vendorGrid.append(
        h('button', {
          class: 'vendor-toggle',
          attrs: { type: 'button', 'aria-expanded': state.vendorExpanded ? 'true' : 'false' },
          dataset: { focusKey: 'vendor:toggle' }
        }, state.vendorExpanded ? '收起厂商' : `展开全部 ${VENDOR_IDS.length} 家`)
      );
    }

    dom.vendorHint.textContent = `按当前条件计数 · 显示 ${Math.min(entries.length, visible.length)} / ${VENDOR_WITH_ENTRIES.size} 家`;
  }

  function renderSelects() {
    const openBase = MODELS.filter(m => matches(m, 'openness'));
    dom.opennessSel.options[0].textContent = `全部开放程度 (${openBase.length})`;
    OPENNESS.forEach((o, i) => {
      const count = openBase.filter(m => m.openness === o.id).length;
      dom.opennessSel.options[i + 1].textContent = `${o.label} (${count})`;
    });
    dom.opennessSel.value = state.openness;

    const regionBase = MODELS.filter(m => matches(m, 'region'));
    dom.regionSel.options[0].textContent = `全部地区 (${regionBase.length})`;
    ALL_REGIONS.forEach((r, i) => {
      const count = regionBase.filter(m => m._regions.includes(r)).length;
      dom.regionSel.options[i + 1].textContent = `${r} (${count})`;
    });
    dom.regionSel.value = state.region;

    const yearBase = MODELS.filter(m => matches(m, 'year'));
    dom.yearSel.options[0].textContent = `全部年份 (${yearBase.length})`;
    ALL_YEARS.forEach((y, i) => {
      const count = yearBase.filter(m => m._year === y).length;
      dom.yearSel.options[i + 1].textContent = `${y} (${count})`;
    });
    dom.yearSel.value = state.year;

    dom.sortSel.value = state.sort;
  }

  function renderActiveFilters() {
    const chips = [];
    if (state.q) chips.push({ type: 'q', value: '', label: `搜索「${state.q.length > 18 ? `${state.q.slice(0, 18)}…` : state.q}」` });
    if (state.favOnly) chips.push({ type: 'fav', value: '', label: '只看收藏' });
    for (const id of state.domains) {
      const d = DOMAIN_MAP[id];
      if (d) chips.push({ type: 'domain', value: id, label: d.label });
    }
    if (state.openness) chips.push({ type: 'openness', value: '', label: OPENNESS_MAP[state.openness].label });
    if (state.region) chips.push({ type: 'region', value: '', label: state.region });
    if (state.year) chips.push({ type: 'year', value: '', label: `${state.year} 年` });
    if (state.vendor) chips.push({ type: 'vendor', value: '', label: VENDORS[state.vendor].name });

    dom.activeFilters.replaceChildren();
    if (!chips.length) {
      dom.activeFilters.hidden = true;
      return;
    }
    dom.activeFilters.hidden = false;
    for (const chip of chips) {
      const btn = h('button', {
        class: 'filter-chip',
        attrs: { type: 'button', title: `移除筛选：${chip.label}` },
        dataset: { clear: chip.type, value: chip.value }
      });
      btn.append(document.createTextNode(chip.label), h('span', { class: 'filter-chip-x', text: '×', attrs: { 'aria-hidden': 'true' } }));
      dom.activeFilters.append(btn);
    }
    dom.activeFilters.append(
      h('button', { class: 'clear-all', attrs: { type: 'button' }, text: '清除全部' })
    );
  }

  function renderResults(list) {
    dom.viewRoot.replaceChildren();
    dom.viewSwitch.querySelectorAll('button').forEach(btn => {
      const active = btn.dataset.view === state.view;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (!list.length) {
      dom.emptyState.hidden = false;
      if (state.favOnly && favorites.size === 0) {
        dom.emptyTitle.textContent = '还没有收藏';
        dom.emptyText.textContent = '点击任意条目右上角的星标，建立你的私人档案。';
        dom.emptyReset.textContent = '去看全部条目';
      } else {
        dom.emptyTitle.textContent = '没有匹配的记录';
        dom.emptyText.textContent = '试试减少关键词、换一个年份，或清除部分筛选条件。';
        dom.emptyReset.textContent = '清除全部筛选';
      }
      return;
    }
    dom.emptyState.hidden = true;

    if (state.view === 'timeline') renderTimeline(list);
    else if (state.view === 'org') renderOrg(list);
    else renderCards(list);
  }

  function renderCards(list) {
    const grid = h('div', { class: 'cards' });
    const frag = document.createDocumentFragment();
    for (const m of list) {
      const card = h('article', {
        class: 'card',
        attrs: {
          tabindex: '0',
          role: 'button',
          'aria-label': `${m.name}，${m._vendor.name}，${fmtDate(m, true)}。打开详情`,
          'data-open-id': m.id
        }
      });
      card.style.setProperty('--d', m._domain.color);

      const head = h('div', { class: 'card-head' });
      head.append(modelLogoTile(m));
      const title = h('div', { class: 'card-title' });
      title.append(
        h('h3', { text: m.name }),
        h('p', { text: `${m._vendor.name} · ${m._regions.join(' / ')}` })
      );
      head.append(title);

      const dateRow = h('div', { class: 'card-date' });
      dateRow.append(h('span', { text: fmtDate(m) }), precisionBadge(m));

      const foot = h('div', { class: 'card-foot' });
      foot.append(domainBadge(m), opennessBadge(m), verifiedBadge(m));

      card.append(head, dateRow, h('p', { class: 'card-desc', text: m.desc }), foot, starButton(m), h('span', { class: 'card-no', text: `NO. ${m._no}` }));
      frag.append(card);
    }
    grid.append(frag);
    dom.viewRoot.append(grid);
  }

  function renderTimeline(list) {
    const groups = new Map();
    for (const m of list) {
      if (!groups.has(m._year)) groups.set(m._year, []);
      groups.get(m._year).push(m);
    }
    const years = Array.from(groups.keys()).sort((a, b) => state.sort === 'oldest' ? Number(a) - Number(b) : Number(b) - Number(a));
    const timeline = h('div', { class: 'timeline' });

    for (const year of years) {
      const items = groups.get(year).slice().sort((a, b) => state.sort === 'oldest' ? compareDate(a, b) : compareDate(b, a));
      const section = h('section', { class: 'tl-group', attrs: { 'aria-label': `${year} 年` } });
      const yearHead = h('div', { class: 'tl-year', attrs: { id: `year-${year}` } });
      yearHead.append(h('b', { text: year }), h('span', { text: `${items.length} 条发布` }));
      section.append(yearHead);
      const wrap = h('div', { class: 'tl-items' });

      for (const m of items) {
        const row = h('article', {
          class: 'tl-item',
          attrs: {
            tabindex: '0',
            role: 'button',
            'aria-label': `${m.name}，${fmtDate(m, true)}。打开详情`,
            'data-open-id': m.id
          }
        });
        row.style.setProperty('--d', m._domain.color);
        const date = h('div', { class: 'tl-date', text: monthDay(m) });
        const body = h('div', { class: 'tl-body' });
        const top = h('div', { class: 'tl-top' });
        const titleWrap = h('div', { class: 'tl-title' });
        titleWrap.append(
          h('h4', { text: m.name }),
          h('p', { text: `${m._vendor.name} · ${m._regions.join(' / ')}` })
        );
        top.append(modelLogoTile(m, 'sm'), titleWrap, starButton(m, 'star-sm'));
        const badges = h('div', { class: 'tl-badges' });
        badges.append(domainBadge(m), opennessBadge(m), verifiedBadge(m));
        body.append(top, h('p', { class: 'tl-desc', text: m.desc }), badges);
        row.append(date, body);
        wrap.append(row);
      }
      section.append(wrap);
      timeline.append(section);
    }
    dom.viewRoot.append(timeline);
  }

  function renderOrg(list) {
    const groups = new Map();
    for (const m of list) {
      if (!groups.has(m.org)) groups.set(m.org, { vendor: m._vendor, items: [] });
      groups.get(m.org).items.push(m);
    }
    let entries = Array.from(groups.entries()).map(([id, g]) => ({ id, ...g }));
    if (state.sort === 'org') entries.sort((a, b) => a.vendor.name.localeCompare(b.vendor.name, 'zh-Hans-CN'));
    else entries.sort((a, b) => b.items.length - a.items.length || a.vendor.name.localeCompare(b.vendor.name, 'zh-Hans-CN'));

    const root = h('div', { class: 'org-view' });
    for (const group of entries) {
      const section = h('section', { class: 'org-group' });
      const head = h('header', { class: 'org-head' });
      head.append(vendorLogoTile(group.vendor, 'sm'));
      const info = h('div', { class: 'org-info' });
      info.append(
        h('h3', { text: group.vendor.name }),
        h('p', { text: `${group.vendor.en} · ${group.vendor.regions.join(' / ')}` })
      );
      head.append(info, h('span', { class: 'org-count', text: `${group.items.length} 条` }));
      const filterBtn = h('button', {
        class: 'org-filter',
        attrs: { type: 'button', title: `只看 ${group.vendor.name}` },
        dataset: { vendorFilter: group.id }
      });
      filterBtn.append(uiIcon('arrow', 14), document.createTextNode('只看'));
      head.append(filterBtn);
      section.append(head);

      const rows = h('div', { class: 'org-list' });
      const items = group.items.slice().sort((a, b) => state.sort === 'oldest' ? compareDate(a, b) : compareDate(b, a));
      for (const m of items) {
        const row = h('article', {
          class: 'org-row',
          attrs: {
            tabindex: '0',
            role: 'button',
            'aria-label': `${m.name}，${m._vendor.name}，${fmtDate(m, true)}。打开详情`,
            'data-open-id': m.id
          }
        });
        row.style.setProperty('--d', m._domain.color);
        const main = h('div', { class: 'org-main' });
        const dot = h('i', { class: 'org-dot' });
        dot.style.background = m._domain.color;
        main.append(dot, h('b', { text: m.name }), h('span', { class: 'org-domain', text: m._domain.short }));
        row.append(h('span', { class: 'org-date', text: fmtDate(m) }), modelLogoTile(m, 'xs'), main, starButton(m, 'star-xs'));
        rows.append(row);
      }
      section.append(rows);
      root.append(section);
    }
    dom.viewRoot.append(root);
  }

  /* ---------- 年度趋势 ---------- */
  function yearStats() {
    const src = MODELS.filter(m => matches(m, 'year'));
    const map = new Map();
    for (const m of src) {
      if (!map.has(m._year)) map.set(m._year, { count: 0, domains: new Map() });
      const entry = map.get(m._year);
      entry.count += 1;
      entry.domains.set(m.domain, (entry.domains.get(m.domain) || 0) + 1);
    }
    return { src, map };
  }

  function updateChartNav() {
    if (!dom.chartPrev || !dom.chartNext) return;
    const atStart = dom.chartScroll.scrollLeft <= 4;
    const atEnd = dom.chartScroll.scrollLeft + dom.chartScroll.clientWidth >= dom.chartScroll.scrollWidth - 16;
    dom.chartPrev.disabled = atStart;
    dom.chartNext.disabled = atEnd;
  }

  function scrollChartTo(left, smooth = true) {
    dom.chartScroll.style.scrollBehavior = smooth ? 'smooth' : 'auto';
    dom.chartScroll.scrollLeft = left;
    if (!smooth) {
      requestAnimationFrame(() => {
        dom.chartScroll.style.scrollBehavior = '';
        updateChartNav();
      });
    } else {
      window.setTimeout(() => { dom.chartScroll.style.scrollBehavior = ''; updateChartNav(); }, 420);
    }
  }

  function renderChart() {
    const { src, map } = yearStats();
    const isMobile = window.matchMedia('(max-width: 680px)').matches;
    const years = Array.from(map.keys()).sort((a, b) => Number(a) - Number(b));
    const scrollWidth = Math.max(240, dom.chartScroll.clientWidth || 240);
    const padding = years.length <= 4 ? 24 : 36;
    const gap = isMobile ? 6 : 8;
    const minBar = isMobile ? 38 : 44;
    const maxBar = isMobile ? 120 : 220;
    const rawWidth = Math.floor((scrollWidth - padding - gap * Math.max(0, years.length - 1)) / Math.max(1, years.length));
    const barWidth = years.length ? Math.min(maxBar, Math.max(minBar, rawWidth)) : minBar;
    const contentWidth = years.length * barWidth + Math.max(0, years.length - 1) * gap;
    const chartWidth = Math.max(scrollWidth, contentWidth + padding);

    dom.chart.style.setProperty('--bar-w', `${barWidth}px`);
    dom.chart.style.gap = `${gap}px`;
    dom.chart.style.padding = `0 ${padding / 2}px`;
    dom.chart.style.width = `${chartWidth}px`;
    dom.chart.style.justifyContent = contentWidth + padding < scrollWidth ? 'center' : 'flex-start';

    if (!years.length) {
      dom.chart.replaceChildren(h('div', { class: 'chart-empty', text: '当前筛选下没有可绘制的发布年份' }));
      dom.chartTotal.textContent = '0 条 · 暂无发布年份';
      dom.chartTotal.setAttribute('title', '按当前搜索与筛选统计，不包含年份筛选。');
      dom.clearYear.hidden = !state.year;
      dom.clearYear.textContent = state.year ? `清除 ${state.year} 年` : '清除年份';
      requestAnimationFrame(updateChartNav);
      return;
    }

    const max = Math.max(1, ...Array.from(map.values(), v => v.count));
    const labelEvery = years.length <= 16 ? 1 : Math.ceil(years.length / 14);
    const fragment = document.createDocumentFragment();

    years.forEach((year, index) => {
      const entry = map.get(year);
      const active = state.year === year;
      const major = index % labelEvery === 0 || index === years.length - 1 || active;
      let color = 'var(--accent)';
      if (entry.domains.size) {
        const top = Array.from(entry.domains.entries()).sort((a, b) => b[1] - a[1])[0][0];
        color = DOMAIN_MAP[top] ? DOMAIN_MAP[top].color : color;
      }
      const slot = h('button', {
        class: `bar-slot ${active ? 'is-active' : ''}`,
        attrs: {
          type: 'button',
          'aria-label': `${year} 年，${entry.count} 条发布${active ? '，已筛选' : ''}`,
          'aria-pressed': active ? 'true' : 'false',
          title: `${year} · ${entry.count} 条`
        },
        dataset: { chartYear: year }
      });
      slot.style.setProperty('--c', color);
      const track = h('span', { class: 'bar-track' });
      const bar = h('span', { class: 'bar' });
      bar.style.height = `${Math.max(6, (entry.count / max) * 100)}%`;
      track.append(bar);
      const label = h('span', { class: 'bar-label', text: major ? year : '' });
      if (!major) label.style.visibility = 'hidden';
      slot.append(track, label);
      fragment.append(slot);
    });
    dom.chart.replaceChildren(fragment);

    let peakYear = '';
    let peakCount = 0;
    for (const [year, entry] of map.entries()) {
      if (entry.count > peakCount) { peakCount = entry.count; peakYear = year; }
    }
    dom.chartTotal.textContent = `${src.length} 条 · ${years.length} 个发布年份 · 峰值 ${peakCount}${peakYear ? `（${peakYear}）` : ''}`;
    dom.chartTotal.setAttribute('title', '按当前搜索与筛选统计，不包含年份筛选；只绘制有发布记录的年份。');
    dom.clearYear.hidden = !state.year;
    dom.clearYear.textContent = state.year ? `清除 ${state.year} 年` : '清除年份';

    const prev = dom.chartScroll.scrollLeft;
    const atEnd = prev + dom.chartScroll.clientWidth >= dom.chartScroll.scrollWidth - 12;
    dom.chartScroll.dataset.ready = '1';
    requestAnimationFrame(() => {
      if (state.year) {
        const activeBar = dom.chart.querySelector('.bar-slot.is-active');
        if (activeBar) scrollChartTo(activeBar.offsetLeft - dom.chartScroll.clientWidth / 2, false);
      } else if (!chartHadInit || atEnd) {
        scrollChartTo(dom.chartScroll.scrollWidth, false);
        chartHadInit = true;
      } else {
        scrollChartTo(prev, false);
      }
      updateChartNav();
    });
  }

  function showChartTip(slot, year) {
    const entry = yearStats().map.get(year) || { count: 0, domains: new Map() };
    const top = Array.from(entry.domains.entries()).sort((a, b) => b[1] - a[1]).slice(0, 2)
      .map(([id, count]) => `${DOMAIN_MAP[id].short} ${count}`).join(' · ');
    dom.chartTip.replaceChildren();
    dom.chartTip.append(h('b', { text: `${year} 年 · ${entry.count} 条` }));
    if (top) dom.chartTip.append(h('span', { text: top }));
    const wrapRect = dom.chartWrap.getBoundingClientRect();
    const barRect = slot.getBoundingClientRect();
    const left = Math.min(Math.max(barRect.left - wrapRect.left + barRect.width / 2, 70), wrapRect.width - 70);
    dom.chartTip.style.left = `${left}px`;
    dom.chartTip.style.top = `${barRect.top - wrapRect.top - 8}px`;
    dom.chartTip.classList.add('is-visible');
  }

  function hideChartTip() {
    dom.chartTip.classList.remove('is-visible');
  }

  /* ---------- 详情弹窗 ---------- */
  function openModal(id, fromRelated = false) {
    const m = MODEL_BY_ID.get(id);
    if (!m) return;
    if (!modalOpener) modalOpener = document.activeElement;
    if (!fromRelated) hideChartTip();

    window.clearTimeout(modalTimer);
    const backdrop = h('div', { class: 'modal-backdrop' });
    const panel = h('div', {
      class: 'modal-panel',
      attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'modalTitle' }
    });

    const top = h('div', { class: 'modal-top' });
    top.append(h('span', { class: 'modal-no', text: `ARCHIVE ENTRY · NO. ${m._no}` }));
    const close = h('button', {
      class: 'modal-close',
      attrs: { type: 'button', 'aria-label': '关闭详情' }
    });
    close.append(uiIcon('close', 20));
    top.append(close);
    panel.append(top);

    const hero = h('div', { class: 'modal-hero' });
    hero.append(modelLogoTile(m, 'lg'));
    const heroText = h('div', { class: 'modal-hero-text' });
    const orgLine = m._vendor.en && m._vendor.en !== m._vendor.name
      ? `${m._vendor.name} · ${m._vendor.en}`
      : m._vendor.name;
    heroText.append(
      h('h2', { text: m.name, attrs: { id: 'modalTitle' } }),
      h('p', { class: 'modal-org', text: orgLine }),
      h('p', { class: 'modal-date', text: fmtDate(m, true) })
    );
    const modalBadges = h('div', { class: 'modal-badges' });
    modalBadges.append(domainBadge(m), opennessBadge(m), precisionBadge(m), verifiedBadge(m));
    heroText.append(modalBadges);
    hero.append(heroText);
    panel.append(hero, h('p', { class: 'modal-desc', text: m.desc }));

    const detail = h('div', { class: 'detail-grid' });
    const detailPairs = [
      ['发布机构', m._vendor.en && m._vendor.en !== m._vendor.name ? `${m._vendor.name}（${m._vendor.en}）` : m._vendor.name],
      ['国家 / 地区', m._regions.join(' / ')],
      ['发布日期', `${fmtDate(m, true)} · ${PRECISION[m._precision].label}`],
      ['所属领域', m._domain.label],
      ['开放程度', m._openness.label],
      ['日期核验', m.verified ? '已核验' : '未核验'],
      ['档案编号', `NO. ${m._no}`],
      ['记录年度', `${m._year} 年`]
    ];
    for (const [label, value] of detailPairs) {
      const cell = h('div', { class: 'detail-cell' });
      cell.append(h('div', { class: 'detail-label', text: label }), h('div', { class: 'detail-value', text: value }));
      detail.append(cell);
    }
    panel.append(detail);

    const openCallout = h('div', { class: 'callout callout-open' });
    openCallout.style.setProperty('--oc', m._openness.color);
    openCallout.append(
      h('b', { text: `开放程度 · ${m._openness.label}` }),
      h('span', { text: m._openness.desc })
    );
    panel.append(openCallout);

    const verifyCallout = h('div', { class: `callout callout-verify ${m.verified ? 'is-ok' : 'is-warn'}` });
    verifyCallout.append(
      h('b', { text: m.verified ? '✓ 日期已核验' : '未核验日期' }),
      h('span', {
        text: m.verified
          ? '构建期已对照官方公告、论文或权威百科；档案为静态整理，不保证实时更新。'
          : `日期精度为「${PRECISION[m._precision].label}」，仅供编年参考，未逐条比对官方公告。`
      })
    );
    panel.append(verifyCallout);

    const actions = h('div', { class: 'modal-actions' });
    actions.append(starButton(m, 'modal-fav', 'label'));

    if (m._vendor.official) {
      const link = h('a', {
        class: 'btn btn-primary',
        attrs: { href: m._vendor.official.url, target: '_blank', rel: 'noopener noreferrer' }
      });
      link.append(document.createTextNode(m._vendor.official.label), uiIcon('arrow', 15));
      actions.append(link);
    }
    if (m.link) {
      const link = h('a', {
        class: 'btn',
        attrs: { href: m.link, target: '_blank', rel: 'noopener noreferrer' }
      });
      link.append(document.createTextNode('本条发布页'), uiIcon('arrow', 15));
      actions.append(link);
    }
    panel.append(actions);

    const related = MODELS
      .filter(x => x.org === m.org && x.id !== m.id)
      .sort((a, b) => compareDate(b, a))
      .slice(0, 3);
    if (related.length) {
      const rel = h('div', { class: 'related' });
      rel.append(h('div', { class: 'related-title', text: '同机构其他发布' }));
      for (const r of related) {
        const row = h('div', { class: 'related-row', attrs: { tabindex: '0', role: 'button', 'aria-label': `查看 ${r.name}` }, dataset: { relatedId: r.id } });
        row.append(modelLogoTile(r, 'xs'));
        const txt = h('div', { class: 'related-text' });
        txt.append(h('b', { text: r.name }), h('span', { text: fmtDate(r) }));
        row.append(txt, h('span', { class: 'related-domain', text: r._domain.short }));
        rel.append(row);
      }
      panel.append(rel);
    }

    const footerNote = h('div', { class: 'modal-footnote' });
    footerNote.append(
      h('span', { text: '商标与模型标识归各自权利人所有，仅用于识别。' }),
      h('span', { text: '静态档案 · 非实时数据' })
    );
    panel.append(footerNote);

    backdrop.append(panel);
    dom.modalRoot.replaceChildren(backdrop);
    document.body.classList.add('modal-open');
    [dom.siteHeader, dom.siteMain, dom.siteFooter].forEach(node => { if (node) node.inert = true; });

    requestAnimationFrame(() => {
      backdrop.classList.add('is-visible');
      close.focus({ preventScroll: true });
    });

    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) closeModal();
    });
    close.addEventListener('click', closeModal);

    panel.addEventListener('click', (event) => {
      const star = event.target.closest('[data-fav-id]');
      if (star) {
        event.stopPropagation();
        toggleFavorite(star.dataset.favId);
        return;
      }
      const relatedRow = event.target.closest('[data-related-id]');
      if (relatedRow) openModal(relatedRow.dataset.relatedId, true);
    });
    panel.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeModal();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusables = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', panel)
        .filter(el => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    const relatedRows = $$('.related-row', panel);
    relatedRows.forEach(row => {
      row.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openModal(row.dataset.relatedId, true);
        }
      });
    });
  }

  function closeModal() {
    const backdrop = $('.modal-backdrop', dom.modalRoot);
    if (!backdrop || !backdrop.classList.contains('is-visible')) return;
    backdrop.classList.remove('is-visible');
    const panel = $('.modal-panel', backdrop);
    const restore = modalOpener;
    window.clearTimeout(modalTimer);
    modalTimer = window.setTimeout(() => {
      dom.modalRoot.replaceChildren();
      document.body.classList.remove('modal-open');
      [dom.siteHeader, dom.siteMain, dom.siteFooter].forEach(node => { if (node) node.inert = false; });
      modalOpener = null;
      if (restore && typeof restore.focus === 'function' && document.contains(restore)) {
        restore.focus({ preventScroll: true });
      }
    }, 170);
    if (panel) panel.setAttribute('aria-hidden', 'true');
  }

  /* ---------- 收藏 ---------- */
  function toggleFavorite(id) {
    const m = MODEL_BY_ID.get(id);
    if (!m) return;
    const on = !favorites.has(id);
    if (on) favorites.add(id);
    else favorites.delete(id);
    writeStore(FAV_KEY, Array.from(favorites));

    $$('[data-fav-id]').forEach(btn => {
      if (btn.dataset.favId !== id) return;
      const hasLabel = Boolean(btn.querySelector('.modal-fav-label'));
      btn.classList.toggle('is-fav', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', `${on ? '取消收藏' : '收藏'} ${m.name}`);
      btn.setAttribute('title', on ? '取消收藏' : '收藏');
      btn.replaceChildren(starIcon(on));
      if (hasLabel) btn.append(h('span', { class: 'modal-fav-label', text: on ? '已收藏' : '收藏' }));
    });

    dom.favCount.textContent = String(favorites.size);
    dom.statFavs.textContent = String(favorites.size);
    showToast(on ? `已收藏 · ${m.name}` : `已取消收藏 · ${m.name}`);

    if (state.favOnly) renderAll();
    else renderStats();
  }

  function showToast(text) {
    dom.toast.textContent = text;
    dom.toast.classList.add('is-visible');
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => dom.toast.classList.remove('is-visible'), 1900);
  }

  /* ---------- 主题 ---------- */
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme, persist = true) {
    prefs.theme = theme;
    const resolved = theme === 'auto' ? (darkQuery.matches ? 'dark' : 'light') : theme;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', resolved === 'dark' ? '#0c0d10' : '#f3efe6');
    const label = theme === 'auto' ? '自动' : theme === 'light' ? '浅色' : '深色';
    dom.themeLabel.textContent = label;
    dom.themeBtn.setAttribute('aria-label', `主题：${label}，点击切换（自动 → 浅色 → 深色）`);
    dom.themeBtn.setAttribute('title', `主题：${label} · 点击切换（自动 → 浅色 → 深色）`);
    dom.themeIcon.replaceChildren(uiIcon(theme === 'auto' ? 'auto' : theme === 'light' ? 'sun' : 'moon', 17));
    if (persist) writeStore(PREFS_KEY, prefs);
  }

  function cycleTheme() {
    const next = prefs.theme === 'auto' ? 'light' : prefs.theme === 'light' ? 'dark' : 'auto';
    applyTheme(next);
  }

  function savePrefs() {
    writeStore(PREFS_KEY, prefs);
  }

  function updateSearchPlaceholder() {
    if (!dom.search) return;
    dom.search.placeholder = window.matchMedia('(max-width: 680px)').matches
      ? '搜索模型、机构、简介…'
      : '搜索模型、机构、简介… 支持空格分词';
  }

  /* ---------- 筛选操作 ---------- */
  function setSearch(value, immediate = false) {
    dom.search.value = value;
    state.q = value.trim();
    state.queryTokens = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    dom.searchClear.hidden = !value;
    window.clearTimeout(searchTimer);
    if (immediate) renderAll();
    else searchTimer = window.setTimeout(renderAll, 90);
  }

  function clearFilters() {
    state.q = '';
    state.queryTokens = [];
    state.domains.clear();
    state.openness = '';
    state.region = '';
    state.year = '';
    state.vendor = '';
    state.favOnly = false;
    dom.search.value = '';
    dom.searchClear.hidden = true;
    renderAll();
  }

  function resetFavoritesOnly() {
    state.favOnly = false;
    renderAll();
  }

  /* ---------- 主渲染 ---------- */
  function renderAll() {
    renderStats();
    renderDomainChips();
    renderVendors();
    renderSelects();
    renderChart();
    const list = currentList();
    dom.resultCount.textContent = `${list.length} / ${MODELS.length}`;
    dom.resultCount.setAttribute('aria-label', `${list.length} 条结果，共 ${MODELS.length} 条`);
    renderActiveFilters();
    renderResults(list);
    if (focusKey) {
      const target = Array.from(document.querySelectorAll('[data-focus-key]')).find(el => el.dataset.focusKey === focusKey);
      if (target) target.focus({ preventScroll: true });
      focusKey = null;
    }
  }

  /* ---------- 事件 ---------- */
  function bind() {
    dom.search.addEventListener('input', () => setSearch(dom.search.value));
    dom.search.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (dom.search.value) setSearch('', true);
        else dom.search.blur();
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        setSearch(dom.search.value, true);
      }
    });
    dom.searchClear.addEventListener('click', () => { setSearch('', true); dom.search.focus(); });

    dom.randomBtn.addEventListener('click', () => {
      const pool = MODELS.filter(m => matches(m));
      if (!pool.length) { showToast('当前筛选下没有可漫游的条目'); return; }
      const pick = pool[Math.floor(Math.random() * pool.length)];
      openModal(pick.id);
    });

    dom.domainChips.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-domain]');
      const all = event.target.closest('.chip-all');
      if (all) {
        state.domains.clear();
        focusKey = 'domain:all';
        renderAll();
        return;
      }
      if (!btn) return;
      const id = btn.dataset.domain;
      if (state.domains.has(id)) state.domains.delete(id);
      else state.domains.add(id);
      focusKey = `domain:${id}`;
      renderAll();
    });

    dom.vendorGrid.addEventListener('click', (event) => {
      const toggle = event.target.closest('.vendor-toggle');
      if (toggle) {
        state.vendorExpanded = !state.vendorExpanded;
        focusKey = 'vendor:toggle';
        renderAll();
        return;
      }
      const btn = event.target.closest('[data-vendor]');
      if (!btn) return;
      const id = btn.dataset.vendor;
      if (id === '__all__' || state.vendor === id) state.vendor = '';
      else state.vendor = id;
      focusKey = id === '__all__' ? 'vendor:all' : `vendor:${id}`;
      renderAll();
    });

    dom.opennessSel.addEventListener('change', () => { state.openness = dom.opennessSel.value; renderAll(); });
    dom.regionSel.addEventListener('change', () => { state.region = dom.regionSel.value; renderAll(); });
    dom.yearSel.addEventListener('change', () => { state.year = dom.yearSel.value; renderAll(); });
    dom.sortSel.addEventListener('change', () => { state.sort = dom.sortSel.value; renderAll(); });

    dom.favOnlyBtn.addEventListener('click', () => { state.favOnly = !state.favOnly; renderAll(); });

    dom.themeBtn.addEventListener('click', cycleTheme);

    dom.viewSwitch.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-view]');
      if (!btn || btn.dataset.view === state.view) return;
      state.view = btn.dataset.view;
      prefs.view = state.view;
      savePrefs();
      renderAll();
    });

    dom.activeFilters.addEventListener('click', (event) => {
      const clearAll = event.target.closest('.clear-all');
      if (clearAll) { clearFilters(); return; }
      const chip = event.target.closest('[data-clear]');
      if (!chip) return;
      const type = chip.dataset.clear;
      if (type === 'q') setSearch('', true);
      else if (type === 'fav') state.favOnly = false;
      else if (type === 'domain') state.domains.delete(chip.dataset.value);
      else if (type === 'openness') state.openness = '';
      else if (type === 'region') state.region = '';
      else if (type === 'year') state.year = '';
      else if (type === 'vendor') state.vendor = '';
      renderAll();
    });

    dom.emptyReset.addEventListener('click', () => {
      clearFilters();
    });

    dom.chartScroll.addEventListener('scroll', () => { hideChartTip(); updateChartNav(); }, { passive: true });
    dom.chartPrev.addEventListener('click', () => {
      scrollChartTo(dom.chartScroll.scrollLeft - dom.chartScroll.clientWidth * 0.72);
    });
    dom.chartNext.addEventListener('click', () => {
      scrollChartTo(dom.chartScroll.scrollLeft + dom.chartScroll.clientWidth * 0.72);
    });
    dom.chartScroll.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      scrollChartTo(dom.chartScroll.scrollLeft + (event.key === 'ArrowLeft' ? -1 : 1) * dom.chartScroll.clientWidth * 0.6);
    });
    dom.chart.addEventListener('pointerover', (event) => {
      const slot = event.target.closest('[data-chart-year]');
      if (slot) showChartTip(slot, slot.dataset.chartYear);
    });
    dom.chart.addEventListener('pointerout', (event) => {
      if (event.target.closest('[data-chart-year]') && !event.relatedTarget?.closest?.('[data-chart-year]')) hideChartTip();
    });
    dom.chart.addEventListener('focusin', (event) => {
      const slot = event.target.closest('[data-chart-year]');
      if (slot) showChartTip(slot, slot.dataset.chartYear);
    });
    dom.chart.addEventListener('focusout', hideChartTip);
    dom.chart.addEventListener('click', (event) => {
      const slot = event.target.closest('[data-chart-year]');
      if (!slot) return;
      const year = slot.dataset.chartYear;
      state.year = state.year === year ? '' : year;
      hideChartTip();
      renderAll();
      if (state.year) {
        window.setTimeout(() => {
          const target = document.getElementById('results');
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 40);
      }
    });
    dom.clearYear.addEventListener('click', () => { state.year = ''; renderAll(); });

    dom.viewRoot.addEventListener('click', (event) => {
      const star = event.target.closest('[data-fav-id]');
      if (star) {
        event.stopPropagation();
        toggleFavorite(star.dataset.favId);
        return;
      }
      const orgFilter = event.target.closest('[data-vendor-filter]');
      if (orgFilter) {
        event.stopPropagation();
        state.vendor = orgFilter.dataset.vendorFilter;
        state.view = 'cards';
        prefs.view = 'cards';
        savePrefs();
        renderAll();
        return;
      }
      const open = event.target.closest('[data-open-id]');
      if (open) openModal(open.dataset.openId);
    });

    dom.viewRoot.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const star = event.target.closest('[data-fav-id]');
      if (star) return;
      const open = event.target.closest('[data-open-id]');
      if (open) {
        event.preventDefault();
        openModal(open.dataset.openId);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && dom.modalRoot.querySelector('.modal-backdrop')) {
        closeModal();
        return;
      }
      const tag = (event.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || event.target.isContentEditable;
      if (event.key === '/' && !typing && !dom.modalRoot.querySelector('.modal-backdrop')) {
        event.preventDefault();
        dom.search.focus();
      }
    });

    darkQuery.addEventListener('change', () => {
      if (prefs.theme === 'auto') applyTheme('auto', false);
    });

    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        updateSearchPlaceholder();
        renderVendors();
        renderChart();
      }, 180);
    });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    dom.siteHeader = $('.site-header');
    dom.siteMain = $('.site-main');
    dom.siteFooter = $('.site-footer');
    dom.search = $('#search');
    dom.searchClear = $('#searchClear');
    dom.randomBtn = $('#randomBtn');
    dom.domainChips = $('#domainChips');
    dom.vendorGrid = $('#vendorGrid');
    dom.vendorHint = $('#vendorHint');
    dom.opennessSel = $('#opennessSel');
    dom.regionSel = $('#regionSel');
    dom.yearSel = $('#yearSel');
    dom.sortSel = $('#sortSel');
    dom.activeFilters = $('#activeFilters');
    dom.viewSwitch = $('#viewSwitch');
    dom.viewRoot = $('#viewRoot');
    dom.emptyState = $('#emptyState');
    dom.emptyTitle = $('#emptyTitle');
    dom.emptyText = $('#emptyText');
    dom.emptyReset = $('#emptyReset');
    dom.chart = $('#chart');
    dom.chartScroll = $('#chartScroll');
    dom.chartWrap = $('#chartWrap');
    dom.chartTip = $('#chartTip');
    dom.chartTotal = $('#chartTotal');
    dom.chartPrev = $('#chartPrev');
    dom.chartNext = $('#chartNext');
    dom.clearYear = $('#clearYear');
    dom.heroCount = $('#heroCount');
    dom.resultCount = $('#resultCount');
    dom.favOnlyBtn = $('#favOnlyBtn');
    dom.favCount = $('#favCount');
    dom.themeBtn = $('#themeBtn');
    dom.themeLabel = $('#themeLabel');
    dom.themeIcon = $('#themeIcon');
    dom.statModels = $('#statModels');
    dom.statVendors = $('#statVendors');
    dom.statSpan = $('#statSpan');
    dom.statFavs = $('#statFavs');
    dom.footerCount = $('#footerCount');
    dom.modalRoot = $('#modalRoot');
    dom.toast = $('#toast');

    dom.opennessSel.append(h('option', { text: '全部开放程度', attrs: { value: '' } }));
    dom.regionSel.append(h('option', { text: '全部地区', attrs: { value: '' } }));
    dom.yearSel.append(h('option', { text: '全部年份', attrs: { value: '' } }));
    for (const o of OPENNESS) {
      dom.opennessSel.append(h('option', { text: o.label, attrs: { value: o.id } }));
    }
    for (const r of ALL_REGIONS) {
      dom.regionSel.append(h('option', { text: r, attrs: { value: r } }));
    }
    for (const y of ALL_YEARS) {
      dom.yearSel.append(h('option', { text: y, attrs: { value: y } }));
    }
    for (const s of SORTS) {
      dom.sortSel.append(h('option', { text: s.label, attrs: { value: s.id } }));
    }

    updateSearchPlaceholder();
    applyTheme(prefs.theme, false);
    bind();
    renderAll();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

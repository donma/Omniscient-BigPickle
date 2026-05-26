(function() {
  'use strict';
  let allTemplates = [], filteredTemplates = [], currentView = 'grid';
  const filters = { industry: 'all', layout: 'all', theme: 'all', color: 'all', background: 'all', feature: 'all', search: '' };
  const el = {};

  function init() {
    el.grid = document.getElementById('template-grid');
    el.count = document.getElementById('result-count');
    el.search = document.getElementById('search-input');
    el.viewBtns = document.querySelectorAll('.view-btn');
    loadTemplates();
    setupFilters();
    setupViewToggle();
    setupSearch();
    setupMobileToggle();
  }

  function loadTemplates() {
    if (typeof TEMPLATES_DATA !== 'undefined' && TEMPLATES_DATA.templates) {
      allTemplates = TEMPLATES_DATA.templates;
      filteredTemplates = [...allTemplates];
      renderTemplates();
      return;
    }
    allTemplates = [];
    filteredTemplates = [];
    renderTemplates();
  }

  function getTags(t) {
    if (Array.isArray(t.tags)) return t.tags;
    if (t.tags && typeof t.tags === 'object') return Object.values(t.tags).flat().filter(Boolean);
    return [];
  }

  function renderTemplates() {
    if (!el.grid) return;
    const list = filteredTemplates;
    el.count.textContent = `共 ${list.length} 套樣板`;
    if (list.length === 0) {
      el.grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:4rem 0;color:var(--text-secondary)"><div style="font-size:3rem;margin-bottom:1rem">🔍</div><p>沒有符合條件的樣板</p></div>';
      return;
    }
    el.grid.innerHTML = list.map(t => {
      const tags = getTags(t).slice(0, 4);
      const isDark = t.backgroundMode === 'dark';
      const num = (t.id || '').replace('template-', '');
      return `
        <div class="template-card" onclick="window.location.href='template-detail.html?id=${t.id}'">
          <div class="card-img">
            <img src="${t.previewImage || 'assets/img/placeholder.svg'}" alt="${t.name}" loading="lazy" onerror="this.src='assets/img/placeholder.svg'">
            <div class="card-number">#${num}</div>
            <div class="card-badges">
              <span class="badge ${isDark ? 'badge-dark' : ''}">${t.industryCategory || t.industry || ''}</span>
              <span class="badge ${isDark ? 'badge-dark' : ''}">${t.layoutType || ''}</span>
              ${t.imageRich ? '<span class="badge badge-dark">📷 圖片豐富</span>' : ''}
            </div>
          </div>
          <div class="card-body">
            <div class="card-title">${t.name}</div>
            <div class="card-meta">
              <span class="meta-tag">${t.colorTheme || ''}</span>
              <span class="meta-tag">${t.backgroundMode === 'dark' ? '深色底' : '淺色底'}</span>
              <span class="meta-tag">12 頁</span>
            </div>
            <div class="card-desc">${t.description || ''}</div>
            ${tags.length ? '<div class="card-tags">' + tags.map(tg => `<span class="tag">${tg}</span>`).join('') + '</div>' : ''}
            <div class="card-actions">
              <a href="${t.demoUrl || '#'}" target="_blank" class="btn btn-primary btn-sm" onclick="event.stopPropagation()">預覽網站</a>
              <a href="template-detail.html?id=${t.id}" class="btn btn-outline btn-sm" onclick="event.stopPropagation()">查看詳情</a>
              <span class="btn btn-ghost btn-sm ${!t.hasZip ? 'btn-disabled' : ''}" title="ZIP 待打包">📦 ZIP</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function filterTemplates() {
    filteredTemplates = allTemplates.filter(t => {
      const tags = getTags(t);
      if (filters.industry !== 'all' && t.industryCategory !== filters.industry && t.industry !== filters.industry && !tags.includes(filters.industry)) return false;
      if (filters.layout !== 'all' && t.layoutType !== filters.layout) return false;
      if (filters.color !== 'all' && t.colorTheme !== filters.color) return false;
      if (filters.background !== 'all' && t.backgroundMode !== filters.background) return false;
      if (filters.feature !== 'all' && !tags.includes(filters.feature)) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!t.name.toLowerCase().includes(s) && !(t.description || '').toLowerCase().includes(s) && !tags.some(tg => tg.toLowerCase().includes(s))) return false;
      }
      return true;
    });
    renderTemplates();
  }

  function setupFilters() {
    document.querySelectorAll('.filter-group').forEach(group => {
      group.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const type = btn.dataset.filter;
        filters[type] = btn.dataset.value;
        filterTemplates();
      });
    });
  }

  function setupViewToggle() {
    el.viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        el.viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = btn.dataset.view;
        el.grid.className = 'template-grid ' + currentView + '-view';
      });
    });
  }

  function setupSearch() {
    if (!el.search) return;
    let timer;
    el.search.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        filters.search = el.search.value.trim();
        filterTemplates();
      }, 300);
    });
  }

  function setupMobileToggle() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('nav-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', () => menu.classList.toggle('open'));
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();

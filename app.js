/* ============================================================
   Water Scarcity Intelligence Project — app.js v1.0
   Renders any country from Supabase dynamically.
   Requires config.js to be loaded first (sets SUPABASE_URL
   and SUPABASE_ANON_KEY as globals).
   ============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // DOM refs (elements that always exist in index.html)
  // ----------------------------------------------------------
  const elLoading      = document.getElementById('loading');
  const elError        = document.getElementById('error-state');
  const elApp          = document.getElementById('app');
  const elContent      = document.getElementById('country-content');
  const elSelect       = document.getElementById('country-select');
  const elSelectorWrap = document.getElementById('selector-wrap');
  const elLoadingLabel = elLoading.querySelector('.loading-label');
  const elErrorBody    = elError.querySelector('.error-body');

  // ----------------------------------------------------------
  // State helpers
  // ----------------------------------------------------------

  function showLoading(msg) {
    elLoadingLabel.textContent = msg || 'Loading…';
    elLoading.hidden      = false;
    elError.hidden        = true;
    elApp.hidden          = true;
  }

  function showError(msg) {
    elErrorBody.textContent = msg;
    elLoading.hidden  = true;
    elError.hidden    = false;
    elApp.hidden      = true;
  }

  function showApp() {
    elLoading.hidden = true;
    elError.hidden   = true;
    elApp.hidden     = false;
  }

  // ----------------------------------------------------------
  // Security: HTML escape before inserting user-sourced text
  // ----------------------------------------------------------

  function esc(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Safe URL: only allow http/https, else return '#'
  function safeUrl(url) {
    if (!url) return null;
    try {
      const u = new URL(url);
      return (u.protocol === 'https:' || u.protocol === 'http:') ? url : null;
    } catch (_) {
      return null;
    }
  }

  // ----------------------------------------------------------
  // Supabase REST API
  // ----------------------------------------------------------

  async function apiFetch(path) {
    const url      = `${SUPABASE_URL}/rest/v1/${path}`;
    const response = await fetch(url, {
      headers: {
        'apikey':        SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Accept':        'application/json'
      }
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`API ${response.status}: ${body || response.statusText}`);
    }
    return response.json();
  }

  async function fetchCountries() {
    return apiFetch(
      'countries?select=name,code,region,risk_score,risk_outlook' +
      '&is_published=eq.true&order=name.asc'
    );
  }

  async function fetchCountry(code) {
    const rows = await apiFetch(
      `countries?code=eq.${encodeURIComponent(code)}&is_published=eq.true`
    );
    if (!rows || rows.length === 0) {
      throw new Error(`No published assessment found for code "${code}".`);
    }
    return rows[0];
  }

  // ----------------------------------------------------------
  // RENDER: Hero
  // ----------------------------------------------------------

  function renderHero(country) {
    const date = country.published_date
      ? new Date(country.published_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : '';

    const sourcesText = Array.isArray(country.content.data_sources_list)
      ? `<span class="meta-sep">·</span>
         <span>Data: ${country.content.data_sources_list.map(esc).join(', ')}</span>`
      : '';

    return `
      <section class="hero">
        <div class="container">
          <div class="geo-tag">${esc(country.geography_tag)}</div>
          <h1 class="hero-headline">${esc(country.headline)}</h1>
          <p class="hero-deck">${esc(country.deck)}</p>
          <div class="meta-row">
            <span>Published ${esc(date)}</span>
            <span class="meta-sep">·</span>
            <span>Framework v${esc(country.framework_version)}</span>
            ${sourcesText}
          </div>
        </div>
      </section>`;
  }

  // ----------------------------------------------------------
  // RENDER: Risk Banner
  // ----------------------------------------------------------

  function renderRiskBanner(country) {
    const paras = (country.content.risk_description || [])
      .map(p => `<p>${esc(p)}</p>`).join('');

    return `
      <section class="risk-banner">
        <div class="container">
          <div class="risk-inner">
            <div class="risk-score-block">
              <div class="risk-label-text">Water Bankruptcy Risk Rating</div>
              <div class="risk-score-value">${esc(country.risk_score)}</div>
              <div class="risk-outlook-text">Outlook: ${esc(country.risk_outlook)}</div>
            </div>
            <div class="risk-description">
              <div class="risk-analysis-label">Composite Risk Analysis</div>
              ${paras}
            </div>
          </div>
        </div>
      </section>`;
  }

  // ----------------------------------------------------------
  // RENDER: Timeline (Lake visualization)
  // ----------------------------------------------------------

  function renderTimeline(timeline) {
    if (!timeline || !Array.isArray(timeline.data)) return '';

    const max = Math.max(...timeline.data.map(d => d.value));

    const rows = timeline.data.map(d => {
      const pct   = ((d.value / max) * 100).toFixed(1);
      const cls   = d.value >= 95 ? 'baseline'
                  : d.value >= 60 ? 'high'
                  : d.value >= 30 ? 'mid'
                  : 'low';
      const note  = d.label ? `<span class="tl-note">${esc(d.label)}</span>` : '';

      return `
        <div class="timeline-row">
          <span class="tl-year">${esc(String(d.year))}</span>
          <div class="tl-track">
            <div class="tl-bar ${cls}" style="width:${pct}%"></div>
          </div>
          <span class="tl-pct">${esc(String(d.value))}%</span>
          ${note}
        </div>`;
    }).join('');

    return `
      <div class="timeline-viz">
        <div class="timeline-header">
          <div class="timeline-title">${esc(timeline.title)}</div>
          <div class="timeline-subtitle">${esc(timeline.subtitle)}</div>
        </div>
        <div class="timeline-bars">${rows}</div>
      </div>`;
  }

  // ----------------------------------------------------------
  // RENDER: Layer 1 — Scarcity Status
  // ----------------------------------------------------------

  function renderScarcityLayer(content) {
    const stats = (content.scarcity_stats || []).map(s => `
      <div class="stat-card">
        <div class="stat-value">${esc(s.value)}</div>
        <div class="stat-label">${esc(s.label)}</div>
        ${s.sub ? `<div class="stat-sub">${esc(s.sub)}</div>` : ''}
      </div>`).join('');

    const analysis = (content.scarcity_analysis || [])
      .map(p => `<p>${esc(p)}</p>`).join('');

    return `
      <section class="layer">
        <div class="container">
          <div class="layer-tag">Layer 1</div>
          <h2 class="layer-title">Scarcity Status</h2>
          <p class="layer-subtitle">Physical water availability and documented depletion</p>
          ${stats ? `<div class="stats-grid">${stats}</div>` : ''}
          ${renderTimeline(content.timeline)}
          ${analysis ? `<div class="body-text">${analysis}</div>` : ''}
        </div>
      </section>`;
  }

  // ----------------------------------------------------------
  // RENDER: Layer 2 — Economic Cascade
  // ----------------------------------------------------------

  function renderCascadeLayer(content) {
    const steps = content.cascade_steps || [];
    if (!steps.length) return '';

    const flowHtml = steps.map((step, i) => {
      const metrics = (step.metrics || [])
        .map(m => `<li>${esc(m)}</li>`).join('');

      const connector = i < steps.length - 1
        ? `<div class="cascade-connector">↓</div>`
        : '';

      return `
        <div class="cascade-step">
          <div class="cascade-key">${esc(step.key)}</div>
          <div class="cascade-body">
            <div class="cascade-title">${esc(step.title)}</div>
            <div class="cascade-subtitle">${esc(step.subtitle)}</div>
            ${metrics ? `<ul class="cascade-metrics">${metrics}</ul>` : ''}
            ${step.detail ? `<p class="cascade-detail">${esc(step.detail)}</p>` : ''}
          </div>
        </div>
        ${connector}`;
    }).join('');

    return `
      <section class="layer layer-alt">
        <div class="container">
          <div class="layer-tag">Layer 2</div>
          <h2 class="layer-title">Economic Cascade</h2>
          <p class="layer-subtitle">How water scarcity transmits to economic and social instability</p>
          <div class="cascade-flow">${flowHtml}</div>
        </div>
      </section>`;
  }

  // ----------------------------------------------------------
  // RENDER: Layer 3 — Technology & Solutions
  // ----------------------------------------------------------

  function badgeClass(category) {
    const map = { Efficiency: 'badge-efficiency', Supply: 'badge-supply', Governance: 'badge-governance' };
    return map[category] || 'badge-other';
  }

  function renderTechLayer(content) {
    const solutions = content.technology_solutions || [];
    if (!solutions.length) return '';

    const cards = solutions.map(tech => {
      const barriers = (tech.barriers || [])
        .map(b => `<li>${esc(b)}</li>`).join('');

      return `
        <div class="tech-card">
          <div class="tech-card-header">
            <div class="tech-title">${esc(tech.title)}</div>
            <span class="tech-badge ${badgeClass(tech.category)}">${esc(tech.category)}</span>
          </div>
          ${tech.potential ? `
            <div>
              <div class="tech-section-label">Potential</div>
              <div class="tech-section-value">${esc(tech.potential)}</div>
            </div>` : ''}
          ${tech.current ? `
            <div>
              <div class="tech-section-label">Current State</div>
              <div class="tech-section-value">${esc(tech.current)}</div>
            </div>` : ''}
          ${barriers ? `
            <div>
              <div class="tech-section-label">Key Barriers</div>
              <ul class="tech-barriers">${barriers}</ul>
            </div>` : ''}
        </div>`;
    }).join('');

    return `
      <section class="layer">
        <div class="container">
          <div class="layer-tag">Layer 3</div>
          <h2 class="layer-title">Technology & Solutions Landscape</h2>
          <p class="layer-subtitle">Available interventions, adoption status, and structural barriers</p>
          <div class="tech-grid">${cards}</div>
        </div>
      </section>`;
  }

  // ----------------------------------------------------------
  // RENDER: Layer 4 — Intelligence Brief
  // ----------------------------------------------------------

  function renderBriefLayer(content) {
    const paras = content.intelligence_brief || [];
    if (!paras.length) return '';

    return `
      <section class="layer layer-dark">
        <div class="container">
          <div class="layer-tag">Layer 4</div>
          <h2 class="layer-title">Intelligence Brief</h2>
          <p class="layer-subtitle">Systems analysis — Water Scarcity Intelligence Project</p>
          <div class="brief-inner body-text">
            ${paras.map(p => `<p>${esc(p)}</p>`).join('')}
          </div>
        </div>
      </section>`;
  }

  // ----------------------------------------------------------
  // RENDER: Layer 5 — Trajectory & Implications
  // ----------------------------------------------------------

  function renderTrajectoryLayer(content) {
    const paras = content.trajectory || [];
    if (!paras.length) return '';

    return `
      <section class="layer layer-alt">
        <div class="container">
          <div class="layer-tag">Layer 5</div>
          <h2 class="layer-title">Trajectory & Implications</h2>
          <p class="layer-subtitle">Forward analysis and strategic implications</p>
          <div class="body-text">
            ${paras.map(p => `<p>${esc(p)}</p>`).join('')}
          </div>
        </div>
      </section>`;
  }

  // ----------------------------------------------------------
  // RENDER: Sources
  // ----------------------------------------------------------

  function renderSources(content, frameworkVersion) {
    const sources = content.sources || [];
    if (!sources.length) return '';

    const items = sources.map(s => {
      const url = safeUrl(s.url);
      const name = url
        ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)}</a>`
        : esc(s.name);
      return `<li>${name}</li>`;
    }).join('');

    return `
      <section class="sources-section">
        <div class="container">
          <div class="sources-title">Data Sources & Methodology</div>
          <ul class="sources-list">${items}</ul>
          <p class="methodology-note">
            Risk scores are produced using the Water Bankruptcy Risk Framework
            v${esc(frameworkVersion || '1.0')}. Ratings reflect composite assessment of physical
            water stress, economic exposure, technology adoption barriers, and governance capacity.
            This is analytical intelligence, not investment advice.
          </p>
        </div>
      </section>`;
  }

  // ----------------------------------------------------------
  // RENDER: Full country page
  // ----------------------------------------------------------

  function renderCountry(country) {
    const c = country.content || {};
    document.title = `${country.name} — Water Scarcity Intelligence`;

    return [
      renderHero(country),
      renderRiskBanner(country),
      renderScarcityLayer(c),
      renderCascadeLayer(c),
      renderTechLayer(c),
      renderBriefLayer(c),
      renderTrajectoryLayer(c),
      renderSources(c, country.framework_version)
    ].join('');
  }

  // ----------------------------------------------------------
  // Country selector
  // ----------------------------------------------------------

  function populateSelector(countries, activeCode) {
    elSelect.innerHTML = countries.map(c =>
      `<option value="${esc(c.code)}" ${c.code === activeCode ? 'selected' : ''}>
         ${esc(c.name)} — ${esc(c.risk_score)}
       </option>`
    ).join('');

    elSelect.addEventListener('change', e => navigate(e.target.value));

    // Show selector only when there is at least one country
    if (countries.length > 0) {
      elSelectorWrap.style.display = 'flex';
    }
  }

  // ----------------------------------------------------------
  // Routing via URL query string: ?country=ir
  // ----------------------------------------------------------

  function codeFromURL() {
    return new URLSearchParams(window.location.search).get('country');
  }

  function navigate(code) {
    const url = new URL(window.location.href);
    url.searchParams.set('country', code);
    window.history.pushState({}, '', url.toString());
    loadCountry(code);
  }

  window.addEventListener('popstate', () => {
    const code = codeFromURL();
    if (code) loadCountry(code);
  });

  // ----------------------------------------------------------
  // Load a single country and paint it
  // ----------------------------------------------------------

  async function loadCountry(code) {
    showLoading(`Loading ${code.toUpperCase()} assessment…`);
    try {
      const country = await fetchCountry(code);
      elContent.innerHTML = renderCountry(country);
      elSelect.value = code;
      showApp();
      window.scrollTo(0, 0);
    } catch (err) {
      showError(`Could not load country data: ${err.message}`);
    }
  }

  // ----------------------------------------------------------
  // Boot
  // ----------------------------------------------------------

  async function init() {
    // Guard against un-configured placeholder values
    if (
      typeof SUPABASE_URL      === 'undefined' ||
      typeof SUPABASE_ANON_KEY === 'undefined' ||
      SUPABASE_URL      === 'YOUR_SUPABASE_URL' ||
      SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY'
    ) {
      showError(
        'Supabase is not configured. Open config.js, replace YOUR_SUPABASE_URL and ' +
        'YOUR_SUPABASE_ANON_KEY with your project credentials, then redeploy.'
      );
      return;
    }

    showLoading('Connecting to intelligence database…');

    let countries;
    try {
      countries = await fetchCountries();
    } catch (err) {
      showError(
        `Failed to connect to Supabase: ${err.message}. ` +
        'Check your SUPABASE_URL and SUPABASE_ANON_KEY in config.js.'
      );
      return;
    }

    if (!countries || countries.length === 0) {
      showError(
        'Database is empty. Run supabase/seeds/iran.sql in the Supabase SQL Editor ' +
        'to add the first country assessment.'
      );
      return;
    }

    // Determine which country to show: URL param → first in list
    const requestedCode = codeFromURL();
    const code = (requestedCode && countries.find(c => c.code === requestedCode))
      ? requestedCode
      : countries[0].code;

    populateSelector(countries, code);

    // Push the resolved code into the URL without creating a history entry
    const url = new URL(window.location.href);
    url.searchParams.set('country', code);
    window.history.replaceState({}, '', url.toString());

    await loadCountry(code);
  }

  init();
})();

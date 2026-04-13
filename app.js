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

  // Cached countries list — set once in init, reused for navigation
  let cachedCountries = [];
  let selectorListenerAttached = false;

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
    console.error('[WSIP Error]', msg);
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
    const url        = `${SUPABASE_URL}/rest/v1/${path}`;
    const controller = new AbortController();
    const timer      = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'apikey':        SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Accept':        'application/json'
        }
      });
      clearTimeout(timer);
      if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`API ${response.status}: ${body || response.statusText}`);
      }
      return response.json();
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  async function fetchCountries() {
    return apiFetch(
      'countries?select=name,code,region,risk_score,risk_outlook,headline' +
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
  // RENDER: Home page
  // ----------------------------------------------------------

  function riskTierClass(score) {
    if (!score) return 'risk-tier-unknown';
    const s = score.trim().toUpperCase();
    if (s.startsWith('C')) return 'risk-tier-critical';
    if (s.startsWith('B')) return 'risk-tier-elevated';
    if (s.startsWith('A')) return 'risk-tier-stressed';
    return 'risk-tier-unknown';
  }

  function renderCountryCard(country) {
    const tierClass = riskTierClass(country.risk_score);
    return `
      <div class="country-card" data-code="${esc(country.code)}" role="button" tabindex="0" aria-label="View ${esc(country.name)} assessment">
        <div class="card-header">
          <span class="card-risk-badge ${tierClass}">${esc(country.risk_score)}</span>
          <span class="card-region">${esc(country.region)}</span>
        </div>
        <div class="card-name">${esc(country.name)}</div>
        ${country.headline ? `<div class="card-headline">${esc(country.headline)}</div>` : ''}
        <div class="card-outlook">${esc(country.risk_outlook)}</div>
        <div class="card-cta">View Assessment <span aria-hidden="true">&rarr;</span></div>
      </div>`;
  }

  function renderHomePage() {
    const cards = cachedCountries.map(renderCountryCard).join('');
    const countLabel = cachedCountries.length === 1 ? '1 Assessment' : `${cachedCountries.length} Assessments`;
    return `
      <section class="home-hero">
        <div class="container">
          <div class="home-eyebrow">Water Scarcity Intelligence Project</div>
          <h1 class="home-headline">Country-Level Water Risk Intelligence</h1>
          <p class="home-deck">Structured assessments of groundwater depletion, aquifer collapse, and cascade failure — drawing on NASA GRACE-FO, WRI Aqueduct, FAO AQUASTAT, and BIS research. Rated, sourced, and readable in under 60 seconds.</p>
          <a href="/?page=methodology" class="home-method-link" data-nav-page="methodology">How assessments are rated &rarr;</a>
        </div>
      </section>

      <section class="home-section home-gap-section">
        <div class="container">
          <div class="home-gap-callout">Raw data exists. Intelligence doesn't.</div>
          <div class="home-gap-body">
            <p>NASA GRACE-FO satellite data tracks aquifer depletion across every major basin on earth. WRI Aqueduct maps water stress levels for every country and sub-basin. FAO AQUASTAT documents annual withdrawals by sector. All of this data is public and authoritative.</p>
            <p>What it doesn't do is tell you what it means — or what breaks next.</p>
            <p>This tool synthesises primary data into rated country assessments: a risk score, a cascade model tracing how water stress flows into food insecurity, economic disruption, and political instability, and a plain-language intelligence brief you can cite and use. Every assessment follows the same framework so countries can be compared against each other and tracked over time.</p>
          </div>
        </div>
      </section>

      <section class="home-section home-section-alt">
        <div class="container">
          <div class="home-section-label">Who uses this</div>
          <div class="use-case-grid">
            <div class="use-case-card">
              <div class="use-case-title">Journalists</div>
              <p>Sourced, quantified background for any country water story. Risk score, cascade model, and primary citations in under 60 seconds. Every statistic links to its original data source.</p>
            </div>
            <div class="use-case-card">
              <div class="use-case-title">Investors</div>
              <p>Screen sovereign debt, agricultural commodity exposure, or supply chain risk against quantified water depletion data. The economic cascade section maps how water stress transmits to GDP and inflation.</p>
            </div>
            <div class="use-case-card">
              <div class="use-case-title">Policymakers &amp; NGOs</div>
              <p>Benchmark countries against each other using a consistent framework. Understand where the trajectory is most dangerous, where intervention still has leverage, and where the window is closing.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="home-section">
        <div class="container">
          <div class="home-section-label">${esc(countLabel)}</div>
          <div class="country-grid">${cards}</div>
        </div>
      </section>`;
  }

  // ----------------------------------------------------------
  // RENDER: Methodology page
  // ----------------------------------------------------------

  function renderMethodologyPage() {
    return `
      <section class="home-hero">
        <div class="container">
          <div class="home-eyebrow"><a href="/" class="back-link" data-nav-page="">&#8592; Water Scarcity Intelligence</a></div>
          <h1 class="home-headline">Methodology</h1>
          <p class="home-deck">How country assessments are produced, what data they draw on, and what the ratings mean.</p>
        </div>
      </section>

      <section class="layer">
        <div class="container">
          <h2 class="layer-title">The Rating Framework</h2>
          <p class="layer-subtitle">A three-tier scale modelled on credit risk analysis</p>
          <div class="body-text">
            <p>Each country is assigned a Water Bankruptcy Risk Rating reflecting the current state and trajectory of its water systems. The scale has three tiers, each with three gradations. The minus modifier (&#8211;) indicates a deteriorating trajectory within the tier; the plus (+) indicates stable or improving conditions.</p>
          </div>
          <div class="rating-table">
            <div class="rating-row">
              <div class="rating-score-col"><span class="rating-badge-lg risk-tier-critical">CCC&#8211;</span></div>
              <div class="rating-desc-col">
                <div class="rating-tier-label">Critical</div>
                <p>Structural water deficit already underway. Aquifer depletion is irreversible at current extraction rates on decadal timescales. Agricultural and economic cascade actively in progress. Physical constraints are beginning to override institutional responses.</p>
              </div>
            </div>
            <div class="rating-row">
              <div class="rating-score-col"><span class="rating-badge-lg risk-tier-elevated">B&#8211;</span></div>
              <div class="rating-desc-col">
                <div class="rating-tier-label">Elevated</div>
                <p>Significant water stress with a measurable depletion trajectory. Physical depletion is ongoing but not yet irreversible. Institutional intervention could alter the outcome. The economic cascade is visible in data but has not yet produced systemic disruption.</p>
              </div>
            </div>
            <div class="rating-row">
              <div class="rating-score-col"><span class="rating-badge-lg risk-tier-stressed">A&#8211;</span></div>
              <div class="rating-desc-col">
                <div class="rating-tier-label">Stressed</div>
                <p>Water stress present but within manageable parameters. Infrastructure and institutional capacity are generally adequate to current demand. Long-term risk accumulates if the trajectory continues without intervention.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="layer layer-alt">
        <div class="container">
          <h2 class="layer-title">The W&#8594;A&#8594;E&#8594;S Cascade Model</h2>
          <p class="layer-subtitle">Why water stress never stays in the water sector</p>
          <div class="body-text">
            <p>The cascade model is the analytical core of every country assessment. It traces the transmission pathway from physical water scarcity through economic sectors to social and political instability.</p>
          </div>
          <div class="method-cascade">
            <div class="method-cascade-step">
              <div class="method-cascade-key">W</div>
              <div class="method-cascade-content">
                <div class="method-cascade-title">Water</div>
                <p>Physical availability and depletion rates. How much water exists, how fast it is being consumed relative to natural recharge, and whether the trajectory is reversible. Primary sources: NASA GRACE-FO, WRI Aqueduct, FAO AQUASTAT.</p>
              </div>
            </div>
            <div class="method-cascade-arrow">&#8595;</div>
            <div class="method-cascade-step">
              <div class="method-cascade-key">A</div>
              <div class="method-cascade-content">
                <div class="method-cascade-title">Agriculture</div>
                <p>Agricultural systems account for approximately 70% of global freshwater withdrawals. When water becomes scarce, farming is typically the first sector disrupted — through reduced yields, fallowed land, or crop abandonment. In export-oriented economies, this transmits directly to trade flows.</p>
              </div>
            </div>
            <div class="method-cascade-arrow">&#8595;</div>
            <div class="method-cascade-step">
              <div class="method-cascade-key">E</div>
              <div class="method-cascade-content">
                <div class="method-cascade-title">Economics</div>
                <p>Water-driven agricultural failure creates measurable economic effects: GDP deceleration, food price inflation, reduced export revenue, and infrastructure damage. These effects are documented in peer-reviewed research and central bank working papers including BIS Working Papers.</p>
              </div>
            </div>
            <div class="method-cascade-arrow">&#8595;</div>
            <div class="method-cascade-step">
              <div class="method-cascade-key">S</div>
              <div class="method-cascade-content">
                <div class="method-cascade-title">Social</div>
                <p>Economic disruption transmits to social and political instability: internal migration, food insecurity, protests over water access, and in the most acute cases, armed conflict over water infrastructure. This is documented in every country assessed at CCC rating.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="layer">
        <div class="container">
          <h2 class="layer-title">Primary Data Sources</h2>
          <p class="layer-subtitle">What each source measures, what it covers, and its limitations</p>
          <div class="source-detail-list">
            <div class="source-detail-item">
              <div class="source-detail-name">WRI Aqueduct 4.0</div>
              <div class="source-detail-org">World Resources Institute</div>
              <p><strong>Measures:</strong> Country and basin-level water stress, depletion ratios, inter-annual variability, and groundwater table decline.</p>
              <p><strong>Coverage:</strong> Global. Updated 2023 with data through 2019; projections to 2030 and 2050.</p>
              <p><strong>Limitation:</strong> Stress indicators are modelled from hydrological data. Does not capture informal or unlicensed extraction, which can be substantial in heavily agricultural economies.</p>
            </div>
            <div class="source-detail-item">
              <div class="source-detail-name">NASA GRACE-FO</div>
              <div class="source-detail-org">Gravity Recovery and Climate Experiment Follow-On &middot; NASA / DLR</div>
              <p><strong>Measures:</strong> Changes in terrestrial water storage by detecting gravitational anomalies. When groundwater is extracted, land mass decreases and gravity weakens slightly — GRACE-FO detects this.</p>
              <p><strong>Coverage:</strong> Global, monthly data since 2018. Original GRACE mission data available from 2002.</p>
              <p><strong>Limitation:</strong> Spatial resolution is approximately 300km. Measures total water storage change, not groundwater alone. Separation of groundwater signal requires additional hydrological modelling.</p>
            </div>
            <div class="source-detail-item">
              <div class="source-detail-name">FAO AQUASTAT</div>
              <div class="source-detail-org">Food and Agriculture Organisation of the United Nations</div>
              <p><strong>Measures:</strong> Annual freshwater withdrawals by sector, total renewable water resources, irrigation statistics.</p>
              <p><strong>Coverage:</strong> Global country-level data. Update frequency varies by country.</p>
              <p><strong>Limitation:</strong> Statistics are often self-reported by national governments and may lag by several years.</p>
            </div>
            <div class="source-detail-item">
              <div class="source-detail-name">BIS Working Papers</div>
              <div class="source-detail-org">Bank for International Settlements</div>
              <p><strong>Measures:</strong> Economic and financial system impacts of climate and water stress. BIS Working Paper No. 1314 documents the transmission pathway from water stress to inflation and GDP outcomes.</p>
              <p><strong>Limitation:</strong> Working papers represent research perspectives, not official BIS policy positions.</p>
            </div>
            <div class="source-detail-item">
              <div class="source-detail-name">National agency data</div>
              <div class="source-detail-org">e.g. CONAGUA (Mexico), IRIMO (Iran)</div>
              <p><strong>Measures:</strong> Country-specific aquifer classifications, extraction permit volumes, reservoir levels, and infrastructure data.</p>
              <p><strong>Limitation:</strong> Permitted extraction volumes do not always reflect actual extraction. Where national agency data conflicts with satellite or independent data, both are noted in the assessment.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="layer layer-alt">
        <div class="container">
          <h2 class="layer-title">What This Is Not</h2>
          <div class="body-text">
            <p><strong>Not investment advice.</strong> Assessments are analytical tools, not financial products. They are intended to inform analysis, not substitute for it.</p>
            <p><strong>Not algorithmic.</strong> Ratings are qualitative assessments produced by human analysts synthesising multiple data sources. The rating reflects a reasoned judgement about the weight of evidence.</p>
            <p><strong>Not real-time.</strong> Each assessment reflects conditions as of its published date. The published date and framework version are shown on every assessment.</p>
            <p><strong>Not comprehensive.</strong> Framework v1.0 covers the primary transmission pathway from physical water stress to social instability. It does not model second-order effects such as cross-border water conflict or financial contagion from water-exposed sovereign debt.</p>
          </div>
        </div>
      </section>

      <section class="layer">
        <div class="container">
          <h2 class="layer-title">Versioning</h2>
          <div class="body-text">
            <p>The analytical framework is versioned independently of individual country assessments. Framework Version 1.0 was released April 2026 and covers the five-layer model: Scarcity Status, Economic Cascade, Technology &amp; Solutions, Intelligence Brief, and Trajectory &amp; Implications.</p>
            <p>Individual country assessments carry their own <code>published_date</code> and may be updated when significant new data warrants revision. Methodology updates that change how ratings are assigned will increment the framework version number.</p>
          </div>
        </div>
      </section>`;
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

    if (!selectorListenerAttached) {
      elSelect.addEventListener('change', e => navigate(e.target.value));
      selectorListenerAttached = true;
    }

    if (countries.length > 0) {
      elSelectorWrap.style.display = 'flex';
    }
  }

  // ----------------------------------------------------------
  // Routing via URL query string: ?country=ir  ?page=methodology
  // ----------------------------------------------------------

  function codeFromURL() {
    return new URLSearchParams(window.location.search).get('country');
  }

  function pageFromURL() {
    return new URLSearchParams(window.location.search).get('page');
  }

  function navigate(code) {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('country', code);
    window.history.pushState({}, '', url.toString());
    populateSelector(cachedCountries, code);
    loadCountry(code);
  }

  function navigatePage(page) {
    const url = new URL(window.location.href);
    url.search = '';
    if (page) url.searchParams.set('page', page);
    window.history.pushState({}, '', url.toString());
    if (page === 'methodology') {
      elSelectorWrap.style.display = 'none';
      loadMethodology();
    } else {
      elSelectorWrap.style.display = 'none';
      loadHome();
    }
  }

  window.addEventListener('popstate', () => {
    const code = codeFromURL();
    const page = pageFromURL();
    if (code && cachedCountries.find(c => c.code === code)) {
      populateSelector(cachedCountries, code);
      loadCountry(code);
    } else if (page === 'methodology') {
      elSelectorWrap.style.display = 'none';
      loadMethodology();
      showApp();
    } else {
      elSelectorWrap.style.display = 'none';
      loadHome();
    }
  });

  // ----------------------------------------------------------
  // Page loaders
  // ----------------------------------------------------------

  function loadHome() {
    document.title = 'Water Scarcity Intelligence — Country Risk Assessments';
    elSelectorWrap.style.display = 'none';
    elContent.innerHTML = renderHomePage();
    elContent.querySelectorAll('.country-card[data-code]').forEach(card => {
      card.addEventListener('click', () => navigate(card.dataset.code));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(card.dataset.code); }
      });
    });
    elContent.querySelectorAll('[data-nav-page]').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); navigatePage(el.dataset.navPage); });
    });
    showApp();
    window.scrollTo(0, 0);
  }

  function loadMethodology() {
    document.title = 'Methodology — Water Scarcity Intelligence';
    elSelectorWrap.style.display = 'none';
    elContent.innerHTML = renderMethodologyPage();
    elContent.querySelectorAll('[data-nav-page]').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); navigatePage(el.dataset.navPage); });
    });
    showApp();
    window.scrollTo(0, 0);
  }

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

    try {
      cachedCountries = await fetchCountries();
    } catch (err) {
      showError(`Failed to connect to Supabase: ${err.message}. Check your SUPABASE_URL and SUPABASE_ANON_KEY in config.js.`);
      return;
    }

    if (!cachedCountries || cachedCountries.length === 0) {
      showError('Database is empty. Run supabase/seeds/iran.sql in the Supabase SQL Editor to add the first country assessment.');
      return;
    }

    // Wire up footer / header nav links that persist across all pages
    document.querySelectorAll('[data-nav-page]').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); navigatePage(el.dataset.navPage); });
    });
    document.querySelector('.brand').addEventListener('click', e => {
      e.preventDefault();
      navigatePage('');
    });

    const requestedCode = codeFromURL();
    const requestedPage = pageFromURL();

    if (requestedPage === 'methodology') {
      loadMethodology();
      showApp();
    } else if (requestedCode && cachedCountries.find(c => c.code === requestedCode)) {
      populateSelector(cachedCountries, requestedCode);
      await loadCountry(requestedCode);
    } else {
      // Default: home page
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url.toString());
      loadHome();
    }
  }

  init();
})();

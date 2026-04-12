-- ============================================================
-- Water Scarcity Intelligence Project
-- Country Seed: Islamic Republic of Iran
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================================

INSERT INTO countries (
  name,
  code,
  region,
  risk_score,
  risk_outlook,
  geography_tag,
  headline,
  deck,
  published_date,
  framework_version,
  content
) VALUES (
  'Iran',
  'ir',
  'Middle East',
  'CCC–',
  'Critical / Deteriorating',
  'Case Study · Islamic Republic of Iran · Middle East',
  'The Country Running Out of Water in Real Time',
  'Iran has lost 70% of its surface water since 1970. Groundwater tables fall 1.2 metres per year. Ninety-seven percent of the country operates under high water stress. This is not a forecast — it is a documented trajectory toward water bankruptcy.',
  '2026-04-01',
  '1.0',
  $json${
    "data_sources_list": ["FAO", "NASA GRACE-FO", "WRI Aqueduct", "BIS"],

    "risk_description": [
      "Iran's CCC– rating reflects a composite of extreme physical water stress, near-total agricultural water dependency, documented economic cascades from drought shocks, and structural political constraints that prevent adoption of known technological solutions.",
      "With 97% of land under high water stress (WRI Aqueduct), aquifer depletion at twice natural recharge rates, and Lake Urmia reduced to 8% of its 1970 baseline, Iran has crossed the thresholds that typically precede systemic water bankruptcy — the point at which water scarcity becomes the binding constraint on economic activity.",
      "The deteriorating outlook reflects the absence of a credible policy response, the compounding effect of international sanctions on technology access, and the acceleration of climate-driven aridification across the Iranian Plateau."
    ],

    "scarcity_stats": [
      {
        "value": "−70%",
        "label": "Surface area of Lake Urmia lost since 1970",
        "sub": "Once the Middle East's largest lake"
      },
      {
        "value": "97%",
        "label": "of Iran's land under high water stress",
        "sub": "Per WRI Aqueduct 4.0"
      },
      {
        "value": "−1.2m",
        "label": "Average annual groundwater table decline",
        "sub": "National average — NASA GRACE-FO"
      },
      {
        "value": "1,700m³",
        "label": "Per capita annual water availability",
        "sub": "Approaching absolute scarcity threshold"
      }
    ],

    "timeline": {
      "title": "Lake Urmia Surface Area: Documented Decline",
      "subtitle": "Percentage remaining versus 1970 baseline (~5,200 km²)",
      "data": [
        { "year": 1970, "value": 100, "label": "~5,200 km²" },
        { "year": 1985, "value": 88,  "label": "~4,600 km²" },
        { "year": 1998, "value": 72,  "label": "~3,750 km²" },
        { "year": 2008, "value": 45,  "label": "~2,340 km²" },
        { "year": 2015, "value": 18,  "label": "~940 km²"   },
        { "year": 2024, "value": 8,   "label": "~416 km²"   }
      ]
    },

    "scarcity_analysis": [
      "Iran sits across three distinct climate zones — arid, semi-arid, and Mediterranean — with roughly 60% of its territory classified as desert or near-desert. Natural annual precipitation averages 250mm, approximately one-third the global mean. This baseline scarcity is being compounded by three simultaneous drivers: systematic over-extraction of groundwater for agricultural irrigation, upstream dam construction that has reduced river flows to internal lakes and wetlands, and accelerating aridification driven by broader regional climate shifts.",
      "The Lake Urmia case is particularly significant because it is a closed-basin system — its decline is not explained by downstream diversion but by the simple mathematics of input versus extraction within its watershed. Agricultural irrigation accounts for approximately 60% of the basin's water extraction, with upstream dam construction reducing inflows by an estimated 30%. The result is a salt lake that has crossed an ecological tipping point: at current salinity levels, the lake's brine shrimp ecosystem — the food source for millions of migratory birds — has collapsed, triggering a cascade of ecological and economic consequences."
    ],

    "cascade_steps": [
      {
        "key": "W",
        "title": "Water",
        "subtitle": "Physical depletion precedes economic impact",
        "metrics": [
          "Aquifer depletion: 2–4× natural recharge rate",
          "Annual decline: 1.2m national average",
          "Lake Urmia: 92% volume lost since 1970",
          "97% of territory under high water stress"
        ],
        "detail": "The depletion rate is the critical variable. Aquifers drawing down at 2–4× natural recharge rates are not in equilibrium — they are being liquidated as a resource. The compounding effect: declining water tables require deeper, more expensive wells, which increases costs for farmers already operating on thin margins."
      },
      {
        "key": "A",
        "title": "Agriculture",
        "subtitle": "Sector most exposed to water bankruptcy",
        "metrics": [
          "Agricultural share of water use: 92%",
          "Workforce dependent on agriculture: 18%",
          "Agricultural share of GDP: 12%",
          "Output drop during 2017–18 drought: −25%"
        ],
        "detail": "When 92% of water use goes to agriculture and aquifers are declining, agricultural output becomes directly correlated with water availability. The 2017–18 drought demonstrated this: a single bad year produced a 25% output decline. As groundwater tables fall and wells fail, this exposure intensifies."
      },
      {
        "key": "E",
        "title": "Economics",
        "subtitle": "Water stress transmits to macro-economic instability",
        "metrics": [
          "Food price inflation (2018–2023): 40%+",
          "BIS-estimated GDP reduction: 6–8%",
          "Import dependency rising as domestic production falls",
          "Currency devaluation compounds food import costs"
        ],
        "detail": "The Bank for International Settlements (Working Paper No. 1314) documents the transmission mechanism: water stress → agricultural output decline → food price inflation → broader economic instability. In Iran's case, this is compounded by sanctions that limit the ability to import food at favorable prices or finance infrastructure investment."
      },
      {
        "key": "S",
        "title": "Social",
        "subtitle": "Economic stress transmits to political instability",
        "metrics": [
          "Water-related displaced persons: 2M+",
          "Khuzestan water protests (2021): multiple fatalities",
          "Rural-to-urban migration accelerating",
          "Agricultural communities facing permanent displacement"
        ],
        "detail": "The 2021 Khuzestan protests — triggered directly by water shortages and power outages linked to low reservoir levels — resulted in multiple fatalities and hundreds of arrests. This is the documented social transmission of water stress: rural economic collapse → displacement → urban pressure → political instability. The pattern is consistent with BIS research linking water stress to social unrest."
      }
    ],

    "technology_solutions": [
      {
        "title": "Drip Irrigation & Precision Agriculture",
        "category": "Efficiency",
        "potential": "30–50% reduction in agricultural water use with no yield reduction",
        "current": "Current adoption: <10% of irrigated land",
        "barriers": [
          "Capital cost prohibitive for smallholder farmers",
          "International sanctions restrict import of advanced components",
          "Government subsidy structure incentivizes water-intensive crops"
        ]
      },
      {
        "title": "Desalination (Persian Gulf Access)",
        "category": "Supply",
        "potential": "Iran has 2,440 km of coastline and domestic natural gas for energy",
        "current": "Limited operational capacity, primarily small-scale",
        "barriers": [
          "Sanctions block import of membrane technology and key components",
          "Pipeline infrastructure required to move water inland",
          "Limited domestic manufacturing capability for scale-up"
        ]
      },
      {
        "title": "Atmospheric Water Generation",
        "category": "Supply",
        "potential": "Proven technology for coastal and humid regions",
        "current": "Pilot projects exist; not at agricultural scale",
        "barriers": [
          "5–10 year timeline to meaningful scale",
          "Energy-intensive; requires stable electricity supply",
          "Not a near-term solution for agricultural water demand"
        ]
      },
      {
        "title": "Water Rights Reform & Metering",
        "category": "Governance",
        "potential": "Proven effective in Chile, Australia, and Western US in reducing over-extraction",
        "current": "Informal water rights; limited metering infrastructure",
        "barriers": [
          "Political resistance from agricultural constituencies",
          "Constitutional ambiguity on water ownership",
          "Requires functioning rule of law and enforcement capacity"
        ]
      },
      {
        "title": "Treated Wastewater Reuse",
        "category": "Efficiency",
        "potential": "Singapore reuses 40% of water; Iran currently at <5%",
        "current": "Some urban wastewater treatment; minimal agricultural reuse",
        "barriers": [
          "Infrastructure investment required across wastewater network",
          "Regulatory framework underdeveloped",
          "Public and agricultural acceptance barriers"
        ]
      },
      {
        "title": "Crop Restructuring & Virtual Water Strategy",
        "category": "Governance",
        "potential": "Shifting from water-intensive crops could reduce agricultural water demand by 40%+",
        "current": "Government food sovereignty policy prioritizes domestic production of water-intensive staples",
        "barriers": [
          "Food sovereignty political constraints",
          "Cultural resistance to dietary shifts",
          "10–15 year transition timeline; near-term disruption significant"
        ]
      }
    ],

    "intelligence_brief": [
      "Iran's water crisis is not a drought — it is a systems failure with self-reinforcing feedback loops that make recovery progressively more difficult without structural intervention. The physical data is unambiguous: aquifer depletion at 2–4× natural recharge rates, Lake Urmia at approximately 8% of its 1970 baseline, and groundwater tables declining at an average of 1.2 metres per year. These are not contested estimates — they are satellite-derived measurements from NASA GRACE-FO and documented in UNDP restoration programme reports.",
      "The economic cascade is equally documented. Agricultural production — 92% dependent on water — declined 25% during the 2017–18 drought cycle, driving food price inflation above 40% over the subsequent five years. BIS Working Paper No. 1314 estimates water stress produces a 6–8% GDP reduction under conditions similar to Iran's — an estimate consistent with observed economic performance when isolated from sanctions effects. The Khuzestan protests of 2021, which resulted in multiple fatalities, represent the social expression of this economic cascade: water shortage → power outage → rural economic failure → political mobilisation.",
      "The gap between technical possibility and political achievability is the core constraint. The solutions are known: drip irrigation, treated wastewater reuse, water rights reform, crop restructuring, and coastal desalination. The barriers are not technical — they are geopolitical (sanctions block technology import), political (agricultural constituencies resist reform), and institutional (water governance frameworks are inadequate for crisis management). This assessment cannot responsibly project a positive trajectory without evidence of structural change in these domains. For investors, this means water-exposed Iranian assets carry unpriced transition risk. For policymakers, the window for managed adaptation is narrowing."
    ],

    "trajectory": [
      "Iran has crossed two critical quantitative thresholds that water resource economists use to define 'water scarce' and 'water bankrupt' conditions: per capita availability below 1,000m³ per year across large portions of the country (absolute scarcity), and groundwater extraction rates exceeding natural recharge by more than 2:1 (liquidation of aquifer capital). Once aquifer systems are drawn down to economic exhaustion depths, recovery on human timescales is not possible — the resource is effectively consumed.",
      "The most likely near-term trajectory — absent significant policy intervention — is continued rural depopulation, rising food import dependency, increasing urban water rationing, and episodic political instability linked to water and food price shocks. This is not a prediction; it is a pattern documented in comparable cases (Yemen, parts of Pakistan, northern India) and consistent with the directional trends observable in current Iranian data. The question is not whether these outcomes occur, but at what pace and with what political consequences.",
      "A more positive trajectory is technically achievable but requires simultaneous action on three fronts: efficiency (drip irrigation deployment at scale), supply augmentation (coastal desalination with inland distribution), and governance reform (water pricing that reflects scarcity). The geopolitical constraint — sanctions limiting technology access — is not insurmountable but requires diplomatic progress that falls outside the scope of water policy. For analytical purposes: the technical solutions exist; the question is whether the political conditions for their implementation will emerge before physical constraints become irreversible."
    ],

    "sources": [
      { "name": "WRI Aqueduct 4.0",                          "url": "https://www.wri.org/aqueduct" },
      { "name": "NASA GRACE-FO Groundwater Data",             "url": "https://grace.jpl.nasa.gov" },
      { "name": "FAO AQUASTAT",                              "url": "https://www.fao.org/aquastat" },
      { "name": "BIS Working Paper No. 1314",                 "url": "https://www.bis.org/publ/work1314.htm" },
      { "name": "Lake Urmia Restoration Programme (UNDP)",    "url": "https://www.undp.org/iran/projects/lake-urmia-restoration-programme" },
      { "name": "Iran Ministry of Energy — Water Resources",  "url": null },
      { "name": "Bluefield Research — MENA Water Markets",   "url": null },
      { "name": "USGS International Water Data",             "url": "https://www.usgs.gov/mission-areas/water-resources" }
    ]
  }$json$::jsonb
);

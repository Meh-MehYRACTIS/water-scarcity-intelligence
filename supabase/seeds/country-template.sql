-- ============================================================
-- Water Scarcity Intelligence Project
-- NEW COUNTRY TEMPLATE
--
-- HOW TO ADD A NEW COUNTRY:
--   1. Copy this file, rename it e.g. seeds/mexico.sql
--   2. Fill in every placeholder marked with <<FILL IN>>
--   3. Paste the completed SQL into the Supabase SQL Editor
--   4. Click "Run" — the country appears in the app immediately
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
  '<<FILL IN: e.g. Mexico>>',
  '<<FILL IN: ISO 2-letter code, lowercase, e.g. mx>>',
  '<<FILL IN: e.g. Latin America>>',
  '<<FILL IN: risk score, e.g. B– or CCC>>',
  '<<FILL IN: e.g. Elevated / Stable>>',
  '<<FILL IN: e.g. Case Study · United Mexican States · Latin America>>',
  '<<FILL IN: one-sentence headline>>',
  '<<FILL IN: 2–3 sentence deck/subtitle>>',
  '<<FILL IN: YYYY-MM-DD>>',
  '1.0',
  $json${
    "data_sources_list": ["<<Source 1>>", "<<Source 2>>"],

    "risk_description": [
      "<<Paragraph 1 explaining the rating>>",
      "<<Paragraph 2 with key physical thresholds crossed>>",
      "<<Paragraph 3 on outlook trend>>"
    ],

    "scarcity_stats": [
      { "value": "<<e.g. −40%>>",    "label": "<<what the number measures>>", "sub": "<<source or context>>" },
      { "value": "<<e.g. 68%>>",     "label": "<<what the number measures>>", "sub": "<<source or context>>" },
      { "value": "<<e.g. −0.8m>>",   "label": "<<what the number measures>>", "sub": "<<source or context>>" },
      { "value": "<<e.g. 3,400m³>>", "label": "<<what the number measures>>", "sub": "<<source or context>>" }
    ],

    "timeline": {
      "title": "<<e.g. Lake Chapala Surface Area: Documented Decline>>",
      "subtitle": "<<e.g. Percentage of 1980 baseline volume>>",
      "data": [
        { "year": 1980, "value": 100, "label": "<<absolute value e.g. 8,000 km²>>" },
        { "year": 1990, "value": 85,  "label": "<<>>" },
        { "year": 2000, "value": 70,  "label": "<<>>" },
        { "year": 2010, "value": 55,  "label": "<<>>" },
        { "year": 2020, "value": 40,  "label": "<<>>" },
        { "year": 2025, "value": 32,  "label": "<<>>" }
      ]
    },

    "scarcity_analysis": [
      "<<Paragraph 1: physical geography and climate context>>",
      "<<Paragraph 2: specific water body or aquifer case study>>"
    ],

    "cascade_steps": [
      {
        "key": "W",
        "title": "Water",
        "subtitle": "<<summary of physical depletion>>",
        "metrics": ["<<metric 1>>", "<<metric 2>>", "<<metric 3>>", "<<metric 4>>"],
        "detail": "<<2–3 sentences explaining the depletion mechanism>>"
      },
      {
        "key": "A",
        "title": "Agriculture",
        "subtitle": "<<summary of agricultural exposure>>",
        "metrics": ["<<metric 1>>", "<<metric 2>>", "<<metric 3>>", "<<metric 4>>"],
        "detail": "<<2–3 sentences on agricultural vulnerability>>"
      },
      {
        "key": "E",
        "title": "Economics",
        "subtitle": "<<summary of economic transmission>>",
        "metrics": ["<<metric 1>>", "<<metric 2>>", "<<metric 3>>", "<<metric 4>>"],
        "detail": "<<2–3 sentences on economic cascade>>"
      },
      {
        "key": "S",
        "title": "Social",
        "subtitle": "<<summary of social instability risk>>",
        "metrics": ["<<metric 1>>", "<<metric 2>>", "<<metric 3>>", "<<metric 4>>"],
        "detail": "<<2–3 sentences on social/political transmission>>"
      }
    ],

    "technology_solutions": [
      {
        "title": "<<Technology name>>",
        "category": "Efficiency",
        "potential": "<<what it could achieve>>",
        "current": "<<current adoption state>>",
        "barriers": ["<<barrier 1>>", "<<barrier 2>>", "<<barrier 3>>"]
      },
      {
        "title": "<<Technology name>>",
        "category": "Supply",
        "potential": "<<what it could achieve>>",
        "current": "<<current adoption state>>",
        "barriers": ["<<barrier 1>>", "<<barrier 2>>", "<<barrier 3>>"]
      },
      {
        "title": "<<Technology name>>",
        "category": "Governance",
        "potential": "<<what it could achieve>>",
        "current": "<<current adoption state>>",
        "barriers": ["<<barrier 1>>", "<<barrier 2>>", "<<barrier 3>>"]
      }
    ],

    "intelligence_brief": [
      "<<Paragraph 1: physical data — what is unambiguous>>",
      "<<Paragraph 2: economic cascade — documented evidence>>",
      "<<Paragraph 3: gap between technical solutions and political achievability>>"
    ],

    "trajectory": [
      "<<Paragraph 1: thresholds already crossed>>",
      "<<Paragraph 2: most likely near-term trajectory without intervention>>",
      "<<Paragraph 3: conditions required for a positive trajectory>>"
    ],

    "sources": [
      { "name": "<<Source name>>", "url": "<<https://url or null>>" },
      { "name": "<<Source name>>", "url": "<<https://url or null>>" },
      { "name": "<<Source name>>", "url": "<<https://url or null>>" }
    ]
  }$json$::jsonb
);

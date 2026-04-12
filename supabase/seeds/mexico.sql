-- ============================================================
-- Water Scarcity Intelligence Project
-- Country Seed: United Mexican States
-- Run this in Supabase SQL Editor (after schema.sql)
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
  'Mexico',
  'mx',
  'Latin America',
  'B–',
  'Elevated / Deteriorating',
  'Case Study · United Mexican States · Latin America',
  'A Nation of 130 Million People Draining Its Last Aquifers',
  'Mexico''s northern states already operate below absolute water scarcity thresholds. The Valley of Mexico sinks as its aquifer collapses. One hundred and five of 653 national aquifers are overexploited. The national average masks a regional crisis that is compounding faster than institutional responses can match.',
  '2026-04-12',
  '1.0',
  $json${
    "data_sources_list": ["CONAGUA", "WRI Aqueduct", "NASA GRACE-FO", "FAO AQUASTAT"],

    "risk_description": [
      "Mexico's B– rating reflects a country in transition from water stress to water crisis. The national average obscures extreme regional disparities: while Mexico's overall per capita water availability sits at 3,663 m³ per year, central and northern regions average just 1,528 m³ per year — below the internationally recognised water stress threshold of 1,700 m³. In the country's most productive agricultural zones, aquifers are being drawn down at 2–5 metres per year.",
      "One hundred and five of Mexico's 653 national aquifers are formally classified as overexploited by CONAGUA. The Valley of Mexico aquifer — the primary water source for a metropolitan area of 22 million people — is being extracted at three times its natural recharge rate, causing Mexico City to sink at rates of up to 35 centimetres per year in some zones. Lake Chapala, Mexico's largest freshwater lake and a critical water source for Guadalajara, has declined to 38% of capacity as of 2024.",
      "The deteriorating outlook reflects a widening gap between institutional response capacity and the pace of depletion. Mexico requires an estimated US$6.6 billion per year in water infrastructure investment; current government allocations are approximately one-seventh of that figure. Groundwater is legally free for agricultural users, creating structural incentives for continued over-extraction. Climate projections indicate increasing aridity across northern and central Mexico through 2050."
    ],

    "scarcity_stats": [
      {
        "value": "38%",
        "label": "Lake Chapala at percentage of capacity (May 2024)",
        "sub": "Down from 82% in 2018 — CONAGUA"
      },
      {
        "value": "71%",
        "label": "of Mexico's territory under high or very high water stress",
        "sub": "Per WRI Aqueduct 4.0"
      },
      {
        "value": "−5m",
        "label": "Annual aquifer decline in El Bajío — Mexico's agricultural heartland",
        "sub": "CEO Water Mandate / CONAGUA data"
      },
      {
        "value": "1,528m³",
        "label": "Per capita water in central and northern regions",
        "sub": "Below the 1,700m³ water stress threshold"
      }
    ],

    "timeline": {
      "title": "Lake Chapala: Storage Level as % of Capacity",
      "subtitle": "Mexico's largest freshwater lake — primary supply for Guadalajara metro (5M people)",
      "data": [
        { "year": 1980, "value": 95,  "label": "~6,800 km³ storage" },
        { "year": 2001, "value": 40,  "label": "Historical crisis low" },
        { "year": 2005, "value": 78,  "label": "Recovery after interventions" },
        { "year": 2015, "value": 68,  "label": "Gradual renewed decline" },
        { "year": 2020, "value": 55,  "label": "Pre-drought baseline" },
        { "year": 2024, "value": 38,  "label": "Critical drought conditions" }
      ]
    },

    "scarcity_analysis": [
      "Mexico's water geography is defined by a profound mismatch between where water exists and where people live. Roughly 70% of Mexico's rainfall falls in the south and southeast — regions that account for only 23% of the population. The north and centre, home to 77% of Mexicans and the bulk of agricultural production, receive less than a third of national precipitation. This structural mismatch has driven decades of groundwater extraction that now exceeds sustainable yields across the country's most economically significant regions.",
      "The Valley of Mexico exemplifies the crisis at its most acute. Mexico City and its metropolitan area of 22 million people sit on a former lakebed at 2,240 metres above sea level, hundreds of kilometres from the coast, dependent on a collapsing aquifer and a complex inter-basin transfer system (the Cutzamala) that itself operates under chronic stress. NASA GRACE-FO satellite data documents groundwater volume losses of 0.86–12.57 km³ per year across the valley between 2014 and 2021. The land is subsiding at up to 35 centimetres per year in central zones — the highest rate of urban subsidence of any major city on earth — damaging infrastructure, cracking pipelines, and accelerating the very water loss it results from."
    ],

    "cascade_steps": [
      {
        "key": "W",
        "title": "Water",
        "subtitle": "Regional depletion masked by a misleading national average",
        "metrics": [
          "105 of 653 aquifers formally overexploited (CONAGUA)",
          "El Bajío aquifer: declining 2–5m per year",
          "Valley of Mexico: groundwater loss 0.86–12.57 km³/year (NASA GRACE-FO)",
          "Mexico City subsidence: up to 35cm/year — world's highest urban rate"
        ],
        "detail": "The overexploitation pattern is concentrated in Mexico's most economically valuable regions: the agricultural belt of El Bajío, the industrial north, and the Valley of Mexico. These are not peripheral areas — they generate the majority of Mexico's agricultural exports, industrial output, and GDP. The depletion is not uniform but it is precisely targeted at the country's productive core."
      },
      {
        "key": "A",
        "title": "Agriculture",
        "subtitle": "76% of national water use concentrated in water-scarce regions",
        "metrics": [
          "Agricultural share of water use: 76%",
          "Workforce employed in agriculture: 12%",
          "El Bajío produces 90% of Mexico's frozen produce exports",
          "6.45 million hectares under irrigation; 41% dependent on groundwater"
        ],
        "detail": "Mexico's agricultural export model — built around water-intensive crops in semi-arid zones — is structurally dependent on groundwater that is being liquidated. El Bajío, which supplies a disproportionate share of Mexico's fresh and frozen produce exports to the United States and Canada, extracts from aquifers that the CEO Water Mandate projects will become economically unfeasible for pumping within 20 years at current rates."
      },
      {
        "key": "E",
        "title": "Economics",
        "subtitle": "Drought translates directly into GDP deceleration and inflation",
        "metrics": [
          "GDP growth: 4.6% (2022) → 2.4% (2023) → 0.9% Q4 2024",
          "Inflation peak: 8.7% year-on-year (August–September 2022)",
          "US$6.6 billion/year investment gap in water infrastructure",
          "Current government water budget: ~$900 million/year (one-seventh of need)"
        ],
        "detail": "The 2022–2024 drought cycle produced a measurable economic signature: GDP growth decelerated from 4.6% to under 1% over two years, with agricultural sectors recording particularly weak performance. The Dallas Federal Reserve attributes significant portions of Mexico's economic slowdown to drought-related agricultural and industrial disruption. The investment gap — $6.6 billion needed annually versus $900 million allocated — ensures the infrastructure deficit compounds each year."
      },
      {
        "key": "S",
        "title": "Social",
        "subtitle": "Water access inequality and documented conflict",
        "metrics": [
          "22 million Mexicans without access to piped water",
          "74 million (57% of population) without safely managed drinking water",
          "La Boquilla Dam seizure (Chihuahua, 2020): farmers vs. federal government",
          "Indigenous and community protests against industrial water extraction ongoing"
        ],
        "detail": "The 2020 seizure of La Boquilla Dam in Chihuahua — in which farmers occupied federal infrastructure to block water transfers required under the 1944 US–Mexico Water Treaty — is the most visible expression of water-driven political conflict. It resulted in deaths and a national security deployment. Less visible but equally significant: protests against Coca-Cola and Danone bottling operations extracting from community aquifers have spread across multiple states, reflecting a widening gap between industrial water access and community water security."
      }
    ],

    "technology_solutions": [
      {
        "title": "Aquifer Recharge & Managed Water Storage",
        "category": "Supply",
        "potential": "Reversal of depletion trajectories in El Bajío and Valley of Mexico with sustained investment",
        "current": "Pilot recharge programmes exist; not deployed at scale relative to extraction volumes",
        "barriers": [
          "Groundwater legally free for agricultural users — no price signal for conservation",
          "Weak enforcement of extraction permits (volume and location not monitored)",
          "Infrastructure investment 7x below estimated requirement"
        ]
      },
      {
        "title": "Drip Irrigation & Precision Water Management",
        "category": "Efficiency",
        "potential": "30–50% reduction in agricultural water use; proven at scale in Israel and Spain",
        "current": "Adoption accelerating in export-oriented sectors; smallholder adoption <15%",
        "barriers": [
          "Subsidised electricity reduces cost of groundwater pumping — removing conservation incentive",
          "Smallholder capital constraints; limited access to credit for equipment",
          "Technical assistance infrastructure insufficient for national scale-up"
        ]
      },
      {
        "title": "Desalination (Pacific & Gulf Coast Access)",
        "category": "Supply",
        "potential": "Mexico has 11,122 km of coastline; existing plants in Baja California and Gulf states",
        "current": "La Paz and Los Cabos plants operational; 5 new public-private projects planned ($100M)",
        "barriers": [
          "High energy cost relative to current subsidised groundwater pumping",
          "Pipeline infrastructure required to move water to inland population centres",
          "Political economy: desalination investment competes with cheaper (subsidised) groundwater"
        ]
      },
      {
        "title": "Water Pricing Reform & Groundwater Metering",
        "category": "Governance",
        "potential": "Eliminating free agricultural groundwater access is the single highest-leverage policy intervention",
        "current": "Legal and political framework has not changed; metering infrastructure largely absent",
        "barriers": [
          "Agricultural lobby has historically blocked water pricing reform",
          "Political sensitivity: rural water users are a key electoral constituency",
          "CONAGUA enforcement capacity is under-resourced relative to mandate"
        ]
      },
      {
        "title": "Wastewater Treatment & Reuse",
        "category": "Efficiency",
        "potential": "Only 57% of wastewater currently treated; raising to 80% would add significant supply",
        "current": "43% of wastewater discharged untreated; urban reuse programmes nascent",
        "barriers": [
          "Treatment infrastructure investment gap mirrors overall water sector underinvestment",
          "Regulatory frameworks for agricultural reuse of treated water underdeveloped",
          "40% of distributed water lost to leaks before reaching end users"
        ]
      },
      {
        "title": "Inter-Basin Transfer & Cutzamala Modernisation",
        "category": "Supply",
        "potential": "Modernising the Cutzamala system could reduce losses and extend its operational life",
        "current": "Cutzamala operates at aging infrastructure; has reached critically low levels in recent years",
        "barriers": [
          "Cutzamala is a symptom management tool — it does not address Valley of Mexico aquifer depletion",
          "Climate change reducing highland reservoir catchment reliability",
          "Mexico City's water demand continues to grow faster than any single infrastructure solution"
        ]
      }
    ],

    "intelligence_brief": [
      "Mexico's water crisis is structurally distinct from Iran's but follows the same logical progression: extraction exceeding recharge, leading to agricultural exposure, leading to economic vulnerability, leading to social instability. What separates Mexico from Iran at this stage is institutional capacity and geographic diversity — Mexico has functioning governance structures, significant coastal resources for desalination, and regions where rainfall remains adequate. What makes Mexico's trajectory dangerous is that none of these advantages are being systematically deployed. The country has the tools. It is choosing not to use them at the required scale.",
      "The economic fingerprint is already visible. The 2022–2024 drought cycle produced GDP deceleration from 4.6% to under 1% growth over two years, with the Dallas Federal Reserve explicitly identifying drought as a contributing factor in Mexico's economic slowdown. El Bajío — which supplies 90% of Mexico's frozen produce exports — extracts from aquifers that credible analysis projects will become economically unfeasible for pumping within 20 years at current rates. When El Bajío's agricultural system contracts, it will not merely affect domestic food supply. It will disrupt supply chains across North America, carrying implications for US–Mexico trade relationships and regional food system stability that are not yet priced into markets.",
      "The governance failure is the most consequential variable. Groundwater is free for agricultural users under Mexican law. Subsidised electricity makes pumping artificially cheap. CONAGUA issues extraction permits but lacks the monitoring infrastructure to enforce them. The result is a commons tragedy playing out in slow motion: individually rational extraction decisions are collectively liquidating shared aquifer resources. The solutions — groundwater pricing, metering, recharge investment, efficiency incentives — are technically straightforward and institutionally achievable. They require political will to confront agricultural constituencies that have successfully blocked reform for decades. That political calculation is changing as the physical reality becomes undeniable, but the pace of change lags the pace of depletion."
    ],

    "trajectory": [
      "Mexico has not yet crossed the irreversible thresholds that define Iran's situation, but it is approaching several of them in specific regions. El Bajío aquifers projected to reach economic extraction limits within 20 years represent a hard physical constraint on Mexico's most productive agricultural zone. The Valley of Mexico's subsidence — at 35 centimetres per year in some areas — is damaging infrastructure faster than it can be repaired and accelerating water loss through cracked distribution networks. These are not projections; they are current measured realities with compounding trajectories.",
      "The most likely near-term scenario without significant policy change: continued aquifer depletion in northern and central states; episodic water crises in Mexico City and Guadalajara tied to Cutzamala reservoir levels and drought cycles; agricultural output volatility in El Bajío translating to supply chain disruption for North American food markets; and periodic water-driven political conflict as communities and industries compete for shrinking resources. Mexico's history — including the La Boquilla Dam seizure of 2020 — demonstrates that water conflict, once it starts, does not stay contained to the water sector.",
      "A positive trajectory is more achievable for Mexico than for Iran, precisely because Mexico has not yet exhausted its aquifers and retains functional institutions capable of reform. The minimum required interventions are: ending the free water policy for agricultural groundwater extraction; deploying metering at scale; redirecting existing subsidies from pumping energy toward efficiency investment; and accelerating desalination on both coasts. None of these is technically complex. All of them require displacing entrenched interests that benefit from the current arrangement. Mexico has a narrowing window — perhaps 10–15 years in the most stressed regions — before depletion becomes irreversible."
    ],

    "sources": [
      { "name": "WRI Aqueduct 4.0",                                    "url": "https://www.wri.org/aqueduct" },
      { "name": "CONAGUA — Statistics on Water in Mexico",             "url": "https://www.conagua.gob.mx" },
      { "name": "NASA GRACE-FO Groundwater Data",                      "url": "https://grace.jpl.nasa.gov" },
      { "name": "FAO AQUASTAT — Mexico Country Profile",               "url": "https://www.fao.org/aquastat/en/countries-and-basins/country-profiles/country/MEX" },
      { "name": "CEO Water Mandate — El Bajío Aquifer Study",          "url": "https://ceowatermandate.org" },
      { "name": "Khorrami et al. (2023) — Valley of Mexico (GRL)",     "url": "https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2022GL101962" },
      { "name": "Dallas Fed — Mexico Economic Update (2025)",          "url": "https://www.dallasfed.org/research/update/mex" },
      { "name": "BIS Working Paper No. 1314",                          "url": "https://www.bis.org/publ/work1314.htm" }
    ]
  }$json$::jsonb
);

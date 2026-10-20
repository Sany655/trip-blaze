```
flowchart TD
    A["Curated Spot Registry<br/>(Names, Division, District, Price, Days)"] --> C["Automated Enrichment Script<br/>(scripts/fetch-bd-spots.js)"]
    B1["Wikidata & Wikipedia API<br/>(Authentic Summary & Geo-coordinates)"] --> C
    B2["Wikimedia Commons API<br/>(High-res, copyright-free spot photos)"] --> C
    C --> D["frontend/src/data/bangladeshSpots.json<br/>(Clean, Rich, Structured Spot Data)"]
    D --> E["Data Adapter / Aggregator<br/>(frontend/src/data/index.js)"]
    E --> F["DataService / UI Components<br/>(Tours.tsx, Details, Filters)"]
```


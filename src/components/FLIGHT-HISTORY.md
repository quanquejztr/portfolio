# Additional flight history

`additionalFlightHistory.json` transcribes the owner's five typed 2015 flights and the four supplied flight-log screenshots (2017, 2018, 2019 and the visible ten rows from 2020). These records describe journeys only; no boarding passes, seats, times, barcodes or aircraft details have been invented.

`flightHistory.js` merges those 31 records with the 65 existing boarding-pass records for map routes and flight/airline counts. The pass stack continues to use `flightPasses.json` alone.

Duplicate identity: date, normalized flight number, origin and destination. Prefer the boarding-pass record. Four supplied records already existed:

- 2020-10-06 VN1384 SGN → DLI
- 2020-10-23 VN7380 SGN → DLI
- 2020-11-10 VN1266 SGN → VII
- 2020-12-10 VN266 SGN → HAN

Result: 27 new map-only journeys; 92 total unique journeys; 65 boarding passes. Repeated routes and numbers on different dates are retained. Unknown dates in existing pass records are not guessed.

Coordinates for BKK, CAN, DAD, HKT, HUI, KUL, PEK, PVG, SIN and VDH were copied from the existing local Airside Machine airport dataset (`work/redesign/airside-machine-source/data/airports.csv`), using the IATA code as the lookup key. They are stored in `flightMapData.json` alongside the existing airports. The existing map projection and great-circle geometry are unchanged.

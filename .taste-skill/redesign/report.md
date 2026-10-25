# Portfolio redesign — final report

Direction: **The dark room**, seed **1069537086**, retaining the existing navy/white/gold palette, DM Sans and Archivo Black, original first page and animated wave. The existing React stack and personal interactions remain.

Three blueprint redraws: project photo panels became an index because there were no honest project photos; passing portraits became a wide biography because the portrait was explicitly removed; the project index became one dominant actual application screenshot when the brief narrowed to Airside Machine alone. The compact flight interface follows the user's requested 50/50 layout.

## Final visual critique

ROUND 3
Seen in one second: a personal introduction, followed by strong section titles against navy.
Idea (one sentence): Cuong's engineering work and personal history are explored through a live collection of aircraft, photographs and flight documents.
Live thing: selecting a boarding pass changes its map route; the biography opens an aircraft model or team photographs.
Layout words by section: hero=introduction / about=split paragraph / timeline=horizontal line / tech=grouped gallery / projects=dominant screenshot / places=interactive split / contact=inverse statement.
Scores: design 6.5 · usability 7 · creativity 7 · content 8 → overall 6.9.
Caps applied: conservatively cap design at 6.5 because the default composition does not expose four real photographs outside interface fragments; cap usability at 7 because the preserved first page has no primary filled action. This remains below 7.5; it is not presented as an award-level result.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. The phone's preserved first page leaves a substantial quiet band and a small introduction (mobile-fold.jpg). A future hero redesign could increase its hierarchy; this pass honors the explicit request to retain it.
2. Some original airline document labels have weak contrast (desktop-page-02.jpg and flight interaction screenshots). Improving those would require changing the retained document designs.
3. Most photography is inside the optional team view or paper pass interface (desktop-page-01.jpg). Exposing team photographs by default would improve photographic richness but change the requested click-to-open behavior.

The earlier wide biography measure and inconsistent section edges were tightened; the project now has a real screenshot and one substantial description; contact has an honest direct-submit form with pending, error and confirmation states. The About heading is static so it does not collide with opened imagery.

## Before and after evidence

| Check | Before | After |
| --- | --- | --- |
| Rendered inspector | 10 failures, 11 warnings | 0 failures, 9 warnings |
| Desktop page height | 7.1 screens | 6.4 screens |
| Longest text measure | 115 characters | 81 characters |
| New presentation source lint | — | 0 failures, 0 warnings |

Final inspector used the explicit `focal-point` exemption for the user-preserved hero. Remaining warnings include source airline contrast, type-size count, no first-screen filled action, photography/footage heuristics, the explicitly requested horizontal gallery, timeline spacing heuristics and preserved mobile hero spacing/type. All seven final desktop/tablet/phone inspector screenshots were opened and reviewed. No page-level horizontal overflow was found.

Screenshots and machine report: `after-inspect/`. Interactive browser evidence: `interaction-checks/`.

## Content and assets

Airside Machine is the only project. Its description was written from the public repository README and implementation. The image is an actual locally running application screenshot, captured from an isolated demo save, not an invented mockup. The demo airline and starting balance are game state, not portfolio business claims. OpenStreetMap attribution appears below the screenshot and in `public/photos/projects/ASSET-CREDITS.md`. No stock imagery was added. Existing user-provided photographs, airline assets and tickets remain their own interface content.

Removed the requested timeline and flight scrolling instruction lines. Existing aircraft, team-photo, company-logo, altar, gallery and map interactions remain.

## Validation and launch limits

- Production build succeeded.
- Eight focused suites: 31 tests passed.
- Browser checks at 1440, 768 and 390 pixels covered project image loading, removed copy, team gallery, focused flight, map zoom, pass modal, contact preview and overflow.
- A local mock HTTP endpoint verified direct form POST encoding, disabled pending state, accepted response/reset, failure text preservation and retry. No real email was sent.
- Netlify Forms needs form detection enabled, a deployment and an email notification configured for stephenluong24@gmail.com. Live submission and email delivery remain to be tested after deployment. See `NETLIFY-FORMS.md`.

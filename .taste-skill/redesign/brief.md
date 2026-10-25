# Redesign brief
Use Dark room, seed 1069537086. Preserve original first page and moving wave; navy #002233, white, gold #dbcea5, DM Sans and Archivo Black. The user rejected the prior tabbed-folder styling; do not repeat it.

# Subject inventory
Cuong Luong; Ho Chi Minh City upbringing; USF computer science degree; FPT, OPSWAT and Apple internships; Apple Streaming Media Ecosystem Tech photos; 787-9 flight simulation interest; Airside Machine's real-data airline economy; 39 paper passes and 26 Wallet displays; real routes highlighted by selected passes; five future destinations; NextLeg's hurricane-disruption purpose; local Gmail JobTracker; DevShield and the Java compiler.

# Argument / proof / copy deck
Hero: Cuong is a software engineer -> preserved intro and cycling words.
About: the person, work and curiosity -> complete user-provided biography and all inline interactions. Heading: About me. No new biography facts.
Timeline: his education and internships -> original milestones, logos, default USF focus, straight continuation line.
Tech stack: actual tools grouped by function -> original 20 logos and horizontal gallery.
Projects: tools built for concrete problems -> names as a selectable large index, original project descriptions, two actual project artworks. No generic laptop stock image. NextLeg: hurricane-disruption assistance; JobTracker: local Gmail tracking; DevShield: CI/CD security; Diminished JavaCompiler: a compiler built from scratch. No new claims or performance figures.
Travel: an aviation interest made tangible -> exact 65 flight records; circular paper-first pass stack and linked map. Compact 50/50 layout preserved. Heading: Places I have been. Below map: Route, Flight, Distance. Future trips: Washington DC, New York, San Francisco, Chicago, Los Angeles; each ticket purchasing...
Contact: a way to reach him -> existing email, phone and three social links. Heading: Let's talk. Large email link, optional message form using the existing mailto mechanism.

# Idea
On this page, Cuong's engineering work, Apple summer photographs and personally collected tickets become the exhibits of a continuous navy gallery.
Live thing: select real work to read it, select a real pass to see its route; existing aircraft and team-photo explorers remain.

# Redraws and constraints
Two section redraws: full-screen photographed work panels cannot be filled honestly (only two logo artworks exist), so use Big names, fixed preview. About's passing portraits conflict with the user's explicit request to remove his picture and retain a complete bio, so use Side facts, wide paragraph as the compositional base with the existing optional 60/40 preview. Keep all facts in the bio and timeline rather than inventing sidebar statistics. Hero remains under the user's explicit preservation instruction. Gallery's staggered photographs cannot replace the explicitly requested compact 50/50 flight UI. Contact's email-display composition retains the existing message feature in a disclosure rather than deleting it.
No invented sample data, project screenshots, found photos or stock replacements. Existing personal imagery only.

# User steering during implementation
Only Airside Machine remains in Projects. Removed NextLeg, JobTracker, DevShield and the compiler. The actual Airside repo was read (README, phase implementation notes and source). Summary covers implemented fleet/route/schedule/AI/economic systems; unbuilt marketing/onboarding are not claimed. Added actual screenshot of the aircraft marketplace from an isolated local demo save, with OpenStreetMap attribution. Redrew work to Oversized visual, small cluster because the index cannot represent a single project honestly. Removed the timeline's mouse-wheel instruction, its explanatory subtitle, and the flight scroll instruction exactly as requested.

The contact feature was verified as an email-draft flow at all three widths. User asked about direct web sending; explained that it requires a backend/email provider and asked which host they use. No direct sending or delivery success is claimed while that remains unconfigured.


Final hosting decision: Netlify. Contact now submits directly through Netlify Forms rather than opening a mail draft. Site form detection, redeployment and email notification setup remain account-side launch steps; see NETLIFY-FORMS.md.

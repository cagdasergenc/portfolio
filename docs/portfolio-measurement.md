# Portfolio first impression and measurement

The opening gives Product / UX recruiters a role, specialisms, research evidence and a next action in one view. Both projects are direct links. The previous scroll-pinned Stage is no longer mounted; its implementation remains available for rollback.

## Keep the current analytics migration

This change preserves the dedicated property introduced in c99ce48: G-MEDT993FR5 (property 556481991), and its existing event names. The older G-P1EHBYG8NY stream lives in a shared Firebase property and contains the historical September baseline. Do not silently switch the site back to it or compare the two properties as a continuous series.

App.jsx owns manual page views and index.html uses send_page_view: false. Enhanced Measurement's browser-history page-view option must be off to avoid another page_view on the same route change. On 29 September 2026, this option was disabled and verified off in both the historical stream (15510849373) and the dedicated stream (15866363079), with owner approval. Other automatic measurements remain enabled.

Tracking loads only on cagdasergenc.com and www.cagdasergenc.com. Local development and deployment previews stay out. Manual page views depend on pathname, so hash-only changes do not create another page view. Page URLs omit query strings and fragments. Short lowercase utm_source, utm_medium and utm_campaign slugs are explicitly mapped to campaign fields at initialization. Labels must start with a letter, contain only letters/digits/underscores/hyphens, and be at most 64 characters; never include personal information. Other campaign parameters are not explicitly retained.

| Event | Trigger | Parameters | Interpretation |
| --- | --- | --- | --- |
| case_study_select | Hero, hero image or selected-work link | placement, project | Project interest |
| cv_download | CV link on home or case study | placement | Existing name preserved; records a click, not completed download |
| email_click | Email link on home or case study | placement | Intent, not a sent email |
| linkedin_click | Contact-section LinkedIn link | placement | Profile interest |
| open_live_app | Case-study live-app link | placement, project | Existing name preserved |
| deck_preview | Case-study deck preview control | project | Existing name preserved |
| shop_visit | Shop link | shop | Existing tracking preserved |

Custom action events include a clean current page_location. Standard file_download and outbound click events may also fire for the same interaction; do not sum them with custom events as separate outcomes.

## Release checks

After deployment, verify page views and each new action in GA4 DebugView/Realtime on the live hostname. Register event-scoped placement/project dimensions if needed. Check the existing key-event configuration before marking email_click or cv_download. This code does not change key-event settings. Production owner visits still count unless filtered; host gating does not repair historical pollution.

A sample attribution link is https://cagdasergenc.com/?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio_profile .

## Eight-second evaluation

Eight seconds is a comprehension target, not a universal attention limit. Show the first screen to five relevant people for eight seconds, hide it, then ask: What role? What type of work? What evidence? What would you click? Revise based on misunderstandings. Low traffic makes this more useful than an A/B test. Later compare sessions with project selection, CV clicks and email intent by source and device; annotate analytics migration and correction dates.

Build, ESLint and 76 tests pass after integration of the latest upstream analytics change. Desktop (1280×720) and mobile (390×844) were visually checked, including first-viewport actions, no mobile horizontal overflow and featured-case-study navigation. New custom-event receipt remains a production release check.

References: https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/ ; https://support.google.com/analytics/answer/12195621 ; https://developers.google.com/analytics/devguides/collection/ga4/reference/config

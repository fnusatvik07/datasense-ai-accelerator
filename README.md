# DataSense · AI Accelerator: Landing + Intake

Static landing page with a Typeform-style intake that people fill out before their discovery call.
It's hosted on **GitHub Pages**. Responses go to a **Google Sheet** (one row per person, downloadable as Excel).

```
index.html            landing page + 24-step intake in 5 sections (mostly tap-to-select)
config.js             SCRIPT_URL (Google Apps Script endpoint) + optional BOOKING_URL
apps-script/Code.gs   receiver that appends each submission to the Sheet
```

## What the intake collects
Name · email · WhatsApp · LinkedIn · current stage · experience · title & company · industry ·
day-to-day work · projects built · target role · timeline ·
hours/week · focus time · coding comfort (1–5) · tools used · learning style · work style ·
what they enjoy · what they do when stuck · where they're stuck · strengths · biggest weakness · 3-month success · **discovery-call availability** ·
free-text notes. It also auto-captures timezone, a fun "archetype", and the timestamp.

**Availability:** 1-hour slots in PST. Weekdays (Nov 5, 6, 9–13) run 6 PM–12 AM. Weekends (Nov 7, 8, 15) run 8 AM–12 AM.
Each slot also shows the person's local time. To change dates or hours, edit `CALL_DAYS` and the
`weekend ? 8 : 18` line in `index.html`. Slots less than 2 hours away are hidden automatically.

## Connect the Google Sheet (one time, ~3 min)
1. Create a new Google Sheet, e.g. "Accelerator Intake".
2. **Extensions → Apps Script**. Delete the sample code and paste `apps-script/Code.gs`. Save.
3. **Deploy → New deployment → ⚙ Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy → authorize → copy the **Web app URL** (ends in `/exec`).
4. Paste it into `config.js` as `SCRIPT_URL`, then commit and push. Pages redeploys automatically.
5. Submit a test entry. A `Responses` tab with headers appears in the Sheet.

To download as Excel: **File → Download → Microsoft Excel (.xlsx)**.

> If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

## Local preview
```
python3 -m http.server 8000   # open http://localhost:8000
```

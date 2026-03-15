---
name: allure-front-desk
description: Email the Allure Waikiki front desk for grill reservations or guest notices using gog. Use when Adam asks to reserve a grill or notify front desk about incoming guests.
---

# Allure Front Desk

Send front desk emails to `frontdesk@allurewaikiki.org` with `gog`.

## Supported Requests

### 1) Reserve a grill

Required:
- time

Optional:
- date

Rules:
- If time is missing, ask for it and do not send the email yet.
- If date is missing, default to today in local time.
- Date text must be friendly:
  - Use `Today` when the date is today.
  - Otherwise use `Monday May 17th, 2026` style with weekday, month, ordinal day, and year.
- Keep year correct for the actual date provided.

Subject format:
- `grill for {time} on {friendly_date}`

Body format (use line breaks as shown; blank line before and after the thank-you closing):
- Hi, then blank line. Then: Please reserve us a grill at {time} on {friendly_date}. If there's any issue, please just let me know. Then blank line. Then: Thank you, then newline, then Adam Smith Unit 1608.

Send command:

```bash
gog gmail send --to frontdesk@allurewaikiki.org --subject "grill for {time} on {friendly_date}" --body-file - <<'EOF'
Hi,

Please reserve us a grill at {time} on {friendly_date}. If there's any issue, please just let me know.

Thank you,
Adam Smith Unit 1608
EOF
```

### 2) Guest notice

Required:
- date
- time
- guest names

Rules:
- If any required field is missing, ask for what is missing and do not send the email yet.
- Guest names must be explicitly provided by the user before sending.
- Date text must be friendly:
  - Use `Today` when the date is today.
  - Otherwise use `Monday May 17th, 2026` style with weekday, month, ordinal day, and year.

Subject format:
- `guest notice for {friendly_date} at {time}`

Body format (use line breaks as shown; blank line before and after the thank-you closing):
- Hi, then blank line. Then: We have guests coming on {friendly_date} at {time}. Guest names: {guest_names}. Then blank line. Then: Thank you, then newline, then Adam Smith Unit 1608.

Send command:

```bash
gog gmail send --to frontdesk@allurewaikiki.org --subject "guest notice for {friendly_date} at {time}" --body-file - <<'EOF'
Hi,

We have guests coming on {friendly_date} at {time}. Guest names: {guest_names}.

Thank you,
Adam Smith Unit 1608
EOF
```

## Missing-Field Behavior

Before sending anything, validate required fields:
- Grill request missing time: `What time should I request for the grill?`
- Guest notice missing date: `What date are your guests coming?`
- Guest notice missing time: `What time are your guests arriving?`
- Guest notice missing names: `What are your guests' names?`

Only send after all required fields are present.

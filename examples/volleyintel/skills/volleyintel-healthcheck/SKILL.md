---
name: volleyintel-healthcheck
description: Check both https://volleyintel.com/ and https://volleyintel-backend.onrender.com/health. Use when asked for a healthcheck, uptime check, or to verify site and API status.
---

# VolleyIntel Healthcheck Skill

Run checks for both the website and API on every invocation.

## Required checks

Use shell commands to check both endpoints and capture HTTP status codes:

```bash
web=$(curl -o /dev/null -s -w '%{http_code}' --max-time 10 -I https://volleyintel.com/ || echo 000)
api=$(curl -o /dev/null -s -w '%{http_code}' --max-time 10 https://volleyintel-backend.onrender.com/health || echo 000)
```

Treat unreachable/timeouts as `000`.

## Required behavior

- If `web` and `api` are both `200`, send no messages and finish with exactly `HEALTHY_NO_ALERT`.
- If either value is not `200`, send exactly one Telegram alert to `8136852651` that includes:
  - both status codes
  - a short issue summary
- After sending the alert, finish with exactly `UNHEALTHY_ALERT_SENT`.

Do not send any other messages.

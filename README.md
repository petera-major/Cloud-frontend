# InfraWatch-UI
InfraWatch — API Health & Uptime, Simplified

InfraWatch turns a list of endpoints into a live dashboard of uptime, latency, and errors. It’s designed to be tiny, private, and fast—perfect for personal projects and small teams.

Live Site At: https://infrawatch-iota.vercel.app

**Features**
- Continuous checks with configurable interval per endpoint
- Uptime & latency charts (P50/P95) and error breakdowns
- Alerting to Slack/Discord/webhooks on fail/recover/SLO breach
- Tags & filters for environments and ownership
- Secure: tokens/headers only live on the server

## API (MVP)
- **GET /api/targets** – list registered endpoints
- **POST /api/targets** – add/replace an endpoint
- **GET /api/checks?since=…&target**=… – recent check results
- **GET /api/rollups?window=1h|24h** – uptime %, p95 latency, error counts
- **POST /api/alerts/test** – send a test alert to webhook(s)

## Roadmap
- [ ] SSL/TLS expiry checks
- [ ] Status page (public) with per-tag views
- [ ] Incident annotations & ownership
- [ ] Persist to SQLite/Redis/Postgres
- [ ] Webhook signing & retries

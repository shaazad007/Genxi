# Genxi Quick Start

## Current state

This repository currently contains the imported Node.js engine and a repository scaffold. The Flutter client, control API and execution adapters are planned modules, not runnable implementations yet. The root Kotlin/Gradle starter is not the Genxi Flutter app.

## Repository map

| Path | Purpose | Current state |
|---|---|---|
| `app/` | Flutter Shopify client | Scaffold; T002/T005 |
| `engine/` | Portable Node.js SEO worker | Imported source; Node.js 20+ |
| `control-api/` | OAuth and authenticated control endpoints | Scaffold; T003+ |
| `adapters/github/` | GitHub queue/execution integration | Scaffold; T043/T044 |
| `adapters/gcp/` | Later Cloud execution adapter | Deferred; owner opt-in required |
| `infra/` | Deployment and infrastructure documentation | Scaffold; no resources provisioned |
| `tests/` | Cross-module test organization | Scaffold; no repository-wide test command yet |
| `docs/` | Project setup and architecture notes | Active documentation |
| `AI_WORKSPACE/` | Governance, task records and activity history | Not runtime code |

No `.github/workflows/` directory is included. Review and authorize any future workflow separately before enabling it.

## Engine preview prerequisites

- Install Node.js 20 or newer.
- Configure `SHOPIFY_STORE`, `SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET`, and `GEMINI_API_KEY` in the process environment. Variable names and placeholders are listed in the root `.env.example`; never commit real values.
- Optional fallback variables are `GROQ_API_KEY`, `CLOUDFLARE_API_TOKEN`, and `CLOUDFLARE_ACCOUNT_ID`. The design-profile flags default to `false`.
- From `engine/`, `npm run preview -- --limit=1` selects preview mode. Preview avoids Shopify writes, but it can read Shopify data and call an AI provider, which may incur provider usage charges. Do not run it until the credentials and intended store are reviewed.

The engine's `config.js` attempts to load `.env` through optional `dotenv`, which is not currently a declared package dependency. For reliable local setup, export the variables in the shell or use the hosting platform's secret store; `.env.example` is a names-and-placeholders template, not a credential file.

## Not ready yet

There is no Flutter run command, control API, deploy command, or repository-wide test command at this stage. Those will be documented when the corresponding modules are implemented and validated. Live Shopify writes, deployments, paid cloud resources and Google Cloud/Firebase provisioning require their task-specific owner gates.

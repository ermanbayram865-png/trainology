# Trainology

Trainology is a statically exported Next.js application for evidence-informed fitness calculators.

## Requirements

- Node.js 20.9 or newer
- npm

## Install

Install the locked dependency tree:

```bash
npm ci
```

## Development

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

The full verification command runs tests, type checking, linting, a production build, and `git diff --check`:

```powershell
$env:NEXT_PUBLIC_SITE_URL = "https://example.com"
npm run verify
```

Targeted and relevant regression tests should be run before the full verification command.

## Production Build

Production builds require `NEXT_PUBLIC_SITE_URL` to be a valid public HTTPS origin. It is public configuration, not a secret, and must contain only the origin without credentials, a path, query, or hash.

PowerShell example:

```powershell
$env:NEXT_PUBLIC_SITE_URL = "https://example.com"
npm run build
```

The static export is written to `out/` for deployment to a static host.

## Codex

Read `AGENTS.md` before starting repository work. Before changing a calculator, its scientific claims, or its lifecycle, also read `docs/calculator-governance.md`.

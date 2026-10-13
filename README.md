# EventHub Playwright tests

Playwright tests for EventHub's API and web app. API tests validate responses,
including booking and event JSON schemas; UI and hybrid tests run on Chromium,
Firefox, and WebKit. API tests run once.

## Requirements

- Node.js LTS and npm
- Network access to the EventHub API and web app
- A valid EventHub account; tests create and delete events/bookings

## Setup

```sh
npm ci
npx playwright install
```

Create a root `.env` file for local runs:

```env
EVENTHUB_EMAIL=your-email@example.com
EVENTHUB_PASSWORD=your-password
```

## Run tests

```sh
npx playwright test                         # all suites and browsers
npx playwright test --project=api-only      # API once
npx playwright test --project=ui-firefox    # one browser suite
npx playwright test --project=hybrid-webkit
```

UI tests run headed locally and headless in CI. The GitHub Actions workflow
runs on pushes and pull requests to `main` or `master`.

For Actions, add repository secrets `EVENTHUB_EMAIL` and `EVENTHUB_PASSWORD`
under **Settings → Secrets and variables → Actions**.

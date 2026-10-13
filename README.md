# EventHub Playwright tests

## Preconditions

Before running tests, make sure you have:

- Node.js (the current LTS release is used in CI) and npm installed.
- Network access to the EventHub API at
  `https://api.eventhub.rahulshettyacademy.com/api/` and the web app at
  `https://eventhub.rahulshettyacademy.com`. These URLs are currently defined
  in `api/constants/constants.ts`.
- A valid EventHub account that can sign in through both the API and the web
  app. API and hybrid tests create and remove events and bookings, so the
  account/API must permit those operations.
- A Chromium browser installed for UI and hybrid tests.

API-only tests also require network access and valid credentials, but do not
require a browser installation. Tests authenticate per API fixture; UI-only
tests sign in using the browser, while hybrid tests authenticate through the
API and seed the browser session.

## Setup

Install dependencies and Playwright's Chromium browser:

```sh
npm ci
npx playwright install chromium
```

On Linux CI, install the browser's operating-system dependencies as well:

```sh
npx playwright install --with-deps chromium
```

Provide EventHub credentials in a repository-root `.env` file:

```env
EVENTHUB_EMAIL=your-email@example.com
EVENTHUB_PASSWORD=your-password
```

The account must be valid for the configured EventHub environment. The `.env`
file is ignored by Git. Do not commit credentials. Playwright loads it from the
repository root.

For GitHub Actions, configure repository secrets named `EVENTHUB_EMAIL` and
`EVENTHUB_PASSWORD`; the workflow passes them to the test run.

## Test organization

Tests are grouped by the kind of application surface they exercise:

| Folder | Project | Scope |
| --- | --- | --- |
| `tests/api/` | `api-only` | API requests and responses; no browser UI validation |
| `tests/ui/` | `ui-only` | Browser flows using the UI only, without API fixtures or API test setup |
| `tests/hybrid/` | `hybrid` | Scenarios that use API operations and then validate behavior in the UI |

API, UI-only, and API-authenticated UI fixtures are centralized in `fixtures/`.
Faker-based input builders
shared by API and UI tests are centralized in `testdata/`. API client and schema
validation helpers remain in `api/helpers/`.

The hybrid API-to-UI tests create their own event/booking through the API,
validate it in the browser, and clean up their own records. They do not depend
on API-only tests having run first. The authenticated homepage check also lives
in `tests/hybrid/` because its browser session is provided by the API-backed UI
fixture.

UI-only tests use `ui-only-fixtures.ts`, which signs in through the browser
form and does not use the API fixture or call API endpoints. UI-only tests
therefore require real credentials in `.env`. The UI-only event test navigates
from the events list to an event detail, fills and checks the booking form,
and exercises quantity controls. It intentionally does not submit a booking,
so it cannot leave a persistent booking in the shared application. The
UI-only bookings test verifies that the bookings page loads.

Hybrid tests use `api-authenticated-ui-fixtures.ts`: it obtains a token from
the API fixture and seeds the verified browser storage entry before navigation.
This is distinct from the UI-only fixture, which performs the login in the
browser.

Event and booking response schemas are defined in `api/schemas/`. API tests use
the shared AJV-based `assertJsonSchema` helper to validate record, success,
list, and error responses, including invalid-input responses.

## Running tests

Run each category separately:

```sh
npx playwright test --project=api-only
npx playwright test --project=ui-only
npx playwright test --project=hybrid
```

Run the entire suite:

```sh
npx playwright test
```

Install Chromium before running UI or hybrid tests. The GitHub Actions workflow
installs Playwright browsers and their Linux dependencies before running the
full suite.

Run one hybrid test directly:

```sh
npx playwright test --project=hybrid tests/hybrid/events-api-ui.spec.ts
```

The API-only, UI-only, and hybrid projects are independent selectors, not an
execution order or project dependency.

VS Code's Playwright extension is pointed at `playwright.config.ts` by
`.vscode/settings.json`. The config explicitly matches `*.spec.ts` files in
each category directory. If the Test Explorer was already open while these
settings changed, use the Playwright extension's refresh action to reload test
discovery.

# ScranHub

> Plan and rate your scranning adventures with your friends! Create a group, rate everywhere you eat, and see what comes out on top.

ScranHub is a web app for groups of friends to track and rate the places they eat together. Create a group, add the venues you visit, rate them on quality and cost, and let the app calculate and display the group's favourites. This repository contains the **frontend client** of the application. It talks to the [ScranHub API](https://github.com/garethspencer/ScranHub) backend.

## Features

- **Friends** — add friends by their email or display name and manage pending/declined requests.
- **Groups** — create groups, manage them and search to join groups created by your friends.
- **Venues & ratings** — add places to a group that you'd like to dine together, and then rate them on configurable **quality** and **cost** scales.
- **Summaries** — two summary views of every venue in a group showing average ratings and how each member voted, with sorting and filtering.
- **Custom rating options** — each group can configure its own food types, venue types, and quality/cost rating scales, with drag-and-drop reordering. So you can personalise each group to the people using it.
- **Admin** — an API-protected area for managing users and groups across the platform.
- **Light/dark mode** — respects the OS preference and remembers your choice.
- **Auth0 Login process** — third-party implementation of a renowned authentication and authorisation provider.

## Tech stack

| Area          | Technology                                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| Framework     | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)                            |
| Build tool    | [Vite](https://vite.dev/)                                                                                 |
| Routing       | [React Router](https://reactrouter.com/)                                                                  |
| Data fetching | [TanStack Query](https://tanstack.com/query) + [Axios](https://axios-http.com/)                           |
| UI            | [React-Bootstrap](https://react-bootstrap.netlify.app/) + [Bootstrap 5](https://getbootstrap.com/) (SCSS) |
| Drag & drop   | [dnd kit](https://dndkit.com/)                                                                            |
| Auth          | [Auth0](https://auth0.com/) (`@auth0/auth0-react`)                                                        |
| Hosting       | [Azure Static Web Apps](https://azure.microsoft.com/products/app-service/static)                          |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (current LTS recommended)
- A running instance of the [ScranHub API](https://github.com/garethspencer/ScranHub)
- An [Auth0](https://auth0.com/) application (Single Page Application) configured for the API's audience

### Install

```bash
git clone https://github.com/garethspencer/ScranHubClient.git
cd ScranHubClient
npm install
```

### Configure environment variables

The app reads its configuration from Vite environment variables. A `.env.development` file is used in development; create one (or a `.env.local`) with the following keys:

| Variable                     | Description                                                          |
| ---------------------------- | ------------------------------------------------------------------- |
| `VITE_AUTH0_DOMAIN`          | Your Auth0 tenant domain (e.g. `your-tenant.eu.auth0.com`).         |
| `VITE_AUTH0_CLIENT_ID`       | The Client ID of your Auth0 SPA application.                        |
| `VITE_AUTH0_AUDIENCE`        | The API audience/identifier registered in Auth0.                    |
| `VITE_API_BASE_URL`          | Base URL of the ScranHub API the client should call.                |
| `VITE_GOOGLE_MAPS_API_KEY`   | _Optional._ Google Maps key for venue autocomplete (see below).     |

```dotenv
VITE_AUTH0_DOMAIN=your-tenant.eu.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://your-api-audience
VITE_API_BASE_URL=https://localhost:5001
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

> **Google Maps is optional.** Without `VITE_GOOGLE_MAPS_API_KEY` the "Add Venue"
> form falls back to a plain text input. To enable Places autocomplete, follow
> [docs/google-maps-setup.md](docs/google-maps-setup.md), which documents the
> required APIs, key restrictions, and the cost controls that keep usage within
> Google's free tier.

> **Note:** environment files containing secrets should not be committed. Keep real values in `.env.local` (which Vite ignores by default) or your deployment's configuration.

### Run

```bash
npm run dev
```

The app will start on Vite's dev server (default <http://localhost:5173>).

## Available scripts

| Script            | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with hot module reloading.             |
| `npm run build`   | Type-check (`tsc -b`) and produce a production build in `dist/`. |
| `npm run preview` | Serve the production build locally for a final check.            |
| `npm run lint`    | Run ESLint across the project.                                   |

## Project structure

```
src/
  api/          API client and TanStack Query controller hooks
  auth/         Auth0 provider and auth helpers
  components/   Reusable UI components
    common/       Shared across features (tables, pagination, modals)
    layout/       App chrome (navbar, footers, account modals)
    options/      Rating-option editor pieces
  constants/    Shared constants (pagination, validation limits)
  contexts/     React context providers (dark mode, toasts)
  enums/        Shared enums
  hooks/        Reusable hooks (e.g. debounce)
  layout/       Route layouts and section scaffolding
  models/       Request/response/result types
  navigation/   Section and tab definitions
  pages/        Route-level pages, grouped by feature
```

## Deployment

The client is deployed as an [Azure Static Web App](https://azure.microsoft.com/products/app-service/static) via the GitHub Actions workflow in [`.github/workflows`](.github/workflows). [`public/staticwebapp.config.json`](public/staticwebapp.config.json) provides the SPA navigation fallback so client-side routes resolve correctly. Build-time environment variables are supplied through the workflow / Static Web App configuration.

## Related repositories

- **Backend API:** [garethspencer/ScranHub](https://github.com/garethspencer/ScranHub)

## License

[MIT](LICENSE.txt)

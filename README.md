# Paginated Table Demo

A React + TypeScript + Vite demo app for a paginated, searchable, selectable virtualized table with bulk actions.

## Run the app

### 1) Install dependencies

```bash
npm install
```

### 2) Start the dev server

```bash
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Other useful commands

```bash
npm run build   # Type-check and create a production build
npm run preview # Preview the production build locally
npm run lint    # Run ESLint
```

## Where to tweak things

- `src/constants.ts`
  - `DEFAULT_INITIAL_PAGE_SIZE`: default rows per page.
  - `SEARCH_DEBOUNCE_MS`: debounce time for search input.
  - `FETCH_DELAY_MS`: simulated network delay.
  - `RANDOM_ERROR_PROBABILITY`: chance of simulated fetch failure.

- `src/App.tsx`
  - Initial mock data is seeded here if local storage is empty.

- `src/data/tasks.ts` and `src/data/users.ts`
  - Adjust mock data generation and fetch behavior.
  - `populateTasks()` / `populateUsers()` control seeded dataset size.

- `src/hooks/usePaginatedPageData.ts`
  - Shared pagination/search fetching logic.
  - Good place to tune loading/error/reset behavior.

- `src/components/PaginatedVirtualTableView.tsx`
  - Generic table UI: header, search box, row rendering, pagination controls, and bulk-action confirmation modal.

- `src/TasksVirtualTable.tsx` and `src/UsersVirtualTable.tsx`
  - Feature-specific table wiring (columns, actions, labels, and bulk action handlers).

- `src/App.css`
  - Main styling for table layout, controls, modal, and states.
  - I selected this way of styling mainly to make components a little less noisy (e.g. no tailwind css strings all over the place) but I generally prefer tailwind

## Notes

- Data is stored in `localStorage` under `mockItems:*` keys.
- To reset demo data, clear site storage in your browser and reload.

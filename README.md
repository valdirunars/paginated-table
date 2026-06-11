# Paginated Table Demo

A React + TypeScript + Vite demo app for a paginated, searchable, selectable table with bulk actions.

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
- `src/components/PaginatedTableView.tsx`
  - Generic table UI: header, search box, row rendering, pagination controls, and bulk-action confirmation modal.
- `src/TasksTable.tsx` and `src/UsersTable.tsx`
  - Feature-specific table wiring (columns, actions, labels, and bulk action handlers).
- `src/App.css`
  - Main styling for table layout, controls, modal, and states.
  - I selected this way of styling mainly to make components a little less noisy (e.g. no tailwind css strings all over the place) but I generally prefer tailwind

## Architecture decisions and implementation notes

The app keeps table rendering, table state, and mocked data access separate. `App` seeds `localStorage`, `TasksTable` wires the task feature together, and the reusable hooks/components handle the generic table behavior.

### Table model

TanStack React Table is used for table state and rendering mechanics, not for data fetching. `usePaginatedTableModel` receives only the current page of rows and uses `manualPagination: true`, with `pageCount` and `rowCount` coming from the mocked API response. Domain hooks such as `useTasksTableModel` and `useUsersTableModel` define columns, then reuse that shared table setup.

### Mock API layer

`src/data/mockItem.ts` is the localStorage-backed storage adapter. It reads `mockItems:*`, applies search, clamps page numbers, slices the requested page, and returns `{ data, pagination }` like a small API would.

`src/data/tasks.ts` and `src/data/users.ts` sit on top of that adapter. They add seeded data, simulated latency/failures, and domain mutations such as deleting, archiving, and assigning tasks.

### Data flow

`usePaginatedPageData` owns the API-facing state: page index, page size, search input, debounced search, loading, error, and retry. Search is handled before pagination in the data layer so it behaves like a server-backed table, not a client-side filter over the current page.

The UI stores only the current page of rows. Bulk actions mutate the mock store, clear selection when appropriate, and refetch the current page.

### Shared table UI

`PaginatedTableView` renders the generic table experience: search, loading/empty/error states, retry, pagination controls, selection, and optional bulk-action confirmation. It receives table state and callbacks as props, so it is not tied to tasks or users.

Selection is row-id based. Select-all is page-scoped because only the current page is loaded, while selection can still survive page navigation through stable numeric ids.

`UserSelectModal` reuses the same table setup with hard single-select and hidden bulk actions, so task assignment does not need a separate picker implementation.

## Notes

- Data is stored in `localStorage` under `mockItems:*` keys.
- To reset demo data, clear site storage in your browser and reload.

## What I'd do differently with more time?

How long do you guys have 😅

This implementation was just over an hour of implementation and then an extra hour went to documentation and minor refactoring throughout.

- It has no design system.
- There is essentially not a proper API contract, I'm mocking pagination and searchQuery as if they were pure API calls that need no auth
- In a production application I would have a proper SessionContext architecture which could at the very least provide token or session auth for fetching data to each domain, in this case useTasksAPI domain and useUsersAPI domain (since I have tasks which has assign users)
- I would also want to have proper permission handling based on the session, since there is no login there is no production grade permission handling
- Also there is no virtualization, when pagesize is big and each row has images which need fetching, or we need to have User-generated content translations this becomes vital for app performance. But alas no time

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

## Partial failure handling

I chose an all-or-nothing bulk action contract for this exercise. Each bulk action is sent as one mocked API request with the selected IDs, and the mutation either succeeds for every selected row or fails without applying changes. That keeps the frontend state simple and avoids showing a mixed result that the mock API cannot reliably reconcile.

In a real backend I would enforce this with a PostgreSQL transaction: validate the target records, apply the mutation, and roll back on failure. In this UI, a failed request leaves the selection intact and shows an error so the user can retry or change the selection.

If the backend instead returned per-row results, I would handle that explicitly by showing how many rows succeeded and failed, refreshing successful rows, and keeping failed rows selected for retry.

## What I'd do differently with more time?

How long do you guys have 😅

This implementation was just over an hour of implementation and then an extra hour went to documentation and minor refactoring throughout.

- It has no design system.
- There is essentially not a proper API contract, I'm mocking pagination and searchQuery as if they were pure API calls that need no auth
- In a production application I would have a proper SessionContext architecture which could at the very least provide token or session auth for fetching data to each domain, in this case useTasksAPI domain and useUsersAPI domain (since I have tasks which has assign users)
- I would also want to have proper permission handling based on the session, since there is no login there is no production grade permission handling
- Also there is no virtualization, when pagesize is big and each row has images which need fetching, or we need to have User-generated content translations this becomes vital for app performance. But alas no time

## Disagreements with AI

I'm sometimes called "One-Take Valdi" but not this time 😅

### Disagreement with AI nr. 1

So first off when I was setting up the mock data layer AI was regularly suggesting types that weren't fully type safe:

```ts
MockType<T> = { type: ItemType } & T;
```

This is not good enough since we want to be able to infer the TypeScript type by simply knowing the type of the item:

```ts
export type MockItem<T extends ItemType = ItemType> = ItemTypeMap[T] & {
  type: T;
};
```

### Disagreement with AI nr. 2

When implementing the `UsersVirtualTable`, all setup was done in the component. We want separation of concerns: table configuration should be its own hook, and data fetching + state updates should be its own hook, detached from UI rendering.

### Disagreement with AI nr. 3

AI confused search with TanStack's page search, causing issues with search not using "backend" level filtering.

### Disagreement with AI nr. 4

AI was skipping using the proper type narrowing set up by our types file for the mock data and preferring casting instead. Super annoying, but mainly my fault, I forgot function overloads giving way for the type narrowing.

---

## P.S. Updates after the initial implementation

Since the first version, I found an extra hour to add a little bit more just so there's a little more to talk about:

- `src/design-system` now contains a small atomic design system implementation. It gives the app a simple shared foundation for composing UI from smaller reusable building blocks.
- `src/localization` adds a lightweight localization setup for managing locales in a React app. The nice bit is the type-safe dot syntax with completion, so translation keys are easier to discover and harder to mistype.
- `?style=landonorris` unlocks the fun easter egg: an implementation for the product manager who said "you know what we need for our table... the animation on Lando Norris' website. It's amazing!"

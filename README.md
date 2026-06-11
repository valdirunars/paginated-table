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

### Generic bulk action confirmation configuration

The table view supports a generic confirmation model for bulk actions via `BulkActionConfig<TData>` and `BulkActionConfirmationConfig<TData>` in `src/components/PaginatedTableView.tsx`.

This was implemented to make bulk action verification reusable across different table domains (for example `Task` and `User`) without coupling confirmation UI behavior to one specific data shape.

Key design points:

- `confirmation.title` and `confirmation.description` can be either static `ReactNode` values or functions that derive content from `selectedItems`.
- `confirmation.renderPreview` allows custom per-action previews for selected items.
- `confirmButtonText` and `cancelButtonText` allow action-specific modal wording.
- The actual action execution still receives strongly typed selected data (`TData[]`), so confirmation customization does not weaken type safety.

### Selection behavior and bulk action visibility

`PaginatedTableView` supports configurable selection behavior and optional bulk action UI visibility.

Selection is configured with `selectionMode`:

- `{ type: "multi" }`
  - Enables multi-row selection.
  - Renders the select-all checkbox in the selection column header.
  - Works with bulk actions in the table header.

- `{ type: "single", behavior: "soft" }`
  - Restricts selection to one row at a time.
  - Row click selects one item and can optionally call `onSingleSelect`.
  - Useful when you want controlled single selection but still allow a second explicit action (for example, a separate confirm button).

- `{ type: "single", behavior: "hard" }`
  - Restricts selection to one row and requires `onSingleSelect`.
  - Row click immediately triggers `onSingleSelect(item)` for immediate action flows.
  - Useful for pick-and-close interactions like chooser modals.

Bulk action visibility is configured with `showBulkActions`:

- `showBulkActions={true}` (default)
  - Displays selected count, clear selection button, and configured bulk action buttons.
- `showBulkActions={false}`
  - Hides the entire bulk action area in the table header.

`UserSelectModal` uses hard single-select + hidden bulk actions:

- `selectionMode={{ type: "single", behavior: "hard" }}`
- `onSingleSelect` immediately assigns the clicked user and closes the modal.
- `showBulkActions={false}` so assignment-only modal flows stay focused and minimal.

### Implementation decisions

**Numeric IDs**

IDs are numeric to keep pagination simple (`slice`-based page windows) and to make localStorage-backed DB mocking straightforward.

**Simple CSS styling**

Styling is intentionally simple CSS to keep component trees readable during review and avoid utility-class noise in JSX.

**Page-scoped "select all"**

"Select all" is page-scoped: it applies only to the currently visible page.

**Selection preserved across navigation**

Row selection is preserved across page navigation.

**Selection retained on fetch failure**

Selection is not cleared when page fetch fails.

**Current-page-only data state**

Table data state tracks only the current page, because only that page is visible; this simplifies the mental model and data flow.

**Explicit retry path**

Fetch failures provide an explicit retry path in the UI.

**Partial-action handling as backend concern**

Partial-action handling is treated as a data/backend concern (especially relevant for transactional stores like PostgreSQL), not a frontend orchestration concern.

Example rollback handling in PostgreSQL (`pg` + transaction):

```ts
import { Pool } from "pg";

const pool = new Pool();

async function archiveTasks(taskIds: number[]) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
      UPDATE tasks
      SET status = 'archived', updated_at = NOW()
      WHERE id = ANY($1::int[])
      `,
      [taskIds]
    );

    // Treat partial success as a failure so the whole operation is rolled back.
    if (result.rowCount !== taskIds.length) {
      throw new Error("Partial update detected");
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
```

### Design disagreements encountered during implementation

**1) Typed mock item modeling**

Early suggestions used a broad shape like:

```ts
type MockType<T> = { type: ItemType } & T;
```

This does not let TypeScript infer the concrete item shape from the discriminant alone. The chosen approach is a discriminated mapping:

```ts
export type MockItem<T extends ItemType = ItemType> = ItemTypeMap[T] & {
  type: T;
};
```

This preserves inference and makes type narrowing more reliable.

**2) Separation of concerns in table wiring**

Initial implementations put all setup logic inside `UsersTable`. The architecture was refactored so that:

- table configuration lives in its own hook,
- data fetching + state transitions live in their own hook,
- rendering stays focused on UI composition.

**3) Backend-level search vs table-internal mechanics**

Search behavior originally drifted toward client/table-level filtering semantics. It was corrected to use backend-level filtering semantics so query behavior reflects real paginated API expectations.

**4) Type narrowing vs type casting**

Some generated approaches preferred type casts instead of using the existing narrowing model from `types` and overloads. The final approach favors overload-driven narrowing and avoids unnecessary casts.

## Notes

- Data is stored in `localStorage` under `mockItems:*` keys.
- To reset demo data, clear site storage in your browser and reload.

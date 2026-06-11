import { populateUsers } from "./data/users";
import { populateTasks } from "./data/tasks";
import { useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PaginatedTableSkeletonView } from "./components/skeleton/PaginatedTableSkeletonView";
import InverseMetaballOverlay from "./components/InverseMetaballOverlay";
import TasksTable from "./TasksTable";
import { DEFAULT_INITIAL_PAGE_SIZE } from "./constants";
import { surfaces } from "./design-system";

function App() {
  const mainRef = useRef<HTMLElement>(null);
  const isLandonNorrisStyle =
    new URLSearchParams(window.location.search).get("style") === "landonorris";

  useEffect(() => {
    if (localStorage.getItem("mockItems:user") === null) {
      populateUsers();
    }
    if (localStorage.getItem("mockItems:task") === null) {
      populateTasks();
    }
  }, []);

  return (
    <main ref={mainRef} className={surfaces.page}>
      <TasksTable />
      {isLandonNorrisStyle && (
        <InverseMetaballOverlay
          snapshotBoundsRef={mainRef}
          snapshotContent={
            <PaginatedTableSkeletonView
              itemType="task"
              rowCount={DEFAULT_INITIAL_PAGE_SIZE}
            />
          }
        />
      )}
      <ToastContainer position="top-right" autoClose={4000} />
    </main>
  );
}

export default App;

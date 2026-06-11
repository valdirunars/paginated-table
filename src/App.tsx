import { populateUsers } from "./data/users";
import { populateTasks } from "./data/tasks";
import TasksTable from "./TasksTable";
import "./App.css";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    if (localStorage.getItem("mockItems:user") === null) {
      populateUsers();
    }
    if (localStorage.getItem("mockItems:task") === null) {
      populateTasks();
    }
  }, []);

  return (
    <main className="app">
      <TasksTable />
    </main>
  );
}

export default App;

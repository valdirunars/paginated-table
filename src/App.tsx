import { populateUsers } from "./data/users";
import { populateTasks } from "./data/tasks";
import UsersVirtualTable from "./UsersVirtualTable";
import TasksVirtualTable from "./TasksVirtualTable";
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
      {/* <UsersVirtualTable /> */}
      <TasksVirtualTable />
    </main>
  );
}

export default App;

import { populateUsers } from "./data/users";
import { populateTasks } from "./data/tasks";
import TasksTable from "./TasksTable";
import "./App.css";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <ToastContainer position="top-right" autoClose={4000} />
    </main>
  );
}

export default App;

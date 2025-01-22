import "./App.css";
import Tasks from "./components/Tasks.jsx";

function App() {
  return (
    <>
      <div
        className="
        flex
        flex-col
        justify-center
        items-center
        w-screen
        h-screen
        p-4
      ">
        <Tasks />
      </div>
    </>
  );
}

export default App;

import React, { useState } from "react";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [taskIds, setTaskIds] = useState([]);
  const [selectedTaskData, setSelectedTaskData] = useState(null);

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      const searchTermArray = searchTerm.split(" ");
      fetch(`http://localhost:8000/search/?term=${searchTermArray.join("+")}`)
        .then((response) => response.json())
        .then((data) => {
          setResponseData(data);
          setTaskIds((prevTaskIds) => [...prevTaskIds, data.task_id]);
        })
        .catch((error) => console.error("Error fetching data:", error));
    } else {
      console.log("Please enter a search term.");
    }
  };

  const handleTaskIdClick = (taskId) => {
    fetch(`http://localhost:8000/fetch/${taskId}`)
      .then((response) => response.json())
      .then((data) => setSelectedTaskData(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  return (
    <div className="App">
      <div>
        <h1>Search Query</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter search term"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {responseData && (
        <div>
          <h2>Response Data</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
          <p>
            <strong>Task IDs:</strong>{" "}
            {taskIds.map((taskId, index) => (
              <span key={index}>
                <a
                  href="javascript:void(0)"
                  onClick={() => handleTaskIdClick(taskId)}
                >
                  {taskId}
                </a>
                {index < taskIds.length - 1 && ", "}{" "}
              </span>
            ))}
          </p>
        </div>
      )}
      {selectedTaskData && (
        <div>
          <h2>Selected Task Data</h2>
          <pre>{JSON.stringify(selectedTaskData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;

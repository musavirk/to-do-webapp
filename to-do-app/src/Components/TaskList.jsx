import React, { useEffect, useState } from "react";
import "./TaskList.css";
import $ from "jquery";
import { Button } from "react-bootstrap";
import {
  Trash,
  CheckSquareFill,
  PlusSquareFill,
  FunnelFill,
  XSquareFill,
} from "react-bootstrap-icons";

function TaskList() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
  });

  const fetchData = (search = "") => {
    $.ajax({
      url: `http://localhost:4000/v1/tasks?search=${search}`,
      method: "GET",
      dataType: "json",
      success: (result) => {
        setData(result.data);
      },
      error: (xhr, status, error) => {
        // Handle errors
        setError(new Error(`AJAX request failed: ${status}, ${error}`));
      },
      complete: () => {
        setLoading(false);
      },
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTask = () => {
    $.ajax({
      url: "http://localhost:4000/v1/tasks",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(newTask),
      success: (result) => {
        fetchData();
      },
      error: (xhr, status, error) => {
        // Handle errors
        console.error(`AJAX request failed: ${status}, ${error}`);
      },
    });
  };

  const handleDeleteTask = (_id) => {
    $.ajax({
      url: `http://localhost:4000/v1/tasks/${_id}`,
      method: "DELETE",
      success: (result) => {
        fetchData(); // Refresh the data after deleting a task
      },
      error: (xhr, status, error) => {
        // Handle errors
        console.error(`AJAX request failed: ${status}, ${error}`);
      },
    });
  };

  const handleUpdateStatus = (_id, newStatus) => {
    $.ajax({
      url: `http://localhost:4000/v1/tasks/${_id}`,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify({ status: newStatus }),
      success: (result) => {
        fetchData(); // Refresh the data after updating the status
      },
      error: (xhr, status, error) => {
        // Handle errors
        console.error(`AJAX request failed: ${status}, ${error}`);
      },
    });
  };

  const getStatusColor = (status) => {
    // Define your color mappings based on status
    switch (status) {
      case "To Do":
        return "#BD0000"; // Red
      case "Done":
        return "Green"; // Green
      // Add more cases for other statuses
      default:
        return "#ffffff"; // Default color
    }
  };
  return (
    <div className="main mt-3">
      {loading && <p>Loading...</p>}

      {error && <p className="error">Error: {error.message}</p>}
      <h1>My Todos</h1>
      <div className="todo-wrapper d-flex d-inline">
        <div className="todo-inputs d-flex d-inline">
          <div className="m-3">
            <label htmlFor="title" className="mx-1">
              <b>Title:</b>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter Task title"
              onChange={handleInputChange}
            />
          </div>
          <div className="m-3">
            <label htmlFor="description" className="mx-1">
              <b>Description:</b>
            </label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Enter Task description"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <Button className="mt-2" onClick={handleAddTask}>
            <PlusSquareFill />
          </Button>
        </div>
      </div>
      <div className="d-flex d-inline mb-2">
        <div className="mx-3 ">
          <Button
            variant="success"
            onClick={() => {
              fetchData("To Do");
            }}
          >
            <FunnelFill /> ToDo
          </Button>
        </div>
        <div>
          <Button
            onClick={() => {
              fetchData("Done");
            }}
          >
            <FunnelFill /> Done
          </Button>
        </div>
      </div>

      {data &&
        data.map((dat) => (
          <div key={dat.id} className="outPut">
            <h2>{dat.title}</h2>
            <p>{dat.description}</p>
            <div className="d-flex d-inline ">
              <div className="mx-3">
                <button
                  class="btn btn-danger"
                  onClick={() => handleDeleteTask(dat._id)}
                >
                  <Trash />
                </button>
              </div>
              <div className="mx-3">
                <button
                  class="btn btn-success"
                  onClick={() => handleUpdateStatus(dat._id, "Done")}
                >
                  <CheckSquareFill />
                </button>
              </div>
              <div className="mx-3">
                <button
                  class="btn btn-dark"
                  onClick={() => handleUpdateStatus(dat._id, "To Do")}
                >
                  <XSquareFill />
                </button>
              </div>
              <div
                className="status mx-3"
                style={{
                  color: "#fff",
                  backgroundColor: getStatusColor(dat.status),
                }}
              >
                <b>{dat.status}</b>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default TaskList;

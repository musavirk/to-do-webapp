
$(document).ready(function () {
  // Define your API URL
  const apiUrl = "http://localhost:4000/v1/tasks";

  // Function to fetch data
  const fetchData = function (search = "") {
    $.ajax({
      url: `${apiUrl}?search=${search}`,
      method: "GET",
      dataType: "json",
      success: function (result) {
        // Update the task list
        updateTaskList(result.data);
      },
      error: function (xhr, status, error) {
        console.error(`AJAX request failed: ${status}, ${error}`);
      },
    });
  };

  // Function to update the task list
  const updateTaskList = function (data) {
    // Clear the existing task list
    $("#taskList").empty();

    // Add new tasks to the list
    $.each(data, function (index, task) {
      const taskElement = `
            <div class="outPut">
              <h2>${task.title}</h2>
              <p>${task.description}</p>   
              <div id='status'><b>${task.status}</b></div>
              <div class="out-btn">
                <button class="set-ToDo" taskId="${task._id}">ToDo</button>
                <button class="set-Done" taskId="${task._id}">Done</button>
                <button class="delete" taskId="${task._id}">Delete</button>
              <div/> 
            </div>
          `;
      $("#taskList").append(taskElement);
    });

    // Add click event handlers for ToDo, Done, and Delete buttons
    $(".set-ToDo").on("click", function () {
      const taskId = $(this).attr("taskId");
      updateTaskStatus(taskId, "ToDo");
    });

    $(".set-Done").on("click", function () {
      const taskId = $(this).attr("taskId");
      updateTaskStatus(taskId, "Done");
    });

    $(".delete").on("click", function () {
      const taskId = $(this).attr("taskId");
      deleteTask(taskId);
    });
  };

  // Function to update task status (To Do or Done)
  const updateTaskStatus = function (taskId, status) {
    $.ajax({
      type: "PUT",
      url: `${apiUrl}/${taskId}`,
      data: JSON.stringify({ status: status }),
      contentType: "application/json",
      success: function (response) {
        console.log(`Task status updated to ${status}:`, response);
        // Fetch updated data after updating task status
        fetchData();
      },
      error: function (error) {
        console.error("Error updating task status:", error);
      },
    });
  };

  // Function to delete a task
  const deleteTask = function (taskId) {
    $.ajax({
      type: "DELETE",
      url: `${apiUrl}/${taskId}`,
      success: function (response) {
        console.log("Task deleted successfully:", response);
        // Fetch updated data after deleting the task
        fetchData();
      },
      error: function (error) {
        console.error("Error deleting task:", error);
      },
    });
  };

  // Fetch data on initial load
  fetchData();

  // Event handler for adding a task
  $("#taskForm").submit(function (event) {
    // Prevent the default form submission
    event.preventDefault();

    // Get the task data from the form
    var title = $("#title").val();
    var description = $("#description").val();

    // Create a data object to send to the backend
    var data = {
      title: title,
      description: description,
    };

    // Make an AJAX request to the backend API for adding a task
    $.ajax({
      type: "POST",
      url: apiUrl,
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function (response) {
        // Handle the successful response from the backend
        console.log("Task added successfully:", response);
        // Fetch updated data after adding a new task
        fetchData();
      },
      error: function (error) {
        // Handle errors from the backend
        console.error("Error adding task:", error);
      },
    });
  });

  // Event handler for filtering ToDo tasks
  $("#filterToDo").on("click", function () {
    fetchData("To Do");
  });

  // Event handler for filtering Done tasks
  $("#filterDone").on("click", function () {
    fetchData("Done");
  });
});

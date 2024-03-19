//=================== The code for the Todo app Front End =========================

/*===============================================================================
1) Configuration and Initial Setup
This section sets up constants and initial states for the UI elements.
*/

//Variable that holds url for the backend
const BACKEND_ROOT_URL = 'http://localhost:3001'

//Import the created Todos class
import { Todos } from "./class/Todos.js";       //This 'Todos' class responsible for fetching tasks from a backend service and converting them into an array of Task objects.
const todos = new Todos(BACKEND_ROOT_URL);      // Create an object of the Todos class, providing the backend root URL as an argument

// Get the form, input, and ul elements
const btn1 = document.querySelector('#button_addTask');
const input1 = document.querySelector('input');
const list1 = document.querySelector('ul');

//By default, input field is disabled!
input1.disabled =true;




/*===============================================================================
2) UI Rendering Function    (CREATE-Happening)
Defines how tasks are rendered on the UI.
*/

// Define a function to render a new task in the UI
const renderTask = function(addedTask)      //This addedTask parameter is task1 object returns by Todos class addTask method
{
    // Create a new list item element and add Bootstrap class for styling
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item');
    // Set the inner HTML of the list item to the task's text, accessed through the Task object's getText method
    li.innerHTML = addedTask.getText();       // <- Here, taskContent is an object of Task Class which created inside of Todo Class
    // Append the newly created list item to the list
    list1.appendChild(li);
}




/*===============================================================================
3) Fetching Tasks   (READ)
This asynchronous function retrieves tasks from the backend and updates the UI accordingly.
*/

// Function to get tasks using the Todos instance
const getTasks = () => 
{
    // Call the getTasks method in the todos object which returns a promise (todos is an object of Todo Class)
    todos.getTasks()
    .then((tasks) => 
    {
        // Loop through the array of tasks returned by the promise
        tasks.forEach((currentTask) => 
        {
            // Use renderTask to display each task in the UI
            renderTask(currentTask);
        });

        // Once all tasks have been rendered, re-enable the input field.
        // This is done by setting its 'disabled' property to false, allowing the user to enter new tasks.
        input1.disabled = false;

        
    })
    .catch((error) => 
    {
      // If there's an error retrieving tasks, display an alert
      alert(error);
    });
  };
  

// Call getTasks to fetch and display all tasks
getTasks();



/*===============================================================================
5) Event Handling
Sets up event listeners for user interactions.
*/

// Event listener for Button Click
btn1.addEventListener('click', function(event) 
{
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get the trimmed value of the input field
    const taskContent = input1.value.trim();

    // Check if the input value is not empty
    if (taskContent !== '') 
    {
        // Call the addTask method on the todos object with the new task content     (CREATE-Signaling)
        todos.addTask(taskContent)      // <-   Here, todos is an object of Todos Class | 
        //                                      This returns task1 object which holds id and description (task1 is an object of Task Class created inside the Todo Class)
        .then((addedTask) => // The resolved value is the new task1 object and pass down as an argument here
        { 
            // Render(display) the new task in the UI using the custom made renderTask function
            renderTask(addedTask);
            // Clear the input field for the next task
            input1.value = '';
            // Set focus back to the input field
            input1.focus();
        })
        .catch((error) => 
        {
            // If an error occurs while saving the task, log the error and alert the user
            console.error("An error occurred while saving the task:", error);
            alert("Error saving task: " + error.message);
        });
    }
});




//=================== The code for the Todo app Front End =========================

/*===============================================================================
Configuration and Initial Setup
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

//*************************************************************************************************************************************** */













/*===============================<<< (CREATE-Happening) >>>================================================
2) UI Rendering (Generating) Task Function   
Defines how tasks are rendered on the UI.
*/

// Define a function to render a new task in the UI ()
const renderTask = function(addedTask)      //This addedTask parameter is task1 object returns by Todos class addTask method | addedTask=  task1 ={id:1, text:'Buy Milk', getId(), getText()}
{
    // Create a new list item element and add Bootstrap class for styling
    const li = document.createElement('li');        // <li>     </li>
    li.setAttribute('class', 'list-group-item');    // <li class="list-group-item">     </li>

    // Set a 'data-key' attribute on the list item with the task's ID to uniquely identify it
    // Assume task.getId() returns 1, the li element now looks like:  ->  
    li.setAttribute('data-key', addedTask.getId().toString());  // <li class="list-group-item" data-key="1">       </li>


    renderSpan(li, addedTask.getText());    // Call the renderSpan function to create and append a span element to the li
    renderLink(li, addedTask.getId());      // Call the renderLink function to create and append a delete link(Button) with an icon
    
    renderEditLink(li, addedTask.getId(), addedTask.getText()); // Call the renderEditLink function to create and append a edot link(Button) with an icon
    

    // Append the newly created list item to the list
    list1.appendChild(li);
}

// Function to generate a span element containing the TaskContent text (To seperate the Task from Trash Button)
const renderSpan = (li, text) =>    //li: Task in the task list |   text: addedTask.getText()
{
    const span = document.createElement('span');        // <span></span>
    span.textContent = text; // If text is "Buy milk", the span element now looks like: <span>Buy milk</span>
    li.appendChild(span);   // <li ...>     <span>Buy milk</span>   </li>
}



/*===============================<<< (READ-Happening) >>>================================================
3) Fetching Tasks   
This asynchronous function retrieves tasks from the backend and updates the UI accordingly.
*/

// Function to get tasks using the Todos instance
const getTasks = () => 
{
    // Call the getTasks method in the todos object which returns a promise (todos is an object of Todo Class)
    todos.getTasks()    //*** <<< RUN THE BACKEND GET FUNCTION >>> ***
    .then((tasks) => 
    {
        // Loop through the array of tasks returned by the promise
        tasks.forEach((currentTask) => 
        {
            // Use renderTask to generate each task in the UI
            renderTask(currentTask);
        });

        // Once all tasks have been rendered, re-enable the input field.
        // This is done by setting its 'disabled' property to false, allowing the user to enter new tasks.
        input1.disabled = false;

        
    })
    .catch((error) => 
    {
      // If there's an error retrieving tasks, generate an alert
      alert(error);
    });
  };
  

// Call getTasks to fetch and generate all tasks
getTasks();





/*===============================<<< (DELETE-Happening) >>>================================================
4) CREATE DELETE BUTTON and DELETE BUTTON EVENT LISTNER
*/

// Function to generate a delete link (Delete Button) with a Bootstrap icon
const renderLink = (li, id) =>  //li: Task in the task list |   id:   addedTask.getId()
{
    //// Create an anchor (<a>) element that will act as the delete button
    const a = document.createElement('a');    //   --> <a></a>

    // Set the Bootstrap trash icon (can get this line of code: Search Google Bootstrap Trash Icon)
    a.innerHTML = '<i class="bi bi-trash"></i>';    //   --> <a><i class="bi bi-trash"></i></a>

    
    a.setAttribute('style', 'float: right');    // Add CSS style to float the icon to the right side of the list item
    a.setAttribute('href', '#');                // Set the href attribute to '#' to make the anchor element clickable
    a.setAttribute('data-id', id);              // Store the task's ID in a 'data-id' attribute for access during the delete operation
    //Final Result:     <a style="float: right" href="#">   <i class="bi bi-trash"></i>    </a>

    li.appendChild(a);       // Append the anchor element to the list item
    //Final Result:     <li ...>     <span>Buy milk</span>          <a style="float: right" href="#" data-id="id"><i class="bi bi-trash"></i></a>       </li>



    // ****** DELETE BUTTON EVENT LISTNER: Add a click event listener to the anchor element **********
    a.addEventListener('click', function(event) 
    {
        event.preventDefault(); // Prevent the link from changing the URL

        todos.removeTask(id)    //*** //*** <<< RUN THE DELETE FUNCTION >>> ***
        .then(() =>     //If the Task delete success Remove the whole Task List Item
        {
            li.remove(); // Remove the list item from the DOM
        })
        
        .catch((error) =>   //If the Task delete fails
        {
            alert(error); // Alert the error if something goes wrong
        });
    });
    
}


/*===============================<<< (EDIT-Happening) >>>================================================
4) CREATE EDIT BUTTON and EDIT BUTTON EVENT LISTNER
*/

// Function to generate an edit link (Edit Button) with a Bootstrap icon
const renderEditLink = (li, id, text) => 
{
    const a = document.createElement('a'); // Create an anchor (<a>) element for the edit button
    a.innerHTML = '<i class="bi bi-pencil-square"></i>'; // Set the Bootstrap pencil-square icon for editing
    
    a.setAttribute('style', 'float: right; margin-left: 10px;'); // Add styling to float the icon next to the delete icon
    a.setAttribute('href', '#'); // Set the href attribute to '#' to make the anchor element clickable
    
    a.addEventListener('click', function(event) 
    {
        event.preventDefault(); // Prevent the link from changing the URL

        const newText = prompt('Edit Task:', text); // Prompt the user to enter a new task description

        if (newText != null && newText.trim() !== '')   // Check if newText is not null or just whitespace
        { // If newText is not null and not empty
            todos.updateTask(id, newText.trim()) ///*** //*** <<< RUN THE PUT FUNCTION >>> ***

            //The resolved value is the updated updated JSON object which returns here
            .then(updatedTask => {
                // Find the span in the list item and update its text content
                const span = li.querySelector('span');
                span.textContent = updatedTask.description;
            })

            .catch(error => {
                alert(error); // Alert the error if something goes wrong
            });
        }
    });
    li.appendChild(a); // Append the edit link to the list item
}










/*===============================================================================
5) Event Handling TO ADD TASK BUTTON
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
        todos.addTask(taskContent)      // <-   //*** <<< RUN THE BACKEND POST FUNCTION >>> ***
        //                                      Here, todos is an object of Todos Class | This is the method where Back End doing task adding (POSTing)
        //                                      This returns task1 object which holds id and description (task1 is an object of Task Class created inside the Todo Class)
        .then((addedTask) => // The resolved value is: new task1 object. So it is returning to here as an argument
        //                      So this addedTask object is an object of Task Class. Ex:    addedTask=  task1 ={id:1, text:'Buy Milk', getId(), getText()}
        { 
            // Call the render(generate) the new task function in the UI (At the top of this file)
            renderTask(addedTask);
            
            input1.value = '';  // Clear the input field for the next task            
            input1.focus(); // Set focus back to the input field
        })

        .catch((error) => 
        {
            // If an error occurs while saving the task, log the error and alert the user
            console.error("An error occurred while saving the task:", error);
            alert("Error saving task: " + error.message);
        });
    }
});




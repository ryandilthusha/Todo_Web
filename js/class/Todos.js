// Import the Task class from the Task.js file
import { Task } from "./Task.js";


// Define a class to manage a list of tasks and interact with a backend service
class Todos 
{
    // Declare private class variables to hold tasks and the backend URL
    #tasks = [];          
    #backend_url = '';    

    // Constructor method to initialize the Todos class with a backend URL
    constructor(url) 
    {    
        this.#backend_url = url;    // Set the backend service URL using the passed-in argument
    }


    /*
    //                          <<< BACKEND GET TASK (GET) >>>
    */
    // Method to fetch tasks from the backend and store them in the #tasks array
    getTasks =  () =>
    {    
        // Return a new Promise that resolves with the tasks or rejects with an error
        return new Promise((resolve, reject) => 
        {
            //Basically fetch == new Promise()
            //SO WHAT THIS featch DO IS :   * The fetch function initiates a network request to the backend
            //                              *  This Response object contains all the details of the response from the server
            fetch(this.#backend_url)

            //*** THIS IS WHAT 1st .then() HADLES(Do):      * When the fetch promise is resolved, it returns a Response object.
            //                                              * This object have details of response from the backend service, such as the status code, status message, headers, and the body of the response
            .then((response) =>         
            
                response.json()   //                        * But this .json() method takes only the response body (which has only id and description data) and parses it as JSON (make those data like an object)
            ) 

            //*** THIS IS WHAT 2nd .then() HADLES(Do):          *This method receives the above parsed JSON object from the first .then(). 
            //                                                  *(We can rename this 'json' parameter as 'response' if we want!)
            .then((json) =>             //So as told this json parameter holds the body of the response which has id and description of tasks in the database
            {
                //Use a custom method #readJson to read the JSON data into the tasks array
                this.#readJson(json); // This #readJson method which defined below doing is get each task in the json object store them in #tasks=[] array
                resolve(this.#tasks); // *** FINALLY RETURNs: Then finally returning the #tasks array

            })
            // Catch any errors that occur during the fetch operation
            .catch((error) => 
            {
                // Reject the promise with the error
                reject(error);
            });
        })
    }

    // Private method to read a JSON array and convert it to objects (This is called above)
    #readJson = (tasksAsJson) => 
    {
        // Loop through the JSON array
        tasksAsJson.forEach(currentElement => 
        {
            // Create a new Task object for each item in the array
            const task1 = new Task(currentElement.id, currentElement.description);
            
            this.#tasks.push(task1);     // Push the new created Task object to the #tasks array
        });
    }



    /*
    //                          <<< BACKEND ADD TASK (POST) >>>
    */
    // Add a public method for adding a new task that returns a promise      (CREATE-Saving in database)
    addTask = (taskContent) =>    //Task content coming from the Front Endtext box
    {
        // Return a new promise that will resolve to the added Task object or reject with an error
        return new Promise((resolve, reject) => 
        {
            // This method below converts an object to a JSON-formatted string
            // So json1 variable holding value might look like this: {"description": "the task content"}
            // WHY DOING THIS: This JSON object is used in the body of a fetch request to send the task description to the backend server
            const json1 = JSON.stringify({ description: taskContent });     // <- Here, 'text' argument comes from function parameter
            
            
            //Basically fetch == new Promise()
            // The fetch call makes a POST request to the backend to add a new task and returns a promise.
            //SO WHAT THIS featch DO IS : Post the data to the backend and the backend has responded new task with the id of the newly created task.
            fetch(this.#backend_url + '/new', {
                method: 'POST', // Specify the method to use for the request
                headers: { 'Content-Type': 'application/json' }, // Set the content type header to JSON
                body: json1 // Provide the above JSON stringified task as the body of the request
            })
            //When the fetch promise resolves, it enters the first .then() callback
            
            //*** THIS IS WHAT 1st .then() HADLES(Do):          *When the fetch promise is resolved, it returns a Response object.
            //                                                  *This object have details of response from the backend service, such as the status code, status message, headers, and the body of the response
            .then(response => response.json()) //               *But this .json() method takes only the response body (which has only id and description data) and parses it as JSON (make those data like an object)

            //*** THIS IS WHAT 2nd .then() HADLES(Do):          *This method receives the above parsed JSON object from the first .then(). 
            //                                                  *(We can rename this 'json' parameter as 'response' if we want!)
            .then(json => 
                {
                    // Use the private #addToArray method to add the new task to the tasks array and resolve the promise with the new task
                    resolve(this.#addToArray(json.id, taskContent));       //*** FINALLY RETURNs: add the new task to the tasks array -> 1st param:json object's id value | 2nd param:Task content coming from the front end text box
                })


            .catch(error => {
                // If any error occurs during the fetch or processing, reject the promise with the error
                reject(error);     //*** If unsuccessful: the promise is rejected with an error object         
            });
        });
    }

    // Private method to create a new Task and add it to the tasks array
    #addToArray = (id, text) => {
        // Create a new task instance
        const task1 = new Task(id, text);
        // Push the new task to the tasks array
        this.#tasks.push(task1);
        // Return the newly added task1 object of Task Class
        return task1;
    }



    /*
    //                          <<< BACKEND REMOVE TASK (DELETE) >>>
    */
    // This public method is for deleting a task both from the backend and the local state.     (DELETE-Removeing from database)
    // It accepts a task 'id' which is the identifier for the task to be deleted.
    removeTask = (id) => 
    {        
        return new Promise((resolve, reject) => 
        {
        // The 'fetch' method is used to send an HTTP DELETE request to the server endpoint.
        // The 'id' of the task to be deleted is appended to the URL.
        fetch(this.#backend_url + '/delete/' + id, {
            method: 'delete'
        })

        //*** THIS IS WHAT 1st .then() HADLES(Do):          *When the fetch promise is resolved, it returns a Response object.
        //                                                  *This object have details of response from the backend service, such as the status code, status message, headers, and the body of the respons
        .then((response) => response.json()) //             *But this .json() method takes only the response body (which has only id and description data) and parses it as JSON (make those data like an object)
        

        //*** THIS IS WHAT 2nd .then() HADLES(Do):          *This method receives the above parsed JSON object from the first .then(). 
        //                                                  *(We can rename this 'json' parameter as 'response' if we want!)
        .then((json) => 
        {
            this.#removeFromArray(id);       // Call the private method '#removeFromArray' to update the local task array.
            
            // The Promise is resolved with the 'id' of the deleted task.
            resolve(json.id);       //*** FINALLY RETURNs: The id of the JSON body
        })


        .catch((error) => 
        {
            // If there's an error during the fetch, the Promise is rejected with the error.
            reject(error);
        })
        });
    }


    // This is a private method used to remove a task from the local array of tasks.
    // It takes an 'id' parameter which is the identifier of the task to be removed.
    #removeFromArray = (id) => {
        // The 'filter' method is used to create a new array that contains all tasks
        // except the one that matches the 'id' passed to the method.
        const arrayWithoutRemoved = this.#tasks.filter(task => task.id !== id);
        
        // The local array of tasks is then updated to this new array that no longer contains the removed task.
        this.#tasks = arrayWithoutRemoved;
    }
  



}






// Export the Todos class so it can be used in other JavaScript modules
export { Todos };

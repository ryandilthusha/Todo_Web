// Define a class to represent a Task
class Task 
{
    // Declare private properties using the # symbol to ensure they are not accessible outside the class
    #id;
    #text;
  
    constructor(id, text) 
    {
      this.#id = id;
      this.#text = text;
    }
  
    // Define a getter method to read the value of the private property #id
    getId() 
    {
      return this.#id;
    }
  
    // Define a getter method to read the value of the private property #text
    getText() 
    {
      return this.#text;
    }
}




// Export the Task class so it can be imported and used in other files
export { Task };
  
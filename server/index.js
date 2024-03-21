//=================== The code for the Todo app backend =========================


/*===============================================================================
1) Module Imports:
This section imports the necessary modules for the server to function.
*/

// Import Express to enable the creation of an HTTP server for our Todo app backend.
const express = require('express');
// Import CORS to allow our Todo app frontend (running on a different port or domain) to interact with this backend.
const cors = require('cors');

/* Removing Pool since we are now using db.js for database interactions -->

Import the 'Pool' class from the 'pg' module, which is necessary for creating a pool of connections to the PostgreSQL database.
//const { Pool } = require('pg'); //Pool class is created below when defining a function to open a new database connection pool.*/


// Load environment variables from .env file
require('dotenv').config();


// Import the database query function from the db module
const { query } = require('./helpers/db.js');

/*===============================================================================
2) Configuration:
This section sets up the server configuration, like the port number and the database connection pool function.
*/

// Define the port number that our backend server will listen on. This is where our Todo app backend will accept HTTP requests.
// Set the server port from environment variable OR use 3000 as default
const port = process.env.PORT || 3000;     //Without .env file -->  const port = 3001;


/* This part moved to db.js file after introducing .env file -->

Define a function to open a new database connection pool.
const openDb = function()
{
    // Create a new pool instance with configuration settings for the PostgreSQL database.
    const pool = new Pool({
      //At here the data is read by .env file (for security reason)
        user: process.env.DB_USER,      // The default superuser of the PostgreSQL database.
        host: process.env.DB_HOST,     // The server hosting the PostgreSQL database (localhost for the local machine).
        database: process.env.DB_NAME,      // The name of the database to connect to.
        password: process.env.DB_PASSWORD,      // The password for the database user (ensure this is secure in production).
        port: process.env.DB_PORT,            // The port where the PostgreSQL server is listening (5432 is the default).
    });

    // Return the pool object to allow the calling code to use this pool to make database connections.
    return pool;
}
*/


/*===============================================================================
3) Middleware Setup:
This section applies middleware used by the Express application, such as CORS and JSON body parsing.
*/

// Creates the Express application to set up our HTTP server.
const app = express();


// Apply CORS middleware to our Express app to handle cross-origin requests, ensuring the frontend can safely make requests to this backend.
app.use(cors());
// Middleware to parse incoming JSON payloads
app.use(express.json());


// This had to introduce because of DELETE Route
// This adds middleware to parse URL-encoded bodies (as sent by HTML forms).
// Since id for the deleted task is passed as a part of url, we need to this so that express can read parameters from url address.
app.use(express.urlencoded({extended: false}));










/*===============================================================================
4) Route Definitions:
This section defines the HTTP routes the server will respond to (GET and POST endpoints).
*/



/*
1. First check this block of code.
// Set up a route handler for HTTP GET requests to the root ("/") path. 
//This route could be used for health checks or initial API verification.
app.get('/', function(req, res) {
    // Respond with a JSON object and a 200 OK status code to indicate the backend is successfully running and reachable.
    res.status(200).json({result: 'success'});
});
*/

/*2. Then modify like this*/

/* <<<OLD GET endpoint to retrieve all tasks from the database>>>

app.get('/', function(req, res) 
{
    const pool = openDb();

    pool.query('SELECT * FROM task', function(error,result){
        if(error)
        {
            res.status(500).json({error: error.message});
        }
        res.status(200).json(result.rows);
    });
});
*/

// <<<<<<<<   NEW GET endpoint to retrieve all tasks from the database   >>>>>>>>>

// This route handler is now using the new 'query' function from the db.js module
app.get('/', async (req, res) => 
{
  try 
  {
      // The 'query' function is used instead of the 'pool.query' directly.
      // It simplifies error handling by allowing the use of try/catch with async/await.
      const result = await query('SELECT * FROM task');

      // Send the retrieved rows as JSON. If no rows are found, an empty array is returned.
      res.status(200).json(result.rows);
  } 
  catch (error) 
  {
      // Errors from the 'query' function are caught here and a 500 status code is sent back.
      console.error(error);
      res.status(500).json({ error: error.message });
  }
});



/* <<<OLD POST endpoint to create a new task in the database>>>

// POST endpoint to create a new task in the database   (This Route Handler waits for POST requests at the URLpath/new)
app.post("/new", function(req, res)
{
    // Obtain a pool of database connections
    const pool = openDb();
  
    // The $1 placeholder will be replaced with 'req.body.description' value.
    // 'RETURNING *' will return all columns of the inserted row, including the auto-generated ID.
    pool.query(
      "INSERT INTO task (description) VALUES ($1) RETURNING *",
      [req.body.description], // Extracts the description from the request body
      (error, result) => { // Callback function to handle the query result
        if (error) 
        {
          // If an error occurs, send a 500 Internal Server Error status code and the error message
          res.status(500).json({ error: error.message });
        } 
        else 
        {
          // If successful, send a 200 OK status code and the inserted task's ID
          res.status(200).json({ id: result.rows[0].id });  //This retriev from the first row of the result which database automatically generated when the new task was inserted
        }
      }
    );
});
*/


// <<<<<<<<   NEW POST endpoint to create a new task in the database   >>>>>>>>>

// This handler is updated to use the new 'query' function
app.post("/new", async (req, res) => 
{
  try 
  {
      // The 'query' function is called with the SQL command and the values for the placeholders
      // Using 'async/await' simplifies the code structure, avoiding nested callbacks.
      const result = await query('INSERT INTO task (description) VALUES ($1) RETURNING *', 
      [req.body.description]);
      // Respond with the new task's data
      res.status(200).json(result.rows[0]);
  } 
  catch (error) 
  {
      // Catch any errors and send back an appropriate response
      console.error(error);
      res.status(500).json({ error: error.message });
  }
});




/* <<<OLD DELETE endpoint to remove an existing task from the database>>>

// DELETE endpoint to remove an existing task from the database (This Route Handler waits for DELETE requests at the URL path/delete/:id)
app.delete("/delete/:id", async(req, res) => 
{
  // Obtain a pool of database connections
  const pool = openDb();

  // Get the ID from the request parameters and convert it to an integer
  const id = parseInt(req.params.id);

  // Execute the delete query with the ID, $1 is a placeholder for the ID
  pool.query("DELETE FROM task WHERE id = $1", 
  [id], 
  (error, result) => {
      if (error) 
      {
          // If an error occurs, send a 500 Internal Server Error status code and the error message
          res.status(500).json({error: error.message});
      } 
      else 
      {
          // If successful, send a 200 OK status code and the deleted task's ID
          // Assuming the query results in a change, the ID is returned as confirmation of deletion
          res.status(200).json({id: id});
      }
  });
});

*/


// <<<<<<<<   NEW DELETE endpoint to remove an existing task from the database   >>>>>>>>>

// This handler now uses the new 'query' function and 'async/await' syntax for simplicity
app.delete("/delete/:id", async (req, res) => 
{
  try 
  {
      // Convert the id from the request parameters to a number
      const id = Number(req.params.id);
      // Await the result of the deletion query
      const result = await query('DELETE FROM task WHERE id = $1 RETURNING *', [id]);
      
      // If no rows were returned, the task did not exist, so return a 404 error      
      if (result.rowCount === 0) 
      {
          res.status(404).json({ message: 'Task not found' });
      } 
      else 
      {
          // Otherwise, return the id of the deleted task
          res.status(200).json({ id: result.rows[0].id });
      }
  } 
  catch (error) 
  {
      // Handle any errors during the query
      console.error(error);
      res.status(500).json({ error: error.message });
  }
});




/*===============================================================================
5) Server Initialization:
This section starts the server, allowing it to listen for incoming requests.
*/

// Start listening for incoming HTTP requests on the defined port. This effectively starts our Todo app backend server.
// Adding a console log to indicate the server is running and on which port, providing immediate feedback in the development environment.
app.listen(port, () => {
  console.log(`Todo app backend server running on port ${port}`);
});

//=================== The code for the Todo app backend =========================


/*===============================================================================
1) Module Imports:
This section imports the necessary modules for the server to function.
*/

// Import Express to enable the creation of an HTTP server for our Todo app backend.
const express = require('express');
// Import CORS to allow our Todo app frontend (running on a different port or domain) to interact with this backend.
const cors = require('cors');
// Import the 'Pool' class from the 'pg' module, which is necessary for creating a pool of connections to the PostgreSQL database.
const { Pool } = require('pg'); //Pool class is created below when defining a function to open a new database connection pool.


/*===============================================================================
2) Configuration:
This section sets up the server configuration, like the port number and the database connection pool function.
*/

// Define the port number that our backend server will listen on. This is where our Todo app backend will accept HTTP requests.
const port = 3001;

// Define a function to open a new database connection pool.
const openDb = function()
{
    // Create a new pool instance with configuration settings for the PostgreSQL database.
    const pool = new Pool({
        user: 'postgres',      // The default superuser of the PostgreSQL database.
        host: 'localhost',     // The server hosting the PostgreSQL database (localhost for the local machine).
        database: 'todo',      // The name of the database to connect to.
        password: '1997',      // The password for the database user (ensure this is secure in production).
        port: 5432,            // The port where the PostgreSQL server is listening (5432 is the default).
    });

    // Return the pool object to allow the calling code to use this pool to make database connections.
    return pool;
}



/*===============================================================================
3) Middleware Setup:
This section applies middleware used by the Express application, such as CORS and JSON body parsing.
*/

// Initialize the Express application to set up our HTTP server.
const app = express();


// Apply CORS middleware to our Express app to handle cross-origin requests, ensuring the frontend can safely make requests to this backend.
app.use(cors());
// Middleware to parse incoming JSON payloads
app.use(express.json());





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
app.get('/', function(req, res) {
    const pool = openDb();

    pool.query('SELECT * FROM task', function(error,result){
        if(error)
        {
            res.status(500).json({error: error.message});
        }
        res.status(200).json(result.rows);
    });
});






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
        if (error) {
          // If an error occurs, send a 500 Internal Server Error status code and the error message
          res.status(500).json({ error: error.message });
        } 
        else {
          // If successful, send a 200 OK status code and the inserted task's ID
          res.status(200).json({ id: result.rows[0].id });  //This retriev from the first row of the result which database automatically generated when the new task was inserted
        }
      }
    );
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

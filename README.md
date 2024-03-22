# TODO Website Runs on Local Machine 🚀

This project created prior to host on a website. This can be run on your local machine by following steps as instructed.

## Getting Started 🏁

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites 📋

What things you need to install the software and how to install them:

- Git
- Node.js
- npm (Node Package Manager)

### Installing 🔧

A step-by-step series of examples that tell you how to get a development environment running:

1. **Clone the Repository**

    First, clone this repository to your local machine using Git:

    ```sh
    git clone https://github.com/ryandilthusha/Todo_Web.git
    ```

2. **Open the Project in Visual Studio Code**

    Open the cloned repository folder in Visual Studio Code (VS Code). You can do this from the command line:

    ```sh
    code Todo_Web
    ```

3. **Navigate to the Server Folder**

    Use the terminal in VS Code to navigate into the server directory:

    ```sh
    cd ./server
    ```

4. **Install Dependencies**

    Before running the application, you need to install its dependencies. Make sure you are in the server directory, then run:

    ```sh
    npm install
    ```

5. **Start the Development Server**

    To start the development server, run:

    ```sh
    npm run devStart
    ```

    This command will start the backend server, typically available at `http://localhost:3000` (the port might be different based on your setup).



## Database Setup 🗄️

To run this application locally, you'll need to set up a PostgreSQL database. Follow these steps to create a local database, the necessary table, and configure the application to connect to it.

### Prerequisites for Database Setup

- PostgreSQL installed on your local machine.
- pgAdmin4 (or another PostgreSQL management tool) installed for database management.

### Creating the Database

1. **Open pgAdmin4:** Launch pgAdmin4 and enter your master password.

2. **Create a New Database:**
   - Right-click on 'Databases' in the browser menu, then select 'Create' > 'Database'.
   - Name your database (e.g., `todo`) and click 'Save'.

### Setting Up the Database Table

1. **Create the Tasks Table:**
   - Open the query tool within the newly created database in pgAdmin4.
   - Execute the following SQL command to create a `task` table:

    ```sql
    CREATE TABLE task (
        id serial PRIMARY KEY,
        description varchar(255) NOT NULL
    );
    ```

2. **Insert Test Data (Optional):**
   - Optionally, insert some test data into the `task` table:

    ```sql
    INSERT INTO task (description) VALUES ('My test task');
    INSERT INTO task (description) VALUES ('My another test task');
    ```

### Configure Application to Use Local Database

- Navigate to the `.env` file in your project directory. If it doesn't exist, create one using the content provided below. Adjust any values to match your local setup, especially `DB_PASSWORD`:

    ```
    # .env file content
    PORT=3001
    DB_USER=postgres
    DB_HOST=localhost
    DB_NAME=todo
    DB_PASSWORD=1997
    DB_PORT=5432
    ```

- Ensure that your application's code references these environment variables for database connections.

## Running the Application 🚀

After setting up the database and initializing the tables, follow the previously mentioned steps to install dependencies and start the application.

Remember to specify any additional steps or scripts needed to start the frontend part of the application if it's separate from the backend.


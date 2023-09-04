# Getting Started with Your App

To start the development server, run the following command:

```bash
nx serve crud-api-fastify

Then, open your browser and navigate to http://localhost:4200/. Happy coding!


Before running the project, make sure to configure the database connection in the following file: src/app/plugin/postgres.ts. You will need to provide the correct values for the PostgreSQL database connection, including the ID, password, and database name.

Additionally, create a table named todos in the database with the following columns:

id (integer, auto-incremented)
title (text)
completed (boolean)
dateofcreation (date)
dateofcompletion (date)
imagelink (text)
API Endpoints
Create a Todo (POST Request)
Endpoint: http://localhost:3000/todos

Request Body (JSON):

{
  "title": "Call customer support",
  "completed": false,
  "dateOfCreation": "2023-09-04T04:49:32.613Z",
  "dateOfCompletion": null,
  "imageLink": null
}

Get all Todos with Not Completed Count and Sort by Date (GET Request)
Endpoint: http://localhost:3000/todos

Get Todo by ID (GET Request)
To retrieve a specific Todo, replace {id} in the URL with the actual Todo ID.

Endpoint: http://localhost:3000/todos/{id}

Update Todo by ID (PUT Request)
To update a Todo, replace {id} in the URL with the actual Todo ID. You can update the Todo properties in the request body.

Endpoint: http://localhost:3000/todos/{id}

Request Body (JSON):

{
  "title": "Call customer support soon",
  "completed": false,
  "dateOfCreation": "2023-09-04T04:49:32.613Z",
  "dateOfCompletion": null,
  "imageLink": null
}

Mark Todo as Complete (PUT Request)
To mark a Todo as complete, replace {id} in the URL with the actual Todo ID.

Endpoint: http://localhost:3000/todos/{id}/markComplete

Delete a Todo by ID (DELETE Request)
To delete a Todo, replace {id} in the URL with the actual Todo ID.

Endpoint: http://localhost:3000/todos/{id}


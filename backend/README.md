# Vehicle Management System - Backend

This is the backend for the Vehicle Management System, built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or a cloud instance like MongoDB Atlas)

## Installation

1.  **Clone the repository** (if you haven't already).
2.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```

## Environment Variables

Create a `.env` file in the `backend` directory and add the following variables. Replace the placeholder values with your actual configuration.

```
MONGO_URI=mongodb://localhost:27017/vehicle-management
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
```

- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secret key for signing JSON Web Tokens.
- `PORT`: The port on which the server will run.

## Running the Server

To start the server, run the following command from the `backend` directory:

```bash
npm start
```

You will need to add a `start` script to your `package.json`:
```json
"scripts": {
  "start": "node server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

The server will start on the port specified in your `.env` file (default is 5000).

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication (`/auth`)
- `POST /register`: Register a new user.
- `POST /login`: Log in a user.

### Vehicles (`/vehicles`)
- `POST /`: Create a new vehicle (protected).
- `GET /`: Get all vehicles for the logged-in user (protected).
- `PUT /:id`: Update a vehicle (protected).
- `DELETE /:id`: Delete a vehicle (protected).

### Dashboard (`/dashboard`)
- `GET /stats`: Get dashboard statistics (protected).

### Notifications (`/notifications`)
- `GET /`: Get all unread notifications (protected).
- `PUT /:id/read`: Mark a notification as read (protected).

## Notification Service

The application includes a service to generate notifications for documents that are expiring soon. This service is defined in `services/notificationService.js`.

In a production environment, you would run this service on a schedule using a cron job. For development, you can trigger it manually if needed by integrating it into an admin-only endpoint or running it as a separate script.

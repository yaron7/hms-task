# HMS Task Project

This is a full-stack web application built with React (TypeScript) for the frontend and Node.js (Express) with MySQL for the backend.

## Features

- User authentication (Login & Registration)
- MySQL database with a connection pool
- RESTful API using Express
- Frontend built with React and TypeScript
- Tailwind CSS for styling

## Project Structure

```
.vscode/
backend/
  ├── app.js         # Main server file
  ├── db.js          # Database connection and setup
public/
src/
  ├── components/    # React components
  ├── services/      # API service calls
  ├── types/         # TypeScript type definitions
  ├── App.tsx        # Main React component
  ├── index.tsx      # React entry point
.env                 # Environment variables
.env.template        # Template for env variables
.gitignore           # Git ignore file
package.json        # Dependencies and scripts
package-lock.json   # Locked dependency versions
README.md           # Project documentation
tailwind.config.js  # Tailwind CSS configuration
tsconfig.json       # TypeScript configuration
```

## Installation

### Prerequisites

- Node.js (LTS recommended)
- MySQL database

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo.git
   cd hms-task
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:

   - Copy `.env.template` to `.env` and update the values.

4. Start the backend:
   ```sh
   cd backend
   node app.js
   ```
5. Start the frontend:
   ```sh
   npm start
   ```

## API Routes

- `POST /login` - User login
- `POST /register` - User registration
- `GET /users` - Fetch all users (protected route)

## Technologies Used

### Frontend:

- React (TypeScript)
- Tailwind CSS
- React Hook Form & Yup

### Backend:

- Node.js (Express)
- MySQL (mysql2 package)
- dotenv

## Contributing

Feel free to fork and contribute to the project. Pull requests are welcome!

## License

This project is licensed under the MIT License.

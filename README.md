● Installation
  Follow these steps to set up the project locally.

◉ Prerequisites ◉
● Ensure you have the following installed on your system:

• Node.js (version >= 18.x)
• npm or yarn for package management
• PostgreSQL Supabase Database

◉ Clone the repository
    git clone https://github.com/your-username/seat-booking-system.git
    cd seat-booking-system

◉ Install dependencies
For both the frontend and backend, install the necessary dependencies:
● Backend (Node.js v >= 18.x)
    cd backend
    npm install
● Frontend (Nextjs v >= 15.x)
    cd frontend
    npm install


◉ Configure Environment Variables
● Create a .env file in the root of the backend folder and add the following:
    • DATABASE_URL= your-supabase-database-url use session pooler connection string for ipv4 support
    • PORT=8080
    • JWT_SECRET= your-JWT-secret


◉ Running the Project
● To run the project, start both the backend and frontend servers:
    Backend
        cd backend
        npm run dev
    Frontend
        cd frontend
        npm run dev

◉ Technologies
    ● Frontend: React/Nextjs, TailwindCSS, Axios
    ● Backend: Node.js, Express.js, PostgreSQL
    ● Authentication: JWT (JSON Web Tokens)


◉ Features
● User Signup: Users can sign up with their username, email and password.
● User Login: Users can log in to book seats and view their bookings.
● Seat Booking: Users can book up to 7 seats at a time.
● View Bookings: Users can view their booked seats.
● Reset Bookings: Admin users can reset all bookings. [username: admin, password: admin@123]
● Responsive UI: The app is mobile-friendly and has a clean, modern design.

◉ API Documentation
Base URL
http://localhost:8080/api

● Users
 • POST /users/signup
Signup with username, email and password.

Request Body:
    {
        "username": string,
        "email": string,
        "password": string
    }

Response:
    {
        "message": "User registered successfully."
    }

• POST /users/login
Login user with email and password.

Request Body:
    {
        "username": string,
        "password": string
    }

Response:
    {
        "token": "jwt_token_here",
        "user": {
        "id": "user_id",
        "email": "user@example.com",
        "role": "user/admin"
    }
    

● Seats
• POST /seats/book
Description:
Allows authenticated users to book a specified number of seats.

Request Headers:
Authorization: Bearer <your_token>

Request Body:
    {
        "numOfSeats": 3,
        "user_id": "user_id_here"
    }

Response (Success - All seats in the same row):
    {
        "message": "Seats booked successfully in the same row.",
        "seats": [1, 2, 3],
        "user_id": "user_id_here"
    }

Response (Success - Nearby rows):
    {
        "message": "Seats booked successfully in nearby rows.",
        "seats": [1, 2, 4],
        "user_id": "user_id_here"
    }

Response (Error - Not enough seats):
    {
        "message": "Only 2 seats are available."
    }

Response (Error - Internal server):
    {
         "message": "Internal Server Error."
    }

• GET /seats/seats
Description:
Retrieves all available seats ordered by row and seat number. This endpoint is open to all users.

Response (Success):
    {
        "availableSeats": [
    {
        "id": 1,
        "row_number": 1,
        "seat_number": 1,
        "is_booked": false
    },
    {
        "id": 2,
        "row_number": 1,
        "seat_number": 2,
        "is_booked": false
    }
    ]
    }


• GET /seats/booked-seats/:user_id
Description:
Fetches all seats booked by a specific user. Only authenticated users can access this endpoint.

Request Headers:
Authorization: Bearer <your_token>

Request Parameters:
user_id (string) - The ID of the user whose bookings are to be retrieved.

Response (Success):
    {
         "message": "Booked seats found",
  "bookedSeats": [
    {
      "id": 3,
      "row_number": 1
    },
    {
      "id": 4,
      "row_number": 1
    }
  ]
}

Response (No bookings):
    {
         "message": "No seats booked by this user."
    }

• POST /seats/reset
Description:
Allows admins to reset all seat bookings and mark all seats as available.

Request Headers:
Authorization: Bearer <your_admin_token>

Response (Success):
    {
        "message": "All seats have been reset."
    }

Response (Error - Unauthorized):
    {
        "message": "Access denied. Admin privileges required."
    }

Notes:
Ensure the database is properly initialized with is_booked set to false for all seats initially.



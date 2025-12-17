Mini Event Platform - MERN Stack
I have built a complete web application where users can create events, view them on a dashboard, and join events with strict capacity limits.

🚀 Live Demo

Frontend Deployed URL: [Link to your Vercel App]

Backend Deployed URL: [Link to your Render Server]

GitHub Repository: [Link to your GitHub]

✨ Features Implemented

Authentication:

User Signup & Login using JWT Tokens (secure session management).

Passwords are encrypted for security.

Event Management:

Create new events with Title, Date, Location, Image, and Capacity.

View all upcoming events on the Home Page.

Edit & Delete: Only the user who created the event can edit or delete it.

RSVP System:

Users can join events with a single click.

Capacity Handling: The system stops people from joining if the event is full.

Dashboard: A private page showing "Events I Created" and "Events I Joined".

Guest List: Creators can see the names and emails of people who joined their event.

Bonus Features:

Dark Mode: Toggle between light and dark themes (saved in local storage).

Responsive Design: Works well on mobile and desktop.

🛠️ Tech Stack

Frontend: React.js, Bootstrap (for UI), Axios (for API calls), React Router.

Backend: Node.js, Express.js.

Database: MongoDB Atlas (Cloud Database).

Authentication: JWT (JSON Web Tokens) & Cookies.

⚙️ How to Run Locally

Follow these steps to run the project on your machine.

1. Backend Setup (Server)
   Open the server folder in terminal.

Install dependencies:

Bash

npm install
Create a .env file in the server folder and add these details:

Code snippet

PORT=9000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Start the server:

Bash

npm start
Server will run on http://localhost:9000

2. Frontend Setup (Client)
   Open the client folder in a new terminal.

Install dependencies:

Bash

npm install
Start the React app:

Bash

npm run dev
Client will run on http://localhost:5173

🧠 Technical Explanation: Handling Concurrency & Overbooking

One of the main requirements was to prevent "Overbooking" when many users try to join an event at the exact same time (Race Conditions).

My Solution: Instead of using a simple "Read then Write" approach (which fails under high load), I used MongoDB Atomic Updates.

I used the findOneAndUpdate query with a specific condition. The database checks the capacity during the update operation itself.

The Code Logic:

JavaScript

const updatedEvent = await Event.findOneAndUpdate(
{
\_id: id,
attendees: { $ne: userId }, // 1. Check if user is NOT already in list
    $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] } // 2. Check if size is LESS than capacity
},
{
$push: { attendees: userId } // Only push if both conditions above are true
}
);

Because MongoDB operations are atomic, no two requests can modify the document at the exact same moment. If the event has 1 spot left and 2 users click "Join", the database will only let one succeed and the other will fail. This guarantees that we never exceed the set capacity.

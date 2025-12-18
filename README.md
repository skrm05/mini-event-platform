# Mini Event Platform - MERN Stack

A full-stack web application that allows users to create, view, and RSVP to events with strict capacity enforcement. Built as part of a Full Stack Developer Intern assessment.

---

## 🚀 Live Demo

- **Frontend Deployed URL:** [Link to your Vercel App]
- **Backend Deployed URL:** [Link to your Render Server]

---

## ✨ Features Implemented

### **Authentication & Security**

- **User Signup & Login:** Secure authentication using **JWT (JSON Web Tokens)**.
- **Session Management:** Stateless session handling via HTTP-only cookies and local storage backup.
- **Password Encryption:** User passwords are hashed before storage for security.

### **Event Management (CRUD)**

- **Create Events:** Users can create events with Title, Description, Date, Location, Image, and Max Capacity.
- **Edit & Delete:** Strict authorization ensures only the **creator** of an event can modify or delete it.
- **Dashboard:** A unified view showing upcoming events on the homepage.

### **RSVP System (The Core Challenge)**

- **Join/Leave Events:** Users can RSVP to events with a single click.
- **Capacity Enforcement:** The system strictly prevents joining if an event is full.
- **Guest List:** Event creators can view a list of attendees (Name & Email) for their events.

### **Bonus Features**

- **🎨 Dark Mode:** Toggle between Light and Dark themes (preference persisted in Local Storage).
- **📱 Responsive UI:** Fully optimized layout for Desktop, Tablet, and Mobile devices using Bootstrap.
- **👤 User Dashboard:** A private area to manage "Events I Created" and view "Events I Joined".

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Bootstrap 5, Axios, React Router DOM.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas (Cloud).
- **Authentication:** JWT, bcryptjs.
- **Deployment:** Vercel (Client) + Render (Server).

---

## ⚙️ How to Run Locally

Follow these steps to run the project on your local machine.

### **1. Clone the Repository**

```bash
git clone [gh repo clone skrm05/mini-event-platform]
cd mini-event-platform
```

2. Backend Setup
   Navigate to the server folder and install dependencies.

Bash

cd server
npm install
Create a .env file in the server folder and add the following credentials:

Code snippet

PORT=9000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_complex_secret_key
NODE_ENV=development
Start the backend server:

Bash

npm start
Server will run on: http://localhost:9000

3. Frontend Setup
   Open a new terminal, navigate to the client folder, and install dependencies.

Bash

cd client
npm install
Start the React development server:

Bash

npm run dev
Client will run on: http://localhost:5173

🧠 Technical Explanation: Handling Concurrency & Overbooking
One of the critical requirements for this assignment was to handle Race Conditions—preventing "Overbooking" when multiple users try to RSVP for the last available spot at the exact same millisecond.

The Problem
A standard "Read-Check-Write" approach (read capacity -> check if full -> update) fails under high concurrency because multiple requests can "read" the available spot simultaneously before any of them write the update.

My Solution: Atomic Updates
I utilized MongoDB's Atomic Operators to perform the check and the update in a single database operation. This ensures data consistency without needing complex transaction locks.

The Code Logic:

JavaScript

const updatedEvent = await Event.findOneAndUpdate(
{
\_id: id,
// 1. Concurrency Check: Ensure strictly less than capacity
$expr: { $lt: [{ $size: "$attendees" }, "$capacity"] },
// 2. Duplicate Check: Ensure user is not already in the list
attendees: { $ne: userId }
},
{
$push: { attendees: userId } // Atomic Push
},
{ new: true }
);
Why this works: Because MongoDB operations on a single document are atomic, the database itself enforces the rule. If two users vie for one spot, the database processes the requests sequentially. The first one succeeds, and the second one fails the $expr condition immediately, guaranteeing that the capacity limit is never breached.

Developer: Sanjay kumar

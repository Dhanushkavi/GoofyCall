📞 GoofyCall – Real-Time Video Calling Web App

GoofyCall is a real-time video calling web application built using the MERN stack and Socket.IO, inspired by modern calling apps like WhatsApp.

It allows users to register, log in, connect using a socket ID, and initiate real-time calls with a clean, responsive, and modern UI.

🚀 Features
🔐 Authentication

User Registration & Login

Secure password hashing using bcrypt

JWT-based authentication

📡 Real-Time Communication

Real-time socket connection using Socket.IO

Unique Socket ID for each user

Call initiation & acceptance flow

Call status handling (calling, connected, ended)

🎥 Call Interface

Dedicated call screen with:

Caller & receiver panels

Call controls (End, Mute, Camera toggle – placeholder)

Incoming call popup with Accept / Reject

Smooth UI transitions

🎨 UI & UX

Modern, WhatsApp-inspired UI

Centered layout with proper spacing

Fully responsive design

Dark gradient theme

Reusable UI components

🛠 Tech Stack
Frontend (Client)

React (Vite)

React Router

Socket.IO Client

Custom CSS styling

LocalStorage for session handling

Backend (Server)

Node.js

Express.js

MongoDB + Mongoose

Socket.IO

JWT Authentication

bcryptjs

Deployment

Frontend → Netlify

Backend → Render

Database → MongoDB Atlas

📁 Project Structure
GoofyCall/
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/          # Login, Register, Home, Call
│   │   ├── components/     # IncomingCall, UI components
│   │   ├── socket.js       # Socket client configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                 # Express backend
│   ├── routes/
│   │   └── userRoutes.js
│   ├── models/
│   │   └── User.js
│   ├── index.js            # Server entry point
│   ├── .env
│   └── package.json
│
└── README.md

⚙️ Environment Variables .env:
Server (.env)
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173


🧠 How It Works

User registers or logs in

Socket connects and assigns a unique Socket ID

User shares their Socket ID with another user

Caller sends a call request via Socket.IO

Receiver gets an incoming call popup

On acceptance, both users enter the call screen

Call status updates in real-time

🚧 Current Limitations

WebRTC video streaming is currently a placeholder

Camera preview is local only

No chat feature yet

No call history

🔮 Future Enhancements

🔴 Real WebRTC video & audio streaming

💬 In-call chat

📱 Mobile-first UI improvements

📞 Call history

🔔 Sound notifications

🧑‍🤝‍🧑 Contact list

👨‍💻 Author

Dhanushkavi
Frontend Developer & UI/UX Designer
Passionate about building user-friendly, real-time web applications.

GitHub: https://github.com/Dhanushkavi

LinkedIn: https://linkedin.com/in/dhanushkavi

⭐ Support

If you like this project:

⭐ Star the repository

🍴 Fork it

🧑‍💻 Contribute improvements
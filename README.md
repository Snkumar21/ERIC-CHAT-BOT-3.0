# ERIC-CHAT-BOT-3.0

A real-time chat bot system built by **Nitish Kumar Singh (Snkumar21)**.  
This README describes how to set up, configure and run the project locally (and optionally in deployment).

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Configuration](#configuration)  
  - [Database Setup](#database-setup)  
  - [Running the Application](#running-the-application)  
- [Usage](#usage)  
- [Deployment](#deployment)  
- [Project Structure](#project-structure)  
- [Contributing](#contributing)  
- [License](#license)  
- [Contact](#contact)  

---

## Project Overview

ERIC-CHAT-BOT is a chat-bot platform intended to integrate with your existing backend (for example an HRMS or other system). It allows users to interact in real‐time via chat, supports file uploads, stores messages in a database, and is built on a modern full-stack architecture.

---

## Features

- Real-time chat messaging (send/receive)  
- File upload support (e.g., users send files in chat)  
- Persistent storage of users and messages  
- Integration with backend APIs (Express/Node.js)  
- MongoDB for data persistence  
- Use of FontAwesome icons and Axios for frontend requests  
- Modular architecture: separate models for users and messages  
- Ready for extension: e.g., additional chat features, notifications, user status, etc.

---

## Tech Stack

- Frontend: Html, CSS, JavaScript
- Backend: Node.js + Express  
- Database: MongoDB (with Mongoose ODM)
- HTTP client: Axios  
- UI icons: FontAwesome  
- File upload handling (via multer or similar)  
- Hosting: can deploy backend on services like Render; frontend on Vercel

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or above recommended)  
- npm
- MongoDB instance
- (Optional) Git  
- (Optional) A hosting account (if you deploy)

### Installation

1. Clone the repository  
   ```bash
   git clone https://github.com/Snkumar21/ERIC-CHAT-BOT.git
   cd ERIC-CHAT-BOT
   ```

2. Install backend dependencies  
   ```bash
   cd server      # or wherever your backend folder is named
   npm install
   ```

3. Install frontend dependencies  
   ```bash
   cd ../client    # or the appropriate frontend folder
   npm install
   ```

### Configuration

Create a `.env` (environment) file in the backend root (e.g., `server/.env`) with the following variables (adjust names as applicable):

```
OPENAI_KEY=open_api_key
MONGO_URI=mongodb+srv://<user_id>:<password>@cluster0.inpucev.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
WEATHER_API_KEY=WEATHER_API_KEY
```

- `PORT` – the port your Express app will listen on.  
- `MONGO_URI` – connection string for MongoDB.  
- `OPENAI_KEY` – api call with chatgpt connection.
- `WEATHER_API_KEY` – weather api key for fetching the details of current weather. 
### Database Setup

1. Make sure your MongoDB instance is running.  
2. The backend uses two models: `User` and `Message`. First time you run the app, the required collections (`users`, `messages`) will be created automatically by Mongoose.  
3. (Optional) Insert some test users into the `users` collection via MongoDB Compass or CLI.

### Running the Application

#### Local development

Start the backend:

```bash
cd backend
node server.js
```

Start the frontend:

```bash
cd public
VS CODE Extension `Go Live` # by default runs at http://localhost:5000
```

You should now be able to access the chat app at [http://localhost:5000](http://localhost:5000). The backend API runs on [http://localhost:5000](http://localhost:5000) (or the port you configured).

#### Build & production mode

For production you might:

```bash
cd backend
node server.js
# Serve the static build via backend or deploy separately
```

Then host the backend on a service like Render or Railway and point the frontend to it.

---

## Usage

- Register or login a user (depending on your auth setup).  
- Click on another user to initiate chat.  
- Send text messages or upload files.  
- Messages are stored in MongoDB and streamed in real-time (via WebSocket or polling, whichever is implemented).  
- Extendable: you can add groups, notifications, read receipts, message statuses.

---

## Deployment

1. Choose a host for your backend (e.g., Railway, Render, Heroku).  
2. Set environment variables on your host platform (same as `.env`).  
3. Deploy the backend (git push or link repo).  
4. For frontend create a production build (`npm run build`) and deploy via Vercel, Netlify or host via backend’s static serve.  
5. Point environment variable in frontend (e.g., `REACT_APP_API_URL`) to the deployed backend URL.  
6. Ensure CORS settings in backend allow your frontend origin.

---

## Project Structure

```
ERIC-CHAT-BOT/
├── backend/             # Backend (Express + Node.js)
│   ├── models/
│   │   ├── Chat.js
│   │   ├── ChatData.js
│   │   ├── chatMemory.js
│   │   ├── Dataset.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── datasetRoutes.js
│   │   └── weatherRoutes.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── server.js
│   └── .env
├── public/             # Frontend
│   ├── index.html
│   ├── about.html
│   ├── home.html
│   ├── register.html
│   ├── contact.html
│   ├── bot.js
│   ├── script.js
│   ├── style.css
│   └── BotAvatar.png
└── README.md
```

*Note:* adjust folder names if your project uses different names or structure.

---

Please ensure your code adheres to the existing style and is well-documented.

---

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

## Contact

Created by **Nitish Kumar Singh (Snkumar21)**.  
GitHub: [https://github.com/Snkumar21](https://github.com/Snkumar21)  
Email: snkumar6926@gmail.com

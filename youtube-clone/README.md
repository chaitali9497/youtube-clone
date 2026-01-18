# YouTube Clone (MERN Stack)

A **full-stack YouTube-like video streaming platform** built using the **MERN stack**.  
This project replicates core YouTube features such as **authentication, channels, video uploads, comments, likes, and video management**, with a clean and responsive UI.

 **Live Frontend:**  
https://youtube-clone-h7ec-9waivv0aj-chaitali9497s-projects.vercel.app/

 **Live Backend API:**  
https://youtube-clone-5-p6cw.onrender.com

---

##  Project Purpose

The purpose of this project is to:

- Learn and implement **real-world MERN stack architecture**
- Build **RESTful APIs** with proper validation
- Understand **authentication & authorization**
- Practice **frontend–backend integration**
- Deploy a production-ready application

This project is ideal for **learning, portfolio showcase, and academic evaluation**.

---

## Features

###  Authentication
- User signup & login
- JWT-based authentication
- Protected routes

###  Videos
- Upload videos with thumbnail
- Edit & delete videos
- Fetch videos by channel
- Video detail page

###  Channels
- Create channels
- View channel profile
- Display all channel videos

###  Comments
- Add comments on videos
- Delete own comments
- Real-time UI updates

###  Interactions
- Like / unlike videos
- View counts

###  UI / UX
- Responsive design
- Custom components
- Snackbar alerts & loaders

---

##  Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Tailwind CSS
- LocalStorage (JWT persistence)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- REST APIs

### Deployment
- Frontend: **Vercel**
- Backend: **Render**

---

  Project Structure

youtube-clone/
│
├── UserInterface/
│ ├── public/
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── utils/
│ ├── assets/
│ └── App.jsx
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── server.js
│
├── .env.example
└── README.md


---

##  Installation & Setup

###  Clone the Repository

```bash
- git clone https://github.com/your-username/youtube-clone.git

- cd youtube-clone
---

## Backend Setup

```bash
- cd backend

- npm install

- npm run dev


## Frontend Setup

```bash
- cd frontend

- npm install

- npm run dev
---
###  Application Flow

- User logs in → JWT stored in localStorage

- Frontend sends authenticated API requests

- Backend middleware verifies token

- Controllers handle business logic

- MongoDB stores application data

---

#### Key Concepts Implemented

- MVC architecture

- RESTful API design

- Token-based authentication

- Secure CRUD operations

- Error handling & validation

- Deployment best practices
---

##### Deployment 

- Frontend deployed on Vercel

- Backend deployed on Render

- CORS properly configured

- Environment variables secured

- Production-ready build

---


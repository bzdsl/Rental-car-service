<!-- @format -->

# Car Rental Service (MERN Stack)

## Description

A full-stack car rental web application that allows users to browse available cars, select rental dates, and complete the booking process. Includes an admin panel for managing cars, users, and rental history.

## Technologies Used

- Frontend: React 18, Zustand (state management), Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Image Storage: Cloudinary
- Authentication: JWT (JSON Web Tokens)
- Date Handling: date-fns

## How to Run the Project Locally

### Prerequisites

- Node.js and npm installed
- MongoDB running locally or MongoDB Atlas account
- Cloudinary account (for image uploads)

### 1. Clone the repository

```
git clone https://github.com/bzdsl/Rental-car-service.git
cd car-rental-service
```

### 2. Setup backend

```
cd server
npm install
```

Create a `.env` file in the `server` folder with these variables:

```
MONGO_URI=mongo_connection_string
JWT_SECRET=jwt_secret
CLOUDINARY_CLOUD_NAME=cloudinary_name
CLOUDINARY_API_KEY=cloudinary_api_key
CLOUDINARY_API_SECRET=cloudinary_api_secret
STRIPE_SECRET_KEY=stripe_api_key
```

Start the backend server:

```
npm run dev
```

### 3. Setup frontend

```
cd ../client
npm install
npm run dev
```

The frontend will be running at `http://localhost:3000` and the backend at `http://localhost:5000`.

## Features

### User Features

- View available cars
- Select rental dates
- Book a car without requiring an account
- Responsive design for mobile and desktop

### Admin Features

- Add, update, and delete cars
- View booking history
- Manage users (if applicable)

## What I Learned

- Building a full-stack CRUD application with the MERN stack
- Structuring frontend and backend code for better maintainability
- Implementing state management using Zustand
- Handling date-based booking logic
- Uploading and managing images with Cloudinary

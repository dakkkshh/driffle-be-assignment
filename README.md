# Backend Developer Intern Assignment Submission

## Overview

The provided backend application fulfills the requirements for user authentication, note management, and search functionality. The application is built using Node.js with the [Express](https://expressjs.com/) framework, [express-validator](https://express-validator.github.io/docs/), [JWT (JSON Web Tokens)](https://jwt.io/), and [MongoDB](https://www.mongodb.com/) as the database.

## How to use Postman Collection
1. **Download the Postman Collection**
2. **Add API_URL as "example.com/api" in the Environment Variables**
3. **Login with the following creds:**
    - email - test@gmail.com
    - password - Qwerty@123
4. **Create and Manage your Notes!**

## API Routes

### User Routes

1. **Register User**
   - **Method:** POST
   - **Endpoint:** /user/register
   - **Request Body:** 
     - email
     - name
     - password

2. **Get User Information**
   - **Method:** GET
   - **Endpoint:** /user

3. **User Login**
   - **Method:** POST
   - **Endpoint:** /user/login
   - **Request Body:** 
     - email
     - password

4. **User Logout**
   - **Method:** POST
   - **Endpoint:** /user/logout

### Notes Routes

1. **Get Notes**
   - **Method:** GET
   - **Endpoint:** /note
   - **Query Parameters:** 
     - title

2. **Create a Note**
   - **Method:** POST
   - **Endpoint:** /note
   - **Request Body:** 
     - title
     - content

3. **Get a Specific Note**
   - **Method:** GET
   - **Endpoint:** /note/noteId

4. **Update a Note**
   - **Method:** PATCH
   - **Endpoint:** /note/noteId
   - **Request Body:** 
     - isRead
     - title

5. **Delete a Note**
   - **Method:** DELETE
   - **Endpoint:** /note/noteId

## Environment Variables (env.example)

```env
MONGODB_URI=your_mongodb_uri
PORT=8080
ACCESS_TOKEN_EXPIRY_IN_MINUTES=120
JWT_SECRET=your_jwt_secret
LOG_LEVEL=debug
```

## How to run locally
1. Pull the code from the repo
2. Run `npm i` to install the required packages
3. Copy .env.example to a new file .env and add the enviroment variables
4. Use `npm run dev` to launch using nodemon
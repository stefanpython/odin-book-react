# Odin Book

Live demo [Here](https://stefanpython.github.io/odin-book-react/)

Odin Book is a social media platform where users can connect with friends, share posts, and interact with each other. This app is built using React for the frontend and a custom RESTful API for the backend.

## Features

- User registration and login
- User profiles with profile pictures and personal details
- Friend system with the ability to send and accept friend requests
- Post creation and display on user profiles
- Commenting on posts
- Edit user profile functionality
- Search for other users

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/odin-book.git

2. Navigate to the project directory:
   ```bash
    cd odin-book

3. Install the dependencies:
   ```bash
   npm install

4. Start the development server:
   ```bash
   npm start

5. Open your web browser and visit http://localhost:3000 to access the app.

## API Configuration

The frontend app communicates with a backend API to fetch and send data. You need to configure the API endpoint before running the app. Follow these steps:

1. Open the file src/api/config.js in your code editor.
2. Replace the value of the API_BASE_URL variable with the URL of your backend API.
    const API_BASE_URL = "https://your-api-endpoint.com";
3. Save the file.

## Deployment
To deploy the app to a production environment, you need to build the optimized version of the app and deploy it to a web server. Follow these steps:

1. Build the app:
   npm run build
   
2. The build files will be generated in the build directory. Deploy these files to your web server.

3. Configure the web server to serve the app's index.html as the default file and handle routing correctly.

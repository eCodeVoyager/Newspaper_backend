# Newspaper Website Backend API

Welcome to the Newspaper Website Backend API! This API, developed using Node.js, Express.js, and MongoDB, provides functionality for managing articles, categories, and users.

## Documentation Links

Explore and interact with the API using the following Postman Collection Documentation links:

1. [Users Collection Documentation]([https://www.postman.com/collections/YOUR_USERS_COLLECTION_ID](https://documenter.getpostman.com/view/32008492/2sA2xiWXk9))
2. [Categories Collection Documentation]([https://www.postman.com/collections/YOUR_CATEGORIES_COLLECTION_ID](https://documenter.getpostman.com/view/32008492/2sA2xiWXk6))
3. [Articles Collection Documentation]([https://www.postman.com/collections/YOUR_ARTICLES_COLLECTION_ID](https://documenter.getpostman.com/view/32008492/2sA2xjyAsa))

## Server Link

[Newspaper Backend Server](https://newspaper.azurewebsites.net)


## Project Installation

To run the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/newspaper-backend.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd newspaper-backend
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Create a `.env` file:**

   Create a file named `.env` in the project directory and define the following variables. Replace the placeholder values with your specific configurations.

   ```dotenv
   PORT=3000
   MONGODB_URI=mongodb+srv://your-mongodb-uri
   ACCESS_TOKEN_SECRET=your-secret
   REFRESH_TOKEN_SECRET=your-secret
   ACCESS_TOKEN_LIFE=1d
   REFRESH_TOKEN_LIFE=100d
   ```

   *Note: An example `.env` file is provided in the project folder.*

5. **Run the project:**

   ```bash
   npm start
   ```

   The server will be running at `http://localhost:3000` by default.

---

## JWT Token Configuration

The API utilizes JWT (JSON Web Tokens) for user authentication. Customize the JWT configuration by editing the `.env` file.


Feel free to reach out for any questions or assistance. Happy coding!


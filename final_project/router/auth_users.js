const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
    "username": "Bennett",
    "password": "pass1"
},{
    "username": "user2",
    "password": "pass2"
},{
    "username": "user3",
    "password": "pass3"
}
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}
  const JWT_SECRET = "Ju7Xa8JpX1+Z9k1sPz3Y4mE6Vh2q9T0cWx8zQ2lRb7U=";


//only registered users can login
regd_users.post("/login", (req,res) => {
const { username, password } = req.body;

  // 1️⃣ Validate inputs
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // 2️⃣ Find user
  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // 3️⃣ Create JWT payload
  const payload = {
    username: user.username,
  };

  // 4️⃣ Sign token
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  // 5️⃣ Return token
  return res.status(200).json({
    message: "Login successful! Welcome, " + username
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }
 
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      { username, password },
      "fingerprint_customer",
      { expiresIn: "1h" }
    );

    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({
      message: "User successfully logged in",
      //author: req.session.authorization,
      token: accessToken,
      //person: username
    });
  }

  return res.status(401).json({
    message: "Invalid username or password"
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const review = req.query.review;
  const username = req.session.authorization?.username;
  
  if (!username) {
    return res.status(401).json({ message: "Please log in first" });
  }

  if (!review) {
    return res.status(400).json({ message: "A review is required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json(books[isbn].reviews);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!username) {
    return res.status(401).json({ message: "Please log in first" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews) {
    delete books[isbn].reviews[username];
  }

  return res.status(200).json(books[isbn].reviews);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

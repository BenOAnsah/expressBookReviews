const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
// 1️⃣ Get username & password from request body
const { username, password } = req.body;

// 2️⃣ Check if both fields are provided
if (!username || !password) {
  return res.status(400).json({ message: "Username and password are required." });
}

// 3️⃣ Check if username already exists
const userExists = users.some(user => user.username === username);
if (userExists) {
  return res.status(409).json({ message: "Username already exists. Please choose another one." });
}

// 4️⃣ Add new user to the array
users.push({ username, password });

// 5️⃣ Send success response
return res.status(201).json({ message: "User registered successfully!" });});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 2))  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
const isbn = req.params.isbn;
const book = books[isbn];

if (book) {
  res.send(JSON.stringify(book, null, 2));
} else {
  res.status(404).json({ message: "Book not found" });
}
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const keys = Object.keys(books);
    const matchingBooks = [];
  
    keys.forEach(key => {
      if (books[key].author === author) {
        matchingBooks.push(books[key]);
      }
    });
    if (matchingBooks.length > 0) {
      res.send(JSON.stringify(matchingBooks, null, 2));
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  const matchingBooks = [];

  keys.forEach(key => {
    if (books[key].title === title) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 2));
  } else {
    res.status(404).json({ message: "No books found with that title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
// 1️⃣ Get ISBN from request parameters
  const isbn = req.params.isbn;

  // 2️⃣ Look up the book by ISBN
  const book = books[isbn];

  // 3️⃣ If found, return the reviews
  if (book) {
    res.send(JSON.stringify(book.reviews, null, 2));
  } else {
    res.status(404).json({ message: "Book not found" });
  }});

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // 2. Validate that both fields are provided
  if (!username || !password) {
    return res.status(400).json({ 
      error: 'Username and password are required.' 
    });
  }

  // 3. Check if the username already exists
  const existingUser = users.find(user => user.username === username);//isValid
  if (existingUser) {//isValid
    return res.status(409).json({ 
      error: 'Username already exists.' 
    });
  }

  // 4. Register the new user
  // (Note: In a real app, hash the password with bcrypt before saving)
  const newUser = { username, password };
  users.push(newUser);

  // 5. Return success response
  return res.status(201).json({ 
    message: 'User registered successfully.' 
  });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const isbns = Object.keys(books);
  const booksByAuthor = [];

  for ( isbn of isbns){
    if (books[isbn].author === author){
        booksByAuthor.push(books[isbn])
    }
  }  
  return res.send(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const isbns = Object.keys(books);
  booksByTitle = [];

  for ( isbn of isbns){
    if (books[isbn].title === title){
        booksByTitle.push(books[isbn])
    }
  }  
  return res.send(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username,password} = req.body;
  const user = users.find((a) => a.username === username && a.password === password);
  if(user){
    const token = jwt.sign({username,password}, "access");
    req.session.authorization = {accessToken : token, username};
    res.send({message : "user logged in successfully", accessToken : token});
  }
  else {
    res.send("Invalid credentials");
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const bookData = await fetch('https://openlibrary.org/isbn/' + isbn + '.json');
  const data = await bookData.json();
  const bookTitle = data.title;

  const booksArray = Object.values(books);
  const requiredBook = booksArray.find((book) => book.title === bookTitle)
  const reviewer = req.session.authorization['username'];


  requiredBook.reviews[reviewer] = review;
  console.log(books);
  return res.send("review added successfully");

});

regd_users.delete("/auth/review/:isbn", async (req,res) => {


  const isbn = req.params.isbn;
  const review = req.query.review;
  const bookData = await fetch('https://openlibrary.org/isbn/' + isbn + '.json');
  const data = await bookData.json();
  const bookTitle = data.title;

  const booksArray = Object.values(books);
  const requiredBook = booksArray.find((book) => book.title === bookTitle)
  const reviewer = req.session.authorization['username'];


  delete requiredBook.reviews[reviewer];
  console.log(books);
  return res.send("review deleted successfully");

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

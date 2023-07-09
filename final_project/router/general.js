const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  const user = users.find((a) => a.username === username)
  if(user){
    res.send({message: "User already exists"})
  }
  else{
    if(username && password){
      users.push({username,password});
      res.send("User registered successfully");
    }
    else{
      res.status(400).send("Kindly provide a valid username and password");
    }
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,1));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  
  const isbn = req.params.isbn;

  const bookData = await fetch('https://openlibrary.org/isbn/' + isbn + '.json');
  const data = await bookData.json();
  const bookTitle = data.title;

  const booksArray = Object.values(books);
  return res.send(booksArray.find((book) => book.title === bookTitle));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksArray = Object.values(books);
  return res.send(booksArray.find((book) => book.author === author))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  const title = req.params.title;
  const booksArray = Object.values(books);
  return res.send(booksArray.find((book) => book.title === title))
  //Write your code here

});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const bookData = await fetch('https://openlibrary.org/isbn/' + isbn + '.json');
  const data = await bookData.json();
  const bookTitle = data.title;

  const booksArray = Object.values(books);
  const requiredBook = booksArray.find((book) => book.title === bookTitle)
  return res.send(requiredBook.reviews);
});

module.exports.general = public_users;

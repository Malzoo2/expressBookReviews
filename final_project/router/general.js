const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  console.log("here inr register ")
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (isValid(username)) {
        // Add the new user to the users array
        users.push({"username": username, "password": password});
        console.log("users is "+ JSON.stringify(users, null,4));
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
}
// Return error if username or password is missing
return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null,4));
});

// Function with a Promise to be called for async GET requests
function getBooksByPromised(books) { 
  return new Promise((resolve, reject) => {
      if (books) 
          resolve(books);
       else 
          reject("No books available.");
  });
}


public_users.get('/task10',async function (req, res) {
  //Write your code here
  let bookList = await getBooksByPromised(books);
  res.send(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.send(books[req.params.isbn]);
  //return res.send(JSON.stringify(books[req.params.isbn], null,4));
 });

 public_users.get('/isbn/task11/:isbn', async function (req, res) {
  //Write your code here
  console.log('in async func');
   await getBooksByPromised(books[req.params.isbn])
  .then(res => res.send(res), err => res.send(err));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let filteredBooks = [];
  for (const [key, value] of Object.entries(books)) 
    if (value.author === author) filteredBooks.push(value);
  

  return res.send(filteredBooks);
});

public_users.get('/author/task12/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;
  let filteredBooks = [];
  for (const [key, value] of Object.entries(await getBooksByPromised(books))) 
    if (value.author === author) filteredBooks.push(value); 
 return res.send(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filteredBooks = [];
  for (const [key, value] of Object.entries(books)) 
    if (value.title === title) filteredBooks.push(value);
  

  return res.send(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;

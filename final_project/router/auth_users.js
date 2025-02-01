const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return true;
}

const isUserNameExist = (book, username) =>{
  for (const [key, value] of Object.entries(book.reviews))
       if (key === username) { return true};  
  return false;     
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validUser = users.filter((user) => {
  return (user.username === username && user.password === password);
});
return  (validUser.length> 0)?  true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  console.log("in login fun");
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password){
    return res.status(404).json({message: "body issue in login"});
  }

  if (authenticatedUser(username,password)){
      let accessTkn = jwt.sign({data: password},'access',{expiresIn: 60 });
      req.session.authorization = {accessTkn,username};
      //console.log("token in login is"+accessTkn);
      return res.status(200).send("User Logged in ");
  } else{
    return res.status(208).json({message: "invalid Login. check user name and password in array"});
  }

  //return res.status(208).json({message: "error last return"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  
  const username = req.session.authorization['username'];
  //console.log('username is '+username);
  const book = books[req.params.isbn];
  const review = req.query.review;

  
  //console.log('user is '+ JSON.stringify(user) );
  // console.log('sessionUserName is '+ sessionUserName );
  // console.log('review obj by username '+ isUserNameExist(book,username));
  // console.log('type of review '+ (typeof book.reviews));

  if (book && username && review){
    if (isUserNameExist(book,username))
      delete book.reviews[username];
  
   
    book.reviews[username] = review ;
    //console.log('reviews are '+ JSON.stringify(book.reviews) );

    return res.status(200).send("Review has been saved.");
  }
  else  
    return res.status(208).json({message: "invalid API call"});



  
});


regd_users.delete("/auth/review/:isbn", (req, res) => {

  const username = req.session.authorization['username'];
  const book = books[req.params.isbn];
  
  if (book && username){
    if (isUserNameExist(book,username)){
      delete book.reviews[username];
      return res.status(200).send("Review has been deleted.");
    }
    else
    return res.status(208).json({message: "Username is not available"});
    
  }
  
    


});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

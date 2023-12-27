const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
  })
  .then(() => {
    console.log("Database Connected !");
  })
  .catch((e) => {
    console.log(e);
  }); // PROMISE RETURN KAREGA
//                                                              // same as button events

const userSchema = new mongoose.Schema({
  // CREATING SCHEMA
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema); // collection messages naam se hi banega , iske hisab se plural hi hoga @ 1:52:00

const app = express();

// MIDDLEWARES
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// arrow funciton for authentication , can be called as many times   , whenver we want come information to be aaccessed by only the logged in users
const isAuthenticated = (req, res , next) => {// calling next(means calling the nexr handler)
  const { token } = req.cookies;
  if (token) {
    // return res.render("logout");
    next() // if token exists go to the next handler , handlesr can be as many , and as many can contain the next(function)
  } else {
    res.render("login");
  }
};


// home page
app.get("/", isAuthenticated ,(req, res) => {// THE HANDLER WILL ONLY WORK IF THE USER IS LOGGED IN ELSE login page will be renders
    res.render("logout") // only login page is displayed until loggedIn

}); 

// login function  
app.post("/login", async(req, res) => {

  const {name , email} = req.body
  const user =await User.create({// user mil jayega for accessing it's properties &&&& User document create ho jayega
    name,
    email,
  })

//   console.log(req.body)
  res.cookie("token", user._id, { // user milega , upload it in database , store access its body and store it's id in cookie and redirect to home page
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

// LOGOUT FUNCTION
app.get("/logout", (req, res) => {
  res.cookie("token", null, { // deleting cookies
    httpOnly: true,                                   
    expires: new Date(Date.now()), // cookie expires when logout
  });

  res.redirect("/");
});

app.listen(83, () => {
  console.log("W O R K I N G ");
});

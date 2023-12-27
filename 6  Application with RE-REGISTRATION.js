const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")

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

const User = mongoose.model("User", userSchema); 

const app = express();

// MIDDLEWARES
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const isAuthenticated = async(req, res , next) => {
  const { token } = req.cookies;
  if (token) {
    const decoded = jwt.verify(token,"sddjfksdfbksdfbkssf") // v e r i f y i n g   t h e   t o k e n .
    // console.log(decoded)
    
    req.user=await User.findById(decoded._id)// storing user information , after getting the user by id
    // user ke ander data milega for accessing,
    // ANY FUNCTION WHICH WILL HAVE ""isAuthenticated"" as it's handler it can access the details of the user by using req.user 
    // for some reason stored in req.user and not const user.
    
    next() 
  } else {
    res.render("login");
  }
};


// home page
app.get("/", isAuthenticated ,(req, res) => {
    // using req.user
    console.log("this is the body")
    console.log(req.user)// likewise we can access the body the the contents of the body by using ,req.user.ELEM_NAME ,it's an obj. with doc. details 
    res.render("logout",{name:req.user.name}) // rendering logout page & sending name to logout page

}); 

// login function  
app.post("/login", async(req, res) => {

  const {name , email} = req.body
  const user =await User.create({// user mil jayega for accessing it's properties &&&& User document create ho jayega
    name,
    email,
  })
  
  // creating token
  const token = jwt.sign({_id:user._id},"sddjfksdfbksdfbkssf")
//   console.log(token)

  res.cookie("token", token , { 
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

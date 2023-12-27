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

const isAuthenticated = (req, res , next) => {
  const { token } = req.cookies;
  if (token) {
    const decoded = jwt.verify(token,"sddjfksdfbksdfbkssf") // v e r i f y i n g   t h e   t o k e n .

    console.log(decoded)

    next() 
  } else {
    res.render("login");
  }
};


// home page
app.get("/", isAuthenticated ,(req, res) => {
    res.render("logout")

}); 

// login function  
app.post("/login", async(req, res) => {// method=post , action="/login"

  const {name , email} = req.body         // d e s t r u c t u r i n g   r e q . b o d y
  const user =await User.create({// user mil jayega for accessing it's properties &&&& User document create ho jayega
    name,               // {name:name , email:email}
    email, // b i n a   u s e r   m e i n   s t o r e   k a r e   b i n a   c h a l   jata , user mein humne us document ki values store kar li hai
  })
  
  // creating token
  const token = jwt.sign({_id:user._id},"sddjfksdfbksdfbkssf") //     ( { a t t r i b u t e : v a l } , k e y ) 
//   console.log(token)

  res.cookie("token", token , { // storing the value of the user 
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

app.listen(82, () => {
  console.log("W O R K I N G ");
});






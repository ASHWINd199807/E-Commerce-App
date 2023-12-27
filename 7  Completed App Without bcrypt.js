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
  password:String,
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

    
    req.user=await User.findById(decoded._id)


    next() 
  } else {
    res.redirect("/login"); // see 2.41.32 
  }                          // redirect by default sirf get pe hoga.........???????/
};


// home page
app.get("/", isAuthenticated ,(req, res) => {// "/" can only be assessed if you are logged in  , so in the "/" you are being directed to the else condition of the isAauthenticaeds

    res.render("logout",{name:req.user.name}) // sending name to logout page
                                              // shuru toh "/" ke ander ke funciton se hi hoga
}); 

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login", async(req,res)=>{
 
   const { email , password } = req.body
 
   let user = await User.findOne( { email }) 

   if (!user) { return res.redirect("./register") } // if email not in database
 
   const  isMatch = user.password===password

   if (!isMatch) { return res.render("login",{email , message:"Incorreect password"})} // if password dosen't match go to login page with incorrect msg.

   // i f   u s e r   e x i s t s  ,  m a k e   t o k e n   a n d   s t o r e   t o k e n   i n   t h e   c o o k i e .
   const token = jwt.sign({_id:user._id},"sddjfksdfbksdfbkssf")


   res.cookie("token", token , { 
     httpOnly: true,
     expires: new Date(Date.now() + 60 * 1000),
   });
   res.redirect("/");

})

app.get("/register",(req, res) => {

   res.render("register")
}); 


// login function  
app.post("/register", async(req, res) => {
  
  const {name , email , password} = req.body
  
  let user = await User.findOne( { email } )

  if (user){
    // return ( console.log("Register First") ) // ONLY console.log()  n o t   e n o u g h   t o   p r e v e n t   i n f i n i t e   s c r o l l i ng
    return res.redirect("/login")  
}

  user =await User.create({// un const ing it 
    name,
    email,
    password,
  })
  
 
  const token = jwt.sign({_id:user._id},"sddjfksdfbksdfbkssf")


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

app.listen(80, () => {
  console.log("W O R K I N G ");
});

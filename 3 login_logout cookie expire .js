const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser= require("cookie-parser")

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

const messageSchema = new mongoose.Schema({
  // CREATING SCHEMA
  name: String,
  email: String,
});  
const Messge = mongoose.model("Message", messageSchema); // collection messages naam se hi banega , iske hisab se plural hi hoga @ 1:52:00

const app = express();
// const users=[]
// MIDDLEWARES
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// app.get("/add", async (req, res) => {
//   res.send("nice");
//   await Messge.create({ name: "Ashwin2", email: "Ash2@mail.com" }).then(() => {
//     res.send("Nice");
//   });
// });

app.get("/", (req, res) => {
//   console.log(req.cookies) // cookie is an object  , can access req.cookies.token
//   console.log(req.cookies.token)

  const {token} = req.cookies // re c i e v  i n g  t o k e n , (syntax as cookie is an object)
//   res.render("login"); res ERROR
  if (token){ // this will only work is the token exiits
     return res.render("logout") // logout page will onlly wppear if the person is logged in 
     // logout will be rendered cookie exists,  delete the cookie manually , logout renderes
    }

  else {
    res.render("login") // login.ejs     file , //action="/login" method="post"
  }
  
}); 

app.post("/login", (req, res) => {
    res.cookie("token", "iamin", {
    httpOnly: true, 
    expires: new Date(Date.now()+60*1000)
});
  res.redirect("/"); // again redirect to the "/ page  , there if logged in logout rendered , if not logout rendered"
}); 

// LOGOUT FUNCTION
app.get("/logout", (req, res) => {//<form action="/logout" method="get">
    res.cookie("token",null,{
        httpOnly:true,
        expires: new Date(Date.now()), // cookie expires when logout 
    })
      
    res.redirect("/")
  }); 



app.get("/success", (req, res) => {
  res.send("success");
})

app.post("/contact", async (req, res) => {
  const { name, email } = req.body;
  await Messge.create({ name: name, email: email }); // need not put the value in commas if the value  is a variable and not an absolute value
});

app.listen(10001, () => {
  console.log("W O R K I N G ");
})

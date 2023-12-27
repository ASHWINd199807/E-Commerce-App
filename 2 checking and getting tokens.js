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

// app.get("/add", async (req, res) => { // is page pe jayenge (get trigger hogi) toh ye document create ho jayega. 
//   res.send("nice");
//   await Messge.create({ name: "Ashwin2", email: "Ash2@mail.com" }).then(() => {
//     res.send("Nice");
//   });
// });

app.get("/", (req, res) => {
  // "/" se page khulta hai ,  kisi site pe redirect hote hain , weisite pe bhi redirect hote hain
  console.log(req.cookies) // cookie is an object  , can access req.cookies.token
  console.log(req.cookies.token)
  res.render("login"); // login.ejs file
  
});

app.post("/login", (req, res) => { // login.ejs file (form) mein method=post , action="/login"
    res.cookie("token", "iamin", {
    httpOnly: true,                         // p r o p e r t i e s   o f   c o o k i e s 
    expires: new Date(Date.now()+60*1000)  // p r o p e r t i e s   o f   c o o k i e s 
});
  res.redirect("/");
}); 
 
// app.get("/success", (req, res) => {
//   res.send("success");
// }); 

app.post("/contact", async (req, res) => {
  const { name, email } = req.body;
  await Messge.create({ name: name, email: email }); // need not put the value in commas if the value  is a variable and not an absolute value
});

app.listen(106, () => {
  console.log("W O R K I N G ");
})

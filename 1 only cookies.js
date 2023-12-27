const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

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
}); // it is basically a structure , we declared is form mein humara document hoga ,
// data is stored in json format in mongoDB

// HUM MODEL BANAYENGE , MODEL IS JUST A FANCY NAME FOR CALLING A COLLECTION
const Messge = mongoose.model("Message", messageSchema); // collection messages naam se hi banega , iske hisab se plural hi hoga @ 1:52:00

const app = express();
// const users=[]

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/add", async (req, res) => {
  res.send("nice");

  // U S I N G       a s y n c   /   a w a i t
  await Messge.create({ name: "Ashwin2", email: "Ash2@mail.com" }).then(() => {
    // F I R S T L Y------------ DATA WILL BE SEND TO DATABASE
    res.send("Nice");
  });
});

app.get("/", (req, res) => {
  // "/" se page khulta hai ,  kisi site pe redirect hote hain , weisite pe bhi redirect hote hain
  res.render("login"); //  login.ejs file
});

app.post("/login", (req, res) => {
  // cookie main kesa bhi deta store kar sakte hain , ex. userid
  // to find ot if user is logged in  , if cookie stored then user logged in
  // cookies banagne padte hain , can also delete by Either expire(perticular DATE) , maxAge(milliseconds) time OR delete after log-out.
  // key vakue pair ke jaise store hoga
  //   res.cookie("token","iamin");
  // expires mein when will  it expire , local storeage ultin manually deleted , session matbel deleted after bwoser closed

  res.cookie("token", "iamin", {
    httpOnly: true, // after this can't access on client side , just to make it more secure
    expires: new Date(Date.now()+60*1000)// today date and time when opened + 1 minute   
});
  res.redirect("/"); // again comes to login page
}); 
 
app.get("/success", (req, res) => {
  res.send("success");
});

app.post("/contact", async (req, res) => {
  // s a m e   k e y   a n d   v a l u e   pa i r . , so can dirsctly pass  ....{ key1 , key2 }....
  const { name, email } = req.body;
  await Messge.create({ name: name, email: email }); // need not put the value in commas if the value  is a variable and not an absolute value
});

app.listen(82, () => {
  console.log("W O R K I N G ");
});

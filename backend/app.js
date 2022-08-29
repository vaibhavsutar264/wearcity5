const express = require("express");
const app = express();
const dotenv = require("dotenv");

const cookieParser = require("cookie-parser");
//now for uploading a file we require body parser and file uploader

const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const errorMiddleware = require("./middleware/error");
const path = require("path")

dotenv.config({path:"backend/config/config.env"});



app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

//Routes import

const product = require("./routes/productRoute"); //this is just a route or a link imported in this app.js file
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
app.use("/api/v1",product);
app.use("/api/v1",user); //user data to be post from frontend
app.use("/api/v1",order);
app.use("/api/v1",payment);
// middleware for errors

//deployment part start

app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*",(req,res)=>{
    //here * means all backend controller url 
   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
});

//deployment part end

app.use(errorMiddleware);

module.exports = app;
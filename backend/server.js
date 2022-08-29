const app = require("./app"); 
//this is imported for taking product api and routes api


const dotenv = require("dotenv"); //this is packgage.json dependencies which is used for connecting config.env file as config.env file cannot be imported through require option

const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database") //this is the databases import 

//handling uncaught exception suppose u write console.log(abc) and it is not defined then server will crash and shows abc is not defined to get away from this error we will see the error in console log and shut down the server

process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to uncaught exception`);
    process.exit(1);
});

//config

dotenv.config({path:"backend/config/config.env"}); //this is used for process.env path location which is stated below

//connecting the databases after dotenv path set

connectDatabase() //here databases is called 

cloudinary.config({

    //for using this cloudinary for uploading images and videos u need to configure it with api key and secret and name
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


// console.log(youtube);


const server = app.listen(process.env.PORT,()=>{

    console.log(`Server is running on http://localhost:${process.env.PORT}`) //this is port on which we will work for backend
})


//unhandled promise rejection


process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`shutting down the pc due to unhandled promise rejection`);

    server.close(()=>{
        process.exit(1);
    });
});






const mongoose = require("mongoose");

// this mongoose is imported is a package for connecting mongodb to your project 

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true}).then((data) => {
        console.log(`Mongodb connected with server : ${data.connection.host}`);
    });
};


// "mongo://localhost:27017/Ecommerce" is saved in config.env for future database cloud server putting changes directly done through config.env

module.exports = connectDatabase
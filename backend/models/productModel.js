const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter Product Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter Product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please enter Product Price"],
        maxLength: [8, "Price characters greater than 8 is not allowed"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter Product category"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter Product Stock"],
        maxLength: [4, "Stock cannot exeeds than 4 digit"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref:"User",
                required: true,
            }, 
            name: {
                type: String,
                required: [true, "Please enter  Product Name in reviews"],

            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type: String,
                required: [true, "Please enter  Product comment in reviews"], 
            }

        }
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required: true,
    }, 
    //here this user section is required because if there are 2 admins then each admin can specify whose admin did this changes
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports= mongoose.model("Product",productSchema);

//now import this in controller
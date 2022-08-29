const Product = require("../models/productModel");

const ErrorHander = require("../utils/errorhander");

const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const ApiFeatures = require("../utils/apifeatures");

const cloudinary = require("cloudinary");

//create product api --admin

exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    let images = [];

    if (typeof req.body.images === "string") {
        // it means the image has only one image as it is a string ecause lots of images have type of as array
        images.push(req.body.images);
        //by images push image upload on cloudinary
    } else {
        images = req.body.images;
    }
    //now there is imageslink also 

    // we will apply a for loop fro each image link

    const imagesLink = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            //here images i means for every image index this loop will be carried out
            folder: "products",
        });

        imagesLink.push({
            //by this images link created and upload on cloudinary
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    // now we need to show the image uploading on cloudinary in frontend so for that below condition is applied

    req.body.images = imagesLink;


    req.body.user = req.user.id //it means that user in a body will be given as id for more details go in usermodel
    // this async function always have a catch error function
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    }) //res.status in json format as stated in arguments is used in postman output on link click 
});

//now import this in routes in productRoutes.js



//get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    // next(new ErrorHander("this ncdjsbchjdscjhsdcjhdsc",500));

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    // now we will find the product with its name as keyword now this product is from productmodel therefore below stated Product.find() is the value of name from product model because in apifeatures the name is written in if we write a keyword in search box and that keyword is finding from product models name 

    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);

    // here new keyword is used because it is a class component

    // here product.find is query and req.query is the queryStr thing which we wants to serach in keyword 
    //req.query which is query str which is linked over apifeature with keyword is the query we put in search box from frontend

    const products = await apiFeature.query; 
    // apiFeature.query = this.query.find({...keyword}); of apifeatures.js
    //here apifeature value is Product.find(),//this Product is taken from product schema of product model.js file

    res.status(200).json(
        {
            success: true,
            products, //this is above stated products variable 
            productsCount,
            resultPerPage,
        } //res.status is used in postman output on link click 
    );
});


//get all products--(Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res) => {

    const products = await Product.find();
    // here Product is from product model and this model have some values in the databases

    res.status(200).json(
        {
            success: true,
            products, //this is above stated products variable 
        } //res.status is used in postman output on link click 
    );
});



// now for getting a single product details by refering the product id 

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);
    // req,params.id is the url for single product and we were accessing the id from that url in frontend
    // const productCount = await Product.countDocuments();


    //if product not found
    if (!product) {
        return next(new ErrorHander("Product Not Found", 404));
        // return res.status(500).json({
        //     success:false,
        //     message:"product not found"

        //here new keyword is given as u can see class component with inheretance require new keyword while using it  and here next is the callback function which calls the class or any function
    }

    // if product is found
    res.status(200).json({
        success: true,
        product,
        // productCount, //this is defined in get all products

    })

});


//update products 

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);
    //here let keyword is used as updating a section will not be a constant value it will change 
    //    here by findById we got product id

    // now if product is not found then
    if (!product) {
        return next(new ErrorHander("Product Not Found", 404));
    }

        //here new keyword is given as u can see class component with inheretance require new keyword while using it  and here next is the callback function which calls the class or any function
    
    let images = [];

    if (typeof req.body.images === "string") {
            // it means the image has only one image as it is a string ecause lots of images have type of as array
        images.push(req.body.images);
            //by images push image upload on cloudinary
    } else {
        images = req.body.images;
    }

    if(images !== undefined){
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
                //here images i means for every image index this loop will be carried out);
        }

        const imagesLink = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            //here images i means for every image index this loop will be carried out
            folder: "products",
        });

        imagesLink.push({
            //by this images link created and upload on cloudinary
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLink;
    
    }
    // and if product is found then
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    //from this we will update a product 

    res.status(200).json({
        success: true,
        product
    }) //res.status is used in postman output on link click 
});


//Delete Products

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHander("Product Not Found", 404));
        //here new keyword is given as u can see class component with inheretance require new keyword while using it  and here next is the callback function which calls the class or any function
    }

    //now we need to delete the images from cloudinary too after deleting the product , the product have image , this image we have uploaded to cloudinary too so after we delete this product this image is not deleted on cloudinary so in oder to delete that we will use below for loop
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
            //here images i means for every image index this loop will be carried out);
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "product deleted successfully"
    })
});

//crete new review or update the review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString())


    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() == req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
        //in this reviews array is made in product model so i that array we will pass our review
    }

    let avg = 0;

    product.reviews.forEach(rev => {
        avg = avg + rev.rating;
    })

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    })
})

// get all reviews of a product 

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})


//Delete Review // Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });



const Order = require("../models/orderModel");

const Product = require("../models/productModel");

const ErrorHander = require("../utils/errorhander");

const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//create new order

exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,

    });

    res.status(201).json({
        success:true,
        order,
    });
});

//get Single order 

exports.getSingleOrder = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id).populate(
         //here populate is used to get the user name and email also by the user id reference to see which person placed the order
        "user",
        "name email"
    );

    if(!order){
        return next(new ErrorHander("order not found with this id",404));
    }

    res.status(200).json({
        success: true,
        order,
    });
}); 

//get logged in orders or myorders

exports.myOrder = catchAsyncErrors(async (req,res,next)=>{
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success:true,
        orders,
    })
})


//get all orders--Admin

exports.getAllOrders = catchAsyncErrors(async (req,res,next)=>{
    const orders = await Order.find();

    //now we will find total amout of ordered products

    let totalAmount = 0;

    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    });



    res.status(200).json({
        success:true,
        orders,
        totalAmount,
    })
})  

//update order status -- Admin

exports.updateOrder = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHander("order not found with this id",404));
    }    

    if(order.orderStatus ==="Delivered"){
        return next(new ErrorHander("You have already delivered this order",400));
    }

    // now orderItems in the database have order quantity which we need to less for updating in stock so that whatever order items is sent should also gives actual stocks of order after every order is delivered means after this order is delivered in stock i quantity of order will less

    if(req.body.status === "Shipped"){
        order.orderItems.forEach(async(order)=>{
            await updateStock(order.product,order.quantity)
        });
        //this function reduces stocks when u order a product
    }

    //updateStock is defined below

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    };

    await order.save({validateBeforeSave:false});


    res.status(200).json({
        success:true,
    })
})  

async function updateStock(id,quantity) {
    const product = await Product.findById(id);

    // product.stock= product.stock - quantity;
    product.stock-=quantity;
    
    await product.save({validateBeforeSave:false});
}



//delete orders--Admin

exports.deleteOrder = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHander("order not found with this id",404));
    }    

    await order.remove();

    res.status(200).json({
        success:true,
    })
})  

// this routes forlder provides you a link for the execution of a code which has been done in controller

const express = require("express");
const { getAllProducts,getAdminProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview } = require("../controllers/productController");
const { isAuthenticatedUser , authorizeRoles } = require("../middleware/auth");

const router = express.Router();
//this is a router which acts as a switch of products crud operation same as in react-router dom admin panel sidnav raouting

router.route("/products").get(getAllProducts); //router is used for routing of crud products
//now this post method and its url is attached to productAction of frontend and it gets linked with frontend also need to set the proxy as localhost:4000 in config file then it will be connected


router.route("/admin/products").get(isAuthenticatedUser,authorizeRoles("admin"),getAdminProducts); //this are same as above but this products are all users products to be shown in admin dashboard  products

router.route("/admin/product/new").post( isAuthenticatedUser,authorizeRoles("admin"), createProduct);
//in above route is authenticated is used for the user because only the user which is logged in can acces the update delete functions

router.route("/admin/product/:id").put( isAuthenticatedUser,authorizeRoles("admin"), updateProduct);

router.route("/admin/product/:id").delete(isAuthenticatedUser,authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put( isAuthenticatedUser, createProductReview);

router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser,deleteReview);



module.exports = router 
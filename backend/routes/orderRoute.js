const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const { newOrder, getSingleOrder, myOrder, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");


router.route("/order/new").post(isAuthenticatedUser, newOrder);
//now this post method and its url is attached to orderAction of frontend and it gets linked with frontend also need to set the proxy as localhost:4000 in config file then it will be connected

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrder);

router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router.route("/admin/order/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);

router.route("/admin/order/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);






module.exports = router;
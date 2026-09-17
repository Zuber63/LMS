const exprees = require("express");
const router = exprees.Router();
const { capturePayment,verifyPayment } = require("../Controllers/payment");
const { auth } = require("../Middlewares/Auth");

router.post("/verifyPayment", auth, verifyPayment);
router.post("/capturePayment", auth, capturePayment);
module.exports = router;
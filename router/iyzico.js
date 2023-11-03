const router = require("express").Router();
const iyzicoController = require("../controller/iyzico");
router.get("/", iyzicoController.payment);
router.post("/", iyzicoController.pay);
router.post("/payFinish", iyzicoController.payFinish);

module.exports = router;

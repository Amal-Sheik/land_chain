const express = require("express");
const router = express.Router();
const {
  registerLand,
  viewLandByWallet
} = require("../controllers/landcontroller");

router.post("/register", registerLand);
router.get("/view/:walletAddress", viewLandByWallet);

module.exports = router;

const express = require("express");

const { allow, protect } = require("../services/auth");

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require("../services/address");

const router = express.Router();

router.use(protect, allow("user"));

router.get("/", getLoggedUserAddresses);
router.post("/", addAddress);
router.delete("/:addressId", removeAddress);

module.exports = router;

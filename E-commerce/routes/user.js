const express = require("express");
const { param, body, validationResult } = require("express-validator");
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  adjustUserImage,
  uploadUserImage,
  changeUserPassword,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deactivateLoggedUser,
} = require("../services/user");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUsersValidator,
  changePasswordValidator,
} = require("../utils/validators/user");

const { protect, allow } = require("../services/auth");
const { getLoggedUser } = require("../services/user");
const router = express.Router();

router.use(protect);

router.get("/get_me", getLoggedUser, getUser);
router.put(
  "/update_my_password",
  changePasswordValidator,
  updateLoggedUserPassword
);
router.put("/update_me", updateUserValidator, updateLoggedUserData);

router.delete("/delete_me", deactivateLoggedUser);

router.use(allow("admin", "manager"));

router.get("/", getUsersValidator, getUsers);

router.get("/:id", getUserValidator, getUser);

router.post(
  "/",
  uploadUserImage,
  adjustUserImage,
  createUserValidator,
  createUser
);

router.put("/change_password/:id", changePasswordValidator, changeUserPassword);

router.put(
  "/:id",
  uploadUserImage,
  adjustUserImage,
  updateUserValidator,
  updateUser
);

router.delete("/:id", deleteUserValidator, deleteUser);

module.exports = router;

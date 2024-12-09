import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser); // Create a new user
router.get("/", getUsers); // Get all users
router.get("/:id", getUserById); // Get a single user by ID
router.put("/:id", updateUser); // Update a user by ID
router.delete("/:id", deleteUser); // Delete a user by ID

export default router;

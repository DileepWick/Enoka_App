import User from "../models/User.js";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const {
      uid,
      email,
      firstName,
      lastName,
      telephone,
      branchId,
      //image,
    } = req.body;

    const newUser = new User({
      user_id: `USER_${Date.now()}`, // Unique user ID
      uid,
      email,
      firstName,
      lastName,
      telephone,
      branchId,
    //   image,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the user",
      error: error.message,
    });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("branchId"); // Populates branch details
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching users",
      error: error.message,
    });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;  // Extract id from req.params
    console.log(id);
    const user = await User.findOne({ uid: id }).populate("branchId");  // Use the id to search for the user by uid

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user by UID:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the user",
      error: error.message,
    });
  }
};


// Update a user by ID
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true, // Returns the updated document
    });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the user",
      error: error.message,
    });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the user",
      error: error.message,
    });
  }
};

// Change user active status
export const toggleUserActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.active = user.active === "0" ? "1" : "0";
    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating user status",
    });
  }
};

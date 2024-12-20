import mongoose from "mongoose";
import CashBillItem from "../models/CashBillItem.js";
import CashBill from "../models/CashBill.js";

// Controller to get all CashBillItems for a specific CashBill
export const getAllCashBillItems = async (req, res) => {
  try {
    const { cashBillId } = req.params;

    const cashBillItems = await CashBillItem.find({
      cashBill: cashBillId,
    }).populate("stock");

    if (!cashBillItems || cashBillItems.length === 0) {
      return res
        .status(404)
        .json({ message: "No items found for this CashBill" });
    }

    res.status(200).json(cashBillItems);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching CashBillItems", error: error.message });
  }
};

// Controller to update quantity, unitPrice, and discount of a CashBillItem
export const updateCashBillItem = async (req, res) => {
  try {
    const { cashBillItemId } = req.params;
    const { quantity, unitPrice, discount } = req.body;

    // Find and update the CashBillItem
    const cashBillItem = await CashBillItem.findById(cashBillItemId);

    if (!cashBillItem) {
      return res.status(404).json({ message: "CashBillItem not found" });
    }

    // Update the fields
    cashBillItem.quantity = quantity;
    cashBillItem.unitPrice = unitPrice;
    cashBillItem.discount = discount;

    // Recalculate total based on the new data
    cashBillItem.total = (unitPrice - discount) * quantity;

    // Save the updated CashBillItem
    await cashBillItem.save();

    res.status(200).json(cashBillItem);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating CashBillItem", error: error.message });
  }
};

// Controller to create a CashBillItem for a CashBill
export const createCashBillItem = async (req, res) => {
  try {
    // Extract the required fields from request body
    const { stockId, unitPrice, discount, quantity } = req.body;

    // Find the latest pending CashBill
    const latestPendingCashBill = await CashBill.findOne({ status: "Pending" })
      .sort({ createdDate: -1 }); // Sort by createdDate to get the latest one

    if (!latestPendingCashBill) {
      return res.status(404).json({ message: "No pending CashBill found." });
    }

    // Create a new CashBillItem for the found CashBill
    const newCashBillItem = new CashBillItem({
      cashBill: latestPendingCashBill._id, // Reference to the latest pending CashBill
      stock: stockId, // Stock ID (from request body)
      unitPrice,
      discount,
      quantity,
      total: (unitPrice - discount) * quantity, // Calculate total
    });

    // Save the new CashBillItem
    await newCashBillItem.save();

    // Return the created CashBillItem
    res.status(201).json(newCashBillItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating CashBillItem",
      error: error.message,
    });
  }
};

// Controller to delete a specific CashBillItem
export const deleteCashBillItem = async (req, res) => {
  try {
    const { cashBillItemId } = req.params;

    // Find and delete the CashBillItem
    const cashBillItem = await CashBillItem.findByIdAndDelete(cashBillItemId);

    if (!cashBillItem) {
      return res.status(404).json({ message: "CashBillItem not found" });
    }

    res.status(200).json({ message: "CashBillItem deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting CashBillItem", error: error.message });
  }
};

// Controller to return a single CashBillItem by ID and change its status to "Returned"
export const returnCashBillItem = async (req, res) => {
  try {
    const { cashBillItemId } = req.params;

    // Find the CashBillItem by ID
    const cashBillItem = await CashBillItem.findById(cashBillItemId);

    if (!cashBillItem) {
      return res.status(404).json({ message: "CashBillItem not found" });
    }

    // Change the status to "Returned"
    cashBillItem.status = "Returned";

    // Save the updated CashBillItem
    await cashBillItem.save();

    res
      .status(200)
      .json({
        message: "CashBillItem status updated to 'Returned'",
        cashBillItem,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error updating CashBillItem status",
        error: error.message,
      });
  }
};

import mongoose from "mongoose";
import CashBillItem from "../models/CashBillItem.js";
import CashBill from "../models/CashBill.js";
import Stock from "../models/Stock.js";

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


// Controller to update quantity, unitPrice, and discount of a CashBillItem and update stock accordingly
export const updateCashBillItem = async (req, res) => {
  try {
    const { cashBillItemId } = req.params;
    const { quantity, unitPrice, discount } = req.body;

    // Find and update the CashBillItem
    const cashBillItem = await CashBillItem.findById(cashBillItemId);

    if (!cashBillItem) {
      return res.status(404).json({ message: "CashBillItem not found" });
    }

    // Get the stock ID of the current CashBillItem
    const stockId = cashBillItem.stock;

    // Calculate the difference in quantity
    const quantityDifference = quantity - cashBillItem.quantity;

    // Update the CashBillItem fields
    cashBillItem.quantity = quantity;
    cashBillItem.unitPrice = unitPrice;
    cashBillItem.discount = discount;

    // Recalculate total based on the new data
    cashBillItem.total = (unitPrice - discount) * quantity;

    // Save the updated CashBillItem
    await cashBillItem.save();

    let updatedStock = null; // Define updatedStock outside the if block

    // Update the stock quantity based on the difference
    if (quantityDifference !== 0) {
      updatedStock = await Stock.findByIdAndUpdate(
        stockId,
        {
          $inc: { quantity: -quantityDifference }, // Decrease or increase stock quantity based on difference
        },
        { new: true } // Return the updated stock
      );

      if (!updatedStock) {
        return res.status(404).json({ message: "Stock not found" });
      }
    }

    // Return the updated CashBillItem and updated stock (if changed)
    res.status(200).json({
      message: "CashBillItem updated successfully",
      data: {
        cashBillItem,
        updatedStock, // This will be null if stock was not updated
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating CashBillItem and stock",
      error: error.message,
    });
  }
};

// Controller to create a new CashBillItem
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

    // Check if the stock has already been added to the current CashBill
    const existingItem = await CashBillItem.findOne({
      cashBill: latestPendingCashBill._id,
      stock: stockId,
    });

    if (existingItem) {
      return res.status(400).json({ message: "Item already in the list." });
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

    // Decrease the stock quantity
    const updatedStock = await Stock.findByIdAndUpdate(
      stockId,
      {
        $inc: { quantity: -quantity }, // Decrease stock quantity
      },
      { new: true } // Return the updated document
    );

    // Check if stock was found and updated
    if (!updatedStock) {
      return res.status(404).json({ error: "Stock not found." });
    }

    // Return the created CashBillItem and updated stock details
    res.status(201).json({
      message: "CashBillItem created and stock quantity updated.",
      cashBillItem: newCashBillItem,
      updatedStock,
    });
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

    // Find the CashBillItem to be deleted
    const cashBillItem = await CashBillItem.findById(cashBillItemId);

    if (!cashBillItem) {
      return res.status(404).json({ message: "CashBillItem not found" });
    }

    // Find the stock associated with the CashBillItem
    const stockId = cashBillItem.stock;
    const quantityToRestore = cashBillItem.quantity;

    // Delete the CashBillItem
    await CashBillItem.findByIdAndDelete(cashBillItemId);

    // Increase the stock quantity for the deleted item
    const updatedStock = await Stock.findByIdAndUpdate(
      stockId,
      {
        $inc: { quantity: quantityToRestore }, // Increase stock quantity
      },
      { new: true } // Return the updated document
    );

    // Check if the stock was found and updated
    if (!updatedStock) {
      return res.status(404).json({ error: "Stock not found" });
    }

    res.status(200).json({
      message: "CashBillItem deleted successfully and stock quantity updated.",
      updatedStock,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting CashBillItem",
      error: error.message,
    });
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

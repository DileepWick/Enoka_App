import CashBill from "../models/CashBill.js";
import CashBillItem from "../models/CashBillItem.js";

// Controller to create a new CashBill (without items initially)
export const createCashBill = async (req, res) => {
    try {
      const { billType, status } = req.body;
  
      // Create the CashBill instance without any items
      const newCashBill = new CashBill({
        billType,
        status,
      });
  
      // Save the new CashBill
      await newCashBill.save();
  
      res.status(201).json({
        message: "CashBill created successfully",
        cashBill: newCashBill,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating CashBill", error: error.message });
    }
  };

// Controller to delete a CashBill by its ID
export const deleteCashBill = async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters

  try {
    const cashBill = await CashBill.findByIdAndDelete(id);

    if (!cashBill) {
      return res.status(404).json({ message: "CashBill not found" });
    }

    res.status(200).json({ message: "CashBill deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting CashBill", error: error.message });
  }
};

// Controller to get the latest pending CashBill
export const getLatestPendingCashBill = async (req, res) => {
    try {
      // Find the latest CashBill with status "Pending"
      const latestPendingCashBill = await CashBill.findOne({ status: "Pending" })
        .sort({ createdDate: -1 }); // Sort by createdDate in descending order to get the latest one
  
      // If no pending CashBill is found
      if (!latestPendingCashBill) {
        return res.status(404).json({ message: "No pending CashBill found" });
      }
  
      // Find all CashBillItems associated with the latest pending CashBill
      const cashBillItems = await CashBillItem.find({ cashBill: latestPendingCashBill._id });
  
      // Return the CashBill along with its CashBillItems
      res.status(200).json({
        cashBill: latestPendingCashBill,
        cashBillItems: cashBillItems,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error retrieving latest pending CashBill",
        error: error.message,
      });
    }
  };
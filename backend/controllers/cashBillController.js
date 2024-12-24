import CashBill from "../models/CashBill.js";
import CashBillItem from "../models/CashBillItem.js";
import Gasket from "../models/Gasket.js";
import Ring from "../models/Ring.js";
import { deleteCashBillItem } from "./cash_bill_item_controller.js";

// Controller to create a new CashBill (without items initially)
export const createCashBill = async (req, res) => {
  const { billType } = req.body;
  try {
    // Fetch the latest CashBill to get the last invoice number
    const latestCashBill = await CashBill.findOne().sort({ createdDate: -1 }); // Sort by createdDate to get the latest

    let invoiceNumber = "CSH0000001"; // Default value if no CashBill exists

    if (latestCashBill) {
      // Ensure latestCashBill.invoiceNumber exists
      const lastInvoiceNumber = latestCashBill.invoiceNumber
        ? parseInt(latestCashBill.invoiceNumber.slice(3))
        : 0;
      invoiceNumber = `CSH${String(lastInvoiceNumber + 1).padStart(7, "0")}`; // Increment and pad to 7 digits
    }

    // Create a new CashBill with the generated invoice number
    const newCashBill = new CashBill({
      status: "Pending", // or based on your requirements
      billType, // or based on your requirements
      invoiceNumber: invoiceNumber, // Set the generated invoice number
    });

    // Save the new CashBill document
    const savedCashBill = await newCashBill.save();

    // Return the saved CashBill as the response
    res.status(201).json(savedCashBill);
  } catch (error) {
    console.error("Error creating CashBill:", error);
    res
      .status(500)
      .json({ message: "Error creating CashBill", error: error.message });
  }
};

// Controller to delete a CashBill by its ID
export const deleteCashBill = async (req, res) => {
  const { id } = req.params; // Get the CashBill ID from the request parameters

  try {
    // Step 1: Find the CashBill by its ID
    const cashBill = await CashBill.findById(id);

    if (!cashBill) {
      return res.status(404).json({ message: "CashBill not found" });
    }

    // Step 2: Find all associated CashBillItems using the CashBill ID
    const cashBillItems = await CashBillItem.find({ cashBill: id });

    // Step 3: Delete each CashBillItem and update their stocks
    for (const cashBillItem of cashBillItems) {
      // Reuse deleteCashBillItem logic by simulating a request
      const fakeReq = { params: { cashBillItemId: cashBillItem._id } }; // Simulated request object
      const fakeRes = {
        status: () => ({
          json: () => {}, // No actual response needed here
        }),
      };
      await deleteCashBillItem(fakeReq, fakeRes); // Call the controller for each CashBillItem
    }

    // Step 4: Delete the CashBill itself
    await CashBill.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "CashBill and associated items deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting CashBill", error: error.message });
  }
};

// Controller to get the latest pending CashBill
export const getLatestPendingCashBill = async (req, res) => {
  try {
    // Find the latest CashBill with status "Pending"
    const latestPendingCashBill = await CashBill.findOne({
      status: "Pending",
    }).sort({ createdDate: -1 });

    // If no pending CashBill is found
    if (!latestPendingCashBill) {
      return res.status(404).json({ message: "No pending CashBill found" });
    }

    // Find all CashBillItems associated with the latest pending CashBill and populate the stock field
    const cashBillItems = await CashBillItem.find({
      cashBill: latestPendingCashBill._id,
    }).populate("stock");

    // Manually populate the item field within the stock for each CashBillItem
    const populatedCashBillItems = await Promise.all(
      cashBillItems.map(async (cashBillItem) => {
        if (cashBillItem.stock) {
          let populatedItem = null;

          // Dynamically populate the item field based on the itemModel
          if (cashBillItem.stock.itemModel === "Gasket") {
            populatedItem = await Gasket.findById(cashBillItem.stock.item)
              .populate("brand")
              .populate("vendor")
              .populate("engine");
          } else if (cashBillItem.stock.itemModel === "Ring") {
            populatedItem = await Ring.findById(cashBillItem.stock.item)
              .populate("vendor")
              .populate("engine");
          }

          // Return the updated CashBillItem with populated stock and item
          return {
            ...cashBillItem.toObject(),
            stock: {
              ...cashBillItem.stock.toObject(),
              item: populatedItem,
            },
          };
        }
        return cashBillItem.toObject(); // Return as-is if no stock is present
      })
    );

    // Return the CashBill along with its populated CashBillItems
    res.status(200).json({
      cashBill: latestPendingCashBill,
      cashBillItems: populatedCashBillItems,
    });
  } catch (error) {
    console.error("Error retrieving latest pending CashBill:", error);
    res.status(500).json({
      message: "Error retrieving latest pending CashBill",
      error: error.message,
    });
  }
};

// Controller to update the status of the latest pending CashBill
const updateCashBillStatus = async (req, res) => {
  try {
    // Find the latest cash bill with status 'Pending'
    const pendingCashBill = await CashBill.findOne({ status: "Pending" })
      .sort({ createdAt: -1 }) // Sort by creation date in descending order to get the latest
      .exec();

    if (!pendingCashBill) {
      return res.status(404).json({ error: "No pending cash bills found" });
    }

    // Update the status of the latest pending cash bill to "Completed"
    const updatedCashBill = await CashBill.findByIdAndUpdate(
      pendingCashBill._id,
      { status: "Completed" },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Cash bill status updated successfully",
      updatedCashBill,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while updating status" });
  }
};

export { updateCashBillStatus };

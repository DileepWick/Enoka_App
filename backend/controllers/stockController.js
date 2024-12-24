import Stock from "../models/Stock.js";
import Gasket from "../models/Gasket.js";
import Ring from "../models/Ring.js";



// Update stock quantity
export const updateStockQuantity = async (req, res) => {
  const { stockId } = req.params; // Get the stock ID from the route parameter
  const { quantity, updatedBy } = req.body; // Get the new quantity and updater's name from the request body

  try {
    // Validate input
    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: "Invalid quantity value." });
    }

    // Find and update the stock
    const updatedStock = await Stock.findByIdAndUpdate(
      stockId,
      {
        quantity,
        updated_by: updatedBy || "Unknown",
        latest_update_date: Date.now(),
      },
      { new: true } // Return the updated document
    );

    // Check if stock was found and updated
    if (!updatedStock) {
      return res.status(404).json({ error: "Stock not found." });
    }

    return res.status(200).json({
      message: "Stock quantity updated successfully.",
      data: updatedStock,
    });
  } catch (error) {
    console.error("Error updating stock quantity:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Increase stock quantity
export const increaseStockQuantity = async (req, res) => {
  const { stockId } = req.params; // Get the stock ID from the route parameter
  const { quantity } = req.body; // Get the new quantity

  try {
    // Validate input
    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: "Invalid quantity value." });
    }

    // Find and update the stock
    const updatedStock = await Stock.findByIdAndUpdate(
      stockId,
      {
        $inc: { quantity: quantity },
      },
      { new: true } // Return the updated document
    );

    // Check if stock was found and updated
    if (!updatedStock) {
      return res.status(404).json({ error: "Stock not found." });
    }

    return res.status(200).json({
      message: "Stock quantity updated successfully.",
      data: updatedStock,
    });
  } catch (error) {
    console.error("Error updating stock quantity:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

//Decrease stock quantity
export const decreaseStockQuantity = async (req, res) => {
  const { stockId } = req.params; // Get the stock ID from the route parameter
  const { quantity } = req.body; // Get the new quantity

  try {
    // Validate input
    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: "Invalid quantity value." });
    }

    // Find and update the stock
    const updatedStock = await Stock.findByIdAndUpdate(
      stockId,
      {
        $inc: { quantity: -quantity },
      },
      { new: true } // Return the updated document
    );

    // Check if stock was found and updated
    if (!updatedStock) {
      return res.status(404).json({ error: "Stock not found." });
    }

    return res.status(200).json({
      message: "Stock quantity updated successfully.",
      data: updatedStock,
    });
  } catch (error) {
    console.error("Error updating stock quantity:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Get all stocks and populate references based on itemModel
export const getAllStocks = async (req, res) => {
  try {
    // Fetch all stocks and populate the branch
    const stocks = await Stock.find().populate('branch');

    if (!stocks.length) {
      return res.status(404).json({ message: 'No stocks found.' });
    }

    // Manually populate the item field based on itemModel
    const populatedStocks = await Promise.all(stocks.map(async (stock) => {
      let item = null;

      if (stock.itemModel === 'Gasket') {
        // For Gasket, populate the fields
        item = await Gasket.findById(stock.item).populate('brand').populate('vendor').populate('engine');
      } else if (stock.itemModel === 'Ring') {
        // For Ring, populate the fields
        item = await Ring.findById(stock.item).populate('brand').populate('engine');
      }

      // Return a new object with populated item (for Gasket) and its fields
      return {
        ...stock.toObject(),
        item: item
      };
    }));

    // Return the populated stocks data
    res.status(200).json(populatedStocks);
  } catch (err) {
    // Log error details for debugging
    console.error('Error retrieving stocks:', err);

    // Respond with a 500 status code and a descriptive error message
    res.status(500).json({
      message: 'An error occurred while fetching stocks.',
      error: err.message,
    });
  }
};


// Get all stocks for Gasket only and populate references based on itemModel
export const getAllStocksForGasket = async (req, res) => {
  try {
    // Fetch all stocks for Gasket only and populate the branch
    const stocks = await Stock.find({ itemModel: 'Gasket' }).populate('branch');

    if (!stocks.length) {
      return res.status(404).json({ message: 'No gasket stocks found.' });
    }

    // Manually populate the item field based on itemModel
    const populatedStocks = await Promise.all(stocks.map(async (stock) => {
      // For Gasket, populate the fields
      const item = await Gasket.findById(stock.item)
        .populate('brand')
        .populate('vendor')
        .populate('engine');

      // Return a new object with populated item (Gasket) and its fields
      return {
        ...stock.toObject(),
        item: item
      };
    }));

    // Return the populated stocks data
    res.status(200).json(populatedStocks);
  } catch (err) {
    // Log error details for debugging
    console.error('Error retrieving gasket stocks:', err);

    // Respond with a 500 status code and a descriptive error message
    res.status(500).json({
      message: 'An error occurred while fetching gasket stocks.',
      error: err.message,
    });
  }
};

//Get all stocks for Ring only and populate references based on itemModel
export const getAllStocksForRing = async (req, res) => {
  try {
    // Fetch all stocks for Ring only and populate the branch
    const stocks = await Stock.find({ itemModel: 'Ring' }).populate('branch');

    if (!stocks.length) {
      return res.status(404).json({ message: 'No ring stocks found.' });
    }

    // Manually populate the item field based on itemModel
    const populatedStocks = await Promise.all(stocks.map(async (stock) => {
      // For Ring, populate the fields
      const item = await Ring.findById(stock.item)
        .populate('vendor')
        .populate('engine');

      // Return a new object with populated item (Ring) and its fields
      return {
        ...stock.toObject(),
        item: item
      };
    }));

    // Return the populated stocks data
    res.status(200).json(populatedStocks);
  } catch (err) {
    // Log error details for debugging
    console.error('Error retrieving ring stocks:', err);

    // Respond with a 500 status code and a descriptive error message
    res.status(500).json({
      message: 'An error occurred while fetching ring stocks.',
      error: err.message,
    });
  }
};

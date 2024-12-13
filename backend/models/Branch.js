import mongoose from "mongoose";

//Branch schema
const BranchSchema = new mongoose.Schema({
    branch_id: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate branch_id
        validate: {
            validator: async function (value) {
                const count = await mongoose.models.Branch.countDocuments({ branch_id: value });
                return count === 0; // Returns false if a duplicate branch_id exists
            },
            message: "branch_id must be unique",
        },
    },
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        default: "Not specified", // Default location if none is provided
    },
    created_at: {
        type: Date,
        default: Date.now, // Automatically sets the creation date
    },
});

const Branch = mongoose.model("Branch", BranchSchema);

export default Branch;

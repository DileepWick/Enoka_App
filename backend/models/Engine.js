import mongoose from "mongoose";

const EngineSchema = new mongoose.Schema(
  {
    engine_id: { type: String, required: true, unique: true },
    engine_name: { type: String, required: true, unique: true },
  },
  {
    collation: { locale: "en", strength: 2 }, // Ensures case-insensitive uniqueness
  }
);

// Pre-save hook to convert all letters to uppercase
EngineSchema.pre("save", function (next) {
  if (this.engine_name) {
    this.engine_name = this.engine_name.toUpperCase(); // Convert to uppercase
  }
  next();
});

const Engine = mongoose.model("Engine", EngineSchema);

export default Engine;

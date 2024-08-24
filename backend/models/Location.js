import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32,
  },
  district: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32,
  },
});

export default mongoose.model("Location", locationSchema);

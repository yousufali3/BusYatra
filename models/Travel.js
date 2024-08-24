import mongoose from "mongoose";

const travelSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32,
  },
});

export default mongoose.model("Travel", travelSchema);

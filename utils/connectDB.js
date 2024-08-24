import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
    console.log("MongoDB database connected ");
  } catch (error) {
    console.error("Error while connecting database " + error.message);
  }
};

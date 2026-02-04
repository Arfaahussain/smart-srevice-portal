import mongoose from "mongoose";

const connectDB = async () => {

  try {

    await mongoose.connect("mongodb://127.0.0.1:27017/smart_portal");

    console.log("MongoDB Connected Successfully");

  } catch (err) {

    console.log("DB Connection Error");
    console.log(err);

  }
};

export default connectDB;

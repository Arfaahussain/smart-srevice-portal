import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({

  title: String,
  category: String,
  description: String,
  priority: String,

  requesterName: String,
  requesterEmail: String,

  status: {
    type: String,
    default: "Open"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Request", RequestSchema);

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const LogSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Log", LogSchema);

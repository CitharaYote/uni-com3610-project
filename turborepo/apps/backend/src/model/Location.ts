import mongoose from "mongoose";
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  // Define schema here
});

export default mongoose.model("Location", LocationSchema);

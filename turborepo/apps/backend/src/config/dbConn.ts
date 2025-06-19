import mongoose, { ConnectOptions } from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_ENDPOINT}/?retryWrites=true&w=majority&appName=${process.env.MONGODB_APPNAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;

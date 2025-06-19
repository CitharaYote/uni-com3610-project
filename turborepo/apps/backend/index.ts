import "dotenv/config";
import mongoose, { ConnectOptions } from "mongoose";
import app from "./src/libs/app";

// app.get("/", (req, res) => res.send("It works!"));

// if (import.meta.env.PROD) app.listen(3000);

// export const viteNodeApp = app;

(async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_ENDPOINT}/?retryWrites=true&w=majority&appName=${process.env.MONGODB_APPNAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions
  );

  await app.listen(process.env.BACKEND_PORT);

  console.log(`Server is running on port ${process.env.BACKEND_PORT}`); //test
})();

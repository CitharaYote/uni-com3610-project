// import * as bodyParser from "body-parser";

// import express from "express";
// import cors from "cors";

// const app = express();
// const credentials = require("../middleware/credentials");

// app.use(credentials);

// app.use(
//   bodyParser.urlencoded({
//     parameterLimit: 100000,
//     limit: "1gb",
//     extended: true,
//   }),
//   bodyParser.json({ limit: "1gb", type: "application/json" }),

//   cors({
//     origin: "*",
//     methods: "GET,POST,PUT,PATCH,DELETE",
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//   })
// );

// app.get("/", (req, res) => res.send("It works!"));

// export default app;

require("dotenv").config();
import express from "express";
const app = express();
import path from "path";
import cors from "cors";
import corsOptions from "../config/corsOptions";
import { logger } from "../middleware/logEvents";
import errorHandler from "../middleware/errorHandler";
import verifyJWT from "../middleware/verifyJWT";
import cookieParser from "cookie-parser";
import credentials from "../middleware/credentials";
import mongoose from "mongoose";
import connectDB from "../config/dbConn";
import ngrok from "@ngrok/ngrok";
const PORT = process.env.BACKEND_PORT!;

// routes
import root from "../routes/root";
import register from "../routes/register";
import auth from "../routes/auth";
import refresh from "../routes/refresh";
import logout from "../routes/logout";
import employees from "../routes/api/employees";
import users from "../routes/api/users";
import me from "../routes/api/me";
import application from "../routes/users/application";

// public routes
import job from "../routes/public/jobPosting";

// staff routes
import job_staff from "../routes/api/jobPostingStaff";

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
// app.use("/", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", root);
app.use("/register", register);
app.use("/auth", auth);
app.use("/refresh", refresh);
app.use("/logout", logout);

// public routes
app.use("/listings", job);

app.use(verifyJWT);
app.use("/employees", employees);
app.use("/users", users);
app.use("/me", me);
app.use("/applications", application);

// staff routes
app.use("/staff/listings", job_staff);

app.all("*", (req: any, res: any) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// (async function () {
//   // Establish connectivity
//   const listener = await ngrok.forward({
//     addr: 3000,
//     authtoken_from_env: true,
//   });

//   // Output ngrok url to console
//   console.log(`Ingress established at: ${listener.url()}`);
// })();

export default app;

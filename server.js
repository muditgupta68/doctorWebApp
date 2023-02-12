const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnect = require("./db");
var cookieParser = require('cookie-parser')
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// routes
const UserRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");


// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(morgan("dev"));

// applying routes
app.use("/api/v1/user",UserRouter);
app.use("/api/v1/admin",adminRouter);

//server call
const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`> Server setup success @${port}`.bgGreen.black);
    });
    dbConnect();
  } catch (error) {
    console.log(`> Unable setup server @${port}`.bgRed.black);
  }
};
start();

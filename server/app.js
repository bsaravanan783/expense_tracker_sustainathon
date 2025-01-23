const express = require("express");
const userRouter = require("./routes/user");
const { userAuth } = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
const userGroupRouter = require("./routes/userGroup");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
app.use(cookieParser());

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/userGroup",userGroupRouter);
app.listen(port, (req, res) => {
  console.log(`server running on port ${port}`);
});

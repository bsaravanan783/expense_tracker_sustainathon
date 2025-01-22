const express = require("express");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/userGroup", userRouter);
app.use("/api/auth", authRouter);


app.listen(port, (req, res) => {
  console.log(`server running on port ${port}`);
});

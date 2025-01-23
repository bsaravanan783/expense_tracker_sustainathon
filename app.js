const express = require("express");
const userRouter = require("./routes/user");
const { userAuth } = require("./middlewares/auth");
const expenseRouter = require("./routes/expenses");
const app = express();
const port = 3000;
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/expenses", expenseRouter);
app.listen(port, (req, res) => {
  console.log(`server running on port ${port}`);
});


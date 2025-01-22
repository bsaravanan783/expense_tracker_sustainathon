const express = require("express");
const userRouter = require("./routes/user");
const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/userGroup", userRouter);

app.listen(port, (req, res) => {
  console.log(`server running on port ${port}`);
});

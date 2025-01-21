const express = require("express");
const userGroupRouter = require("./routes/userGroups");
const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/userGroup",userGroupRouter)



app.listen(port,(req,res)=>{
    console.log(`server running on port ${port}`);
});

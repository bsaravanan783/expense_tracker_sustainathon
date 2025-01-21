const express = require("express");
const app = express();
const port = 3000;




app.listen(port,(req,res)=>{
    console.log(`server running on port ${port}`);
});

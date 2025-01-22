const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { connect } = require("http2");

const prisma = new PrismaClient();

userRouter.post("/createUserGroup", async (req, res) => {
  const { userId, groupId } = req.body;
  if (!userId || !groupId) {
    throw new Error("Cannot create usergroup midding Ids");
  }

  try {
    console.log("g");
    const userGroup = await prisma.usersGroups.create({
      data: {
        userId,
        groupId,
      },
    });
    console.log(userGroup, "createdUsergroup");
    return res.status(200).json({ data: userGroup });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRouter.post("/createGroup", async (req, res) => {
  try {
    // const {groupName , s}
    console.log("fsk");
    // to be continued
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Log request data
    console.log("Request Data:", username, email);

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const user_signup = await prisma.users.create({
      data: {
        username,
        email,
        password: hashPassword,
        name,
      },
    });

    // Send success response
    res.status(200).json({
      message: "User created successfully",
      user: user_signup,
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

userRouter.post("/savings",async(req,res)=>{
  try {
    const {username,amount,description} = req.body;
    console.log(username,amount,description);
    

    if(!username || !amount || !description){
      return res.status(400).json({error:"username, amount, and type are required"});
    }
    const createSavings= await prisma.saving.create({
        data:{
            amount:parseInt(amount),
          
            description,
            users:{
            connect:{
                username,
            },
            },
        },
        });
        console.log(createSavings);
        
  
  } catch (err) {
    console.error("Error stack trace:", err.stack);
    res.status(500).json({ error: err.message });
  }




})



userRouter.put("/savings_update/:id",async(req,res)=>{
  try{
  console.log("verified and move to put ");
  const {id}=req.params
  const savingsId = req.params.id;
  console.log(typeof(req.params.id));
  const {description,username,amount}=req.body
  const savings= await prisma.saving.findUnique({
    where: {
      id: savingsId,
      users: {
        connect: {
          username:username,
        },
       
      },

    },


  })
  console.log(todo,"line no 207");
    
  if(!todo){
    throw new Error("Todo not found or not authorized to update");
  }
  const updatedSavings = await prisma.saving.update({
    where: { id: savingsId },
    data: { description,amount },
  }); 
  
  console.log(updatedSavings,"updated todo ");
  

  res.json(updatedTodo);
}
catch (err) {
  res.status(500).json({ error: err.message });

}


})







module.exports = userRouter;




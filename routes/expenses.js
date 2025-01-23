const express = require("express");
const { PrismaClient } = require("@prisma/client");
const validator = require('validator');
const exp = require("constants");
const { useLayoutEffect } = require("react");
const { connect } = require("http2");
const prisma = new PrismaClient();
const expenseRouter = express.Router();




expenseRouter.post("/create_expense",async (req,res)=>{
    const{amount,description}= req.body
    const category =["Food,Clothing,Transportation,Healthcare,Entertainment,Education,Utilities,Insurance,Personal Care,Other"]
    const userId="6cf9e233-e757-4239-8179-f7a4d6c55b0d"
    console.log(req.body);
    if(!userId || !amount || !description || !category){
        return res.status(400).json({message:"Please enter all the fields"})
    }
    try{
      console.log("entered try block");
      console.log(req.body.description,req.body.amount,req.body.category,userId);
      
      const expense = await prisma.expenses.create({
        data: {
          userId: userId, // Link the expense to the user
          amount: req.body.amount,
          description: req.body.description,
          category: {
            create: {
              category_name: req.body.category, // Create a new category
              
            },
            users:{
              connect:{
                users:userId
              }
            }
              
          },
          users: {
            connect: {
              id: userId, // Link the expense to the user
            },
          },
        },
      });      
      
        
            

      
          console.log("expense",expense);
        res.status(200).json({ data: expense });
          

    }catch(error){
        res.status(500).json({ error: error.message });
    }
    
})
module.exports = expenseRouter;
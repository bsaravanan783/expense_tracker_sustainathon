const express = require("express");
const createUserRouter = express.Router();
const app = express();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

app.use(express.json());

// Middleware to parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));




createUserRouter.post("/signup", async (req, res) => {
    try {
      const { username, email, password,name } = req.body;
  
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
          name
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
  


  module.exports = createUserRouter;
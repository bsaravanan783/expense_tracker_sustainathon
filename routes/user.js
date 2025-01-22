const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

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

module.exports = userRouter;

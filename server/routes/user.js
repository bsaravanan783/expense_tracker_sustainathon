const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const validator = require("validator");
const { PrismaClient } = require("@prisma/client");
const { userAuth } = require("../middlewares/auth");
const prisma = new PrismaClient();

// userRouter.post("/createUserGroup", async (req, res) => {
//   const { userId, groupId } = req.body;
//   if (!userId || !groupId) {
//     throw new Error("Cannot create usergroup midding Ids");
//   }

//   try {
//     console.log("g");
//     const userGroup = await prisma.usersGroups.create({
//       data: {
//         userId,
//         groupId,
//       },
//     });
//     console.log(userGroup, "createdUsergroup");
//     return res.status(200).json({ data: userGroup });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

userRouter.get("/protected-route", userAuth, async (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

userRouter.post("/createUser", async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("invalid credentials ");
    }
    console.log("Request Data:", username, email);

    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword, "hash");
    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        password: hashPassword,
        name,
      },
    });
    console.log(newUser);
    res.status(200).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    console.log(emailId);
    const user = await prisma.users.findFirst({
      where: {
        email: emailId,
      },
    });
    const hashedPassword = user.password;
    const isValidUser = await bcrypt.compare(password, hashedPassword);
    console.log(isValidUser, "valididity");
    console.log(user, "ssd");
    const secret = process.env.JWT_SECRET;
    if (isValidUser) {
      const userId = user.username;
      const token = await jwt.sign({ userId: userId }, secret, {
        expiresIn: "1d",
      });
      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 3600000),
      });
      res.status(200).json({ message: "User loggeed in Successfully" });
    } else {
      throw Error("Invalid credentials");
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

userRouter.get("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message : "Logged out successfully"});
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// for mee
userRouter.get("/getAllUsers", async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    console.log(users);
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = userRouter;

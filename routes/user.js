const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
<<<<<<< HEAD
=======
const { rootCertificates } = require("tls");
const { error } = require("console");
const { configDotenv } = require("dotenv");
>>>>>>> 22e37b4 (added crud for userGroups)
const { connect } = require("http2");

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

userRouter.post("/signup", async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("invalid credentials ");
    }
    console.log("Request Data:", username, email);

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
    console.log(user_signup);
    res.status(200).json({
      message: "User created successfully",
      user: user_signup,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

userRouter.get("/getAllUsers", async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    console.log(users);
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// userGroup routes


userRouter.post("/createGroup", async (req, res) => {
  try {
    console.log("hi");
    const { groupName, members, bills } = req.body;
    const userId = "b686f73b-326e-45c2-94d0-a6afba89df04";

    console.log(bills);
    if (!groupName || !members || members.length === 0) {
      throw new Error("Group name and members are required!");
    }

    const group = await prisma.groups.create({
      data: {
        group_name: groupName,
        userId: userId,
        UsersGroups: {
          create: members.map((member) => ({
            userId: member.userId,
          })),
        },
        Bill: bills
          ? {
              create: bills.map((bill) => {
                const splitAmount = (
                  bill.totalAmount / bill.users.length
                ).toFixed(2);
                return {
                  userId: userId,
                  bill_name: bill.billName,
                  totalAmount: bill.totalAmount,
                  billSplits: {
                    create: bill.users.map((user) => ({
                      userId: user.userId,
                      splitAmount: parseFloat(splitAmount),
                      status: "pending",
                    })),
                  },
                };
              }),
            }
          : undefined,
      },
    });

    console.log(group);
    res.status(200).json({ data: group });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});


//do not use
// userRouter.patch("/updateUserGroup/:id", async (req, res) => {
//   try {
//     const groupId = req.params.id;
//     const userId = "b686f73b-326e-45c2-94d0-a6afba89df04";
//     const { groupName, membersToAdd, bills } = req.body;

//     let updateData = {};

//     if (groupName) {
//       updateData.group_name = groupName;
//     }
//     if (membersToAdd && membersToAdd.length > 0) {
//       updateData.UsersGroups = {
//         create: membersToAdd.map((member) => ({
//           userId: member.userId,
//         })),
//       };
//     }

//     let myGroup = await prisma.groups.findFirst({
//       where: {
//         userId: userId,
//       },
//       select: {
//         UsersGroups: {
//           select: {
//             userId: true,
//           },
//         },
//       },
//     });
//     myGroup = myGroup.UsersGroups;
//     console.log(myGroup, "sfsff");
//     if (bills && bills.length > 0) {
//       updateData.Bill = {
//         create: bills.map((bill) => {
//           const splitAmount = (bill.totalAmount / myGroup.length).toFixed(2);
//           console.log(splitAmount,"dsds");
//           return {
//             userId: bill.userId,
//             bill_name: bill.billName,
//             totalAmount: bill.totalAmount,
//             billSplits: {
//               create: myGroup.map((user) => ({
//                 userId: user.userId,
//                 splitAmount: parseFloat(splitAmount),
//                 status: "pending",
//               })),
//             },
//           };
//         }),
//       };
//     }
//     const userGroup = await prisma.groups.update({
//       where: {
//         id: groupId,
//       },
//       data: {
//         ...updateData,
//       },
//       include: {
//       UsersGroups: true, 
//     },
//     });
//     console.log(userGroup);
//     res.status(200).json({ data: userGroup });
//     res.send("hi")
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


userRouter.patch("/updateUserGroup/:id", async (req, res) => {
  try {
    const groupId = req.params.id; 
    const userId = "b686f73b-326e-45c2-94d0-a6afba89df04"; 
    const { groupName, membersToAdd, bills } = req.body;

    let updateData = {};

    if (groupName) {
      updateData.group_name = groupName;
    }

    if (membersToAdd && membersToAdd.length > 0) {
      updateData.UsersGroups = {
        create: membersToAdd.map((member) => ({
          userId: member.userId,
        })),
      };
    }

    await prisma.groups.update({
      where: { id: groupId },
      data: { ...updateData },
    });

    const myGroup = await prisma.groups.findUnique({
      where: { id: groupId },
      select: {
        UsersGroups: {
          select: {
            userId: true,
          },
        },
      },
    });

    const groupMembers = myGroup.UsersGroups;

    if (bills && bills.length > 0) {
      const billData = bills.map((bill) => {
        const splitAmount = (bill.totalAmount / groupMembers.length).toFixed(2);

        return {
          userId: bill.userId, // User who addeds  the bill  naan thaan
          bill_name: bill.billName,
          totalAmount: bill.totalAmount,
          billSplits: {
            create: groupMembers.map((user) => ({
              userId: user.userId,
              splitAmount: parseFloat(splitAmount),
              status: "pending",
            })),
          },
        };
      });

      // billUpdate to group
      await prisma.groups.update({
        where: { id: groupId },
        data: {
          Bill: {
            create: billData,
          },
        },
      });
    }

    const updatedUserGroup = await prisma.groups.findUnique({
      where: { id: groupId },
      include: {
        UsersGroups: true, 
        Bill: {
          include: {
            billSplits: true, 
          },
        },
      },
    });

    res.status(200).json({ data: updatedUserGroup });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: error.message });
  }
});

userRouter.get("/getExistingGroups" , async(req,res)=>{
  const userId = "7eab8135-f33c-4b42-b860-c16e186ecb01";
});





module.exports = userRouter;




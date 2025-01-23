const express = require("express");
const userGroupRouter = express.Router();
const { PrismaClient } = require("@prisma/client");
const { userAuth } = require("../middlewares/auth");
const prisma = new PrismaClient();

userGroupRouter.post("/createGroup", userAuth, async (req, res) => {
  try {
    console.log("hi");
    const { groupName, members, bills } = req.body;
    const userId = req.user.id;

    console.log(bills);
    if (!groupName || !members || members.length === 0) {
      throw new Error("Group name and members are required!");
    }

    const group = await prisma.groups.create({
      data: {
        group_name: groupName,
        userId: parseInt(userId),
        UsersGroups: {
          create: members.map((member) => ({
            userId: parseInt(member.userId),
          })),
        },
        Bill: bills
          ? {
              create: bills.map((bill) => {
                const splitAmount = (
                  bill.totalAmount / bill.users.length
                ).toFixed(2);
                return {
                  userId: parseInt(userId),
                  bill_name: bill.billName,
                  totalAmount: bill.totalAmount,
                  billSplits: {
                    create: bill.users.map((user) => ({
                      userId: parseInt(user.userId),
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

userGroupRouter.patch("/updateUserGroup/:id", userAuth, async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;
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
          userId: parseInt(bill.userId), 
          bill_name: bill.billName,
          totalAmount: bill.totalAmount,
          billSplits: {
            create: groupMembers.map((user) => ({
              userId: parseInt(user.userId),
              splitAmount: parseFloat(splitAmount),
              status: "pending",
            })),
          },
        };
      });

      // billUupdate to group
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

userGroupRouter.get("/getExistingGroups", userAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const existingGroups = await prisma.usersGroups.findMany({
      where: {
        userId: userId,
      },
    });
    console.log(existingGroups);
    res.status(200).json({
      data: existingGroups,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = userGroupRouter;

const express = require("express");
const userGroupRouter = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();



userGroupRouter.post("/createUserGroup", async (req, res) => {
  const { userId, groupId } = req.body;
  if (!userId || !groupId){
    throw new Error("Cannot create usergroup midding Ids");
  }

  try {
    console.log("g")
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

module.exports = userGroupRouter;

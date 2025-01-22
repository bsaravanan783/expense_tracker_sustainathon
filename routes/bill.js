const express = require("express");
const billRouter = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

billRouter.post("/createBill", async (req, res) => {
  try {
    const userId = "1";
    const { billName, totalAmount, users } = req.body;
    const splitAmountForIndividual = 20;
    const defaultStatus = "pending";

    if (!billName || !totalAmount || !users || users.length === 0) {
      throw new Error("Missing fields in Bill !");
    }

    const bill = await prisma.bill.create({
      data: {
        userId: userId,
        bill_name: billName,
        create: users.map((user) => ({
          user: { connect: { id: user.userId } }, 
          splitAmount: splitAmountForIndividual,
          status: defaultStatus,
        })),


      },
    });

    return res.status(200).json({ data: bill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

billRouter.delete("/deleteBill", async (req, res) => {
  try {
    const billId = req.params.id;
    if (!billId) throw new Error("cannot delete bill");
    const deletedBill = await prisma.bill.delete({
      where: {
        id: billId,
      },
    });
    console.log(deletedBill, " deleted bill ");
    return res.status(200).json({ data: deletedBill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = billRouter;

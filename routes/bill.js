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
        totalAmount: totalAmount,
        billSplits: {
          create: usersList.map((user) => ({
            userId: user.userId,
            splitAmount: parseFloat(splitAmount),
            status: "pending",
          })),
        },
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

billRouter.get("/getUserInvolvedBills", async (req, res) => {
  try {
    const userId = "7eab8135-f33c-4b42-b860-c16e186ecb01";
    const userInvolvedSpits = await prisma.billSplit.findMany({
      where: {
        userId: userId,
      },
    });
  } catch (error) {}
});

module.exports = billRouter;

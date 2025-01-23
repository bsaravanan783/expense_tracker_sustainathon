const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

dotenv.config();

const userAuth = async(req,res,next)=>{
    try {
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is Invalid");
        }
        const decodedToken = await jwt.verify(token,process.env.JWT_SECRET);
        console.log(decodedToken);
        
        // const user = await prisma.users.findFirst({
        //     where:{
        //         username: 
        //     }
        // })
        next();
    } catch (error) {
        res.status(400).send("Error :" + error.message);
    }
};

module.exports={
    userAuth
}
const express = require("express");
const authRouter = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');
const { lookupService } = require("node:dns/promises");

authRouter.use(express.json());
authRouter.use(express.urlencoded({ extended: false }));
authRouter.use(cookieParser());
require('dotenv').config(); // Load environment variables from the .env file


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Case 1: No authorization header provided
    if (!authHeader) {
        return res
            .status(401)
            .send("Request Denied: No Authorization Header Provided");
    }

    const token = authHeader.split(" ")[1];

    // Case 2: No token in the Authorization header, checking cookies for refresh token
    if (!token) {
        if (req.cookies?.jwt) {
            const refreshToken = req.cookies.jwt;

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(406).json({ message: 'Unauthorized' });
                } else {
                    const userCredentials = await prisma.users.findUnique({
                        where: { username: decoded.username }
                    });

                    if (userCredentials) {
                        const accessToken = jwt.sign({
                            username: userCredentials.username,
                            email: userCredentials.email
                        }, process.env.ACCESS_TOKEN_SECRET, {
                            expiresIn: '10m'
                        });

                        return res.json({ accessToken });
                    } else {
                        return res.status(404).json({ message: 'User not found' });
                    }
                }
            });
        } else {
            return res.status(406).json({ message: 'Unauthorized' });
        }
    }

    // Case 3: Valid token in the Authorization header
    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next(); // Pass control to the next handler
    } catch (err) {
        return res.status(401).send("Request Denied: Invalid Token");
    }
};









authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    
    const userCredentials = await prisma.users.findUnique({
        where: { username: username },
    });
   
    console.log(userCredentials,userCredentials.password);
    const hashedPassword = await bcrypt.hash(password, 10); 
   

    const validatePassword = await bcrypt.compare(password, userCredentials.password);
    console.log(validatePassword);
    console.log(password,userCredentials.password,hashedPassword);
    
    


    if (validatePassword) {
        console.log("entered if ");
        
        const accessToken = jwt.sign({
            username: userCredentials.username,
            email: userCredentials.email
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '10m'
        });

        const refreshToken = jwt.sign({
            username: userCredentials.username,
        }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

       
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None', 
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({ accessToken });
    } else {
        return res.status(406).json({
            message: 'Invalid credentials'
        });
    }
});

authRouter.post('/refresh', async (req, res) => {
    if (req.cookies?.jwt) {
        const refreshToken = req.cookies.jwt;

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(406).json({ message: 'Unauthorized' });
            } else {
                // Fetch the user credentials using the decoded token
                const userCredentials = await prisma.users.findUnique({
                    where: { username: decoded.username }
                });

                if (userCredentials) {
                    const accessToken = jwt.sign({
                        username: userCredentials.username,
                        email: userCredentials.email
                    }, process.env.ACCESS_TOKEN_SECRET, {
                        expiresIn: '10m'
                    });

                    return res.json({ accessToken });
                } else {
                    return res.status(404).json({ message: 'User not found' });
                }
            }
        });
    } else {
        return res.status(406).json({ message: 'Unauthorized' });
    }
});

module.exports = authRouter;

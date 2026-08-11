"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                role: true,
                password: true,
            },
        });
        if (!user || !user.password) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ message: 'JWT configuration is missing' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            role: user.role,
            email: user.email,
        }, secret, {
            subject: user.id,
            expiresIn: '15m',
        });
        // Don't send password back in response
        const { password: _, ...userWithoutPassword } = user;
        res.json({ token, user: userWithoutPassword });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
const auth_middleware_1 = require("./middleware/auth.middleware");
router.get('/profile', auth_middleware_1.verifyAccessToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                phone: true,
                fullName: true,
                role: true,
            }
        });
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.put('/profile', auth_middleware_1.verifyAccessToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { fullName, phone } = req.body;
        const user = await prisma.user.update({
            where: { id: userId },
            data: { fullName, phone },
            select: {
                id: true,
                email: true,
                phone: true,
                fullName: true,
                role: true,
            }
        });
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.default = router;

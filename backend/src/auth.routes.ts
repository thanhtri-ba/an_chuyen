import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = Router();
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;

    if (!fullName || !phone || !password) {
      res.status(400).json({ message: 'Họ tên, số điện thoại và mật khẩu là bắt buộc' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return;
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          ...(email ? [{ email }] : []),
        ],
      },
    });
    if (existing) {
      res.status(409).json({ message: 'Số điện thoại hoặc email đã được sử dụng' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        fullName,
        phone,
        email: email || null,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        role: true,
      },
    });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: 'JWT configuration is missing' });
      return;
    }

    const token = jwt.sign(
      { role: user.role, email: user.email },
      secret,
      { subject: user.id, expiresIn: '7d' },
    );

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: email }
        ]
      },
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

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: 'JWT configuration is missing' });
      return;
    }

    const token = jwt.sign(
      {
        role: user.role,
        email: user.email,
      },
      secret,
      {
        subject: user.id,
        expiresIn: '15m',
      },
    );

    // Don't send password back in response
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

import { verifyAccessToken } from './middleware/auth.middleware';

router.get('/profile', verifyAccessToken as any, async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        gender: true,
        avatar: true,
        role: true,
        profile: {
          select: {
            address: true,
            dob: true,
            emergencyPhone: true,
            nationality: true,
            occupation: true,
          }
        },
        wallet: {
          select: { balance: true }
        },
        loyalty: {
          select: { points: true, tier: true }
        },
        _count: {
          select: { bookings: true }
        }
      }
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/profile', verifyAccessToken as any, async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { fullName, phone, gender, address, dob, emergencyPhone, nationality, occupation } = req.body;
    
    // Update user info and upsert profile address
    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        fullName, 
        phone, 
        gender,
        profile: (address !== undefined || dob !== undefined || emergencyPhone !== undefined || nationality !== undefined || occupation !== undefined) ? {
          upsert: {
            create: { address, dob, emergencyPhone, nationality, occupation },
            update: { address, dob, emergencyPhone, nationality, occupation }
          }
        } : undefined
      },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        gender: true,
        avatar: true,
        role: true,
        profile: {
          select: {
            address: true,
            dob: true,
            emergencyPhone: true,
            nationality: true,
            occupation: true,
          }
        }
      }
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

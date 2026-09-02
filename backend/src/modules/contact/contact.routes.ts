import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAccessToken, type AuthenticatedRequest } from '../../middleware/auth.middleware';

export const contactRoutes = Router();
const prisma = new PrismaClient();

// Danh sách hành khách khách hàng đã dùng ở các lần đặt vé trước — hiển thị
// làm gợi ý điền nhanh, không tự ý áp dụng để tránh gán nhầm SĐT/email của
// người khác nếu nhiều người dùng chung 1 tài khoản.
contactRoutes.get('/', verifyAccessToken as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const contacts = await prisma.contact.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });
    res.json({ success: true, data: contacts });
  } catch (error) {
    next(error);
  }
});

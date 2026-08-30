import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAccessToken, type AuthenticatedRequest } from './middleware/auth.middleware';
import { requireAdmin } from './middleware/admin.middleware';
import { supabaseAdmin } from './core/supabase';

const router = Router();
router.use(verifyAccessToken);
router.use(requireAdmin);

const prisma = new PrismaClient();

// `readOmit`: fields stripped from every response (e.g. password hashes should
// never leave the server, even to an authenticated admin).
// `writeBlock`: fields silently dropped from create/update bodies so a generic
// admin CRUD can't be used for mass-assignment into sensitive columns like
// `password` (would store a value unhashed) or `role` (privilege escalation).
const createCrudRouter = (
  delegate: any,
  resourceName: string,
  include?: any,
  options?: { readOmit?: string[]; writeBlock?: string[] },
) => {
  const crudRouter = Router();
  const readOmit = options?.readOmit || [];
  const writeBlock = options?.writeBlock || [];

  // Fields that must never leave the server no matter which resource or how
  // deeply nested (e.g. a booking's included `user` relation) — stripped
  // recursively, not just from the top-level row like `readOmit` below.
  const ALWAYS_STRIP = new Set(['password']);

  const deepStrip = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(deepStrip);
    // Date, Prisma Decimal, and similar wrapper types serialize themselves via
    // toJSON() and store their real value outside enumerable own properties —
    // rebuilding them field-by-field (as below) silently collapses them to {}.
    if (value && typeof value === 'object' && typeof (value as any).toJSON === 'function') {
      return value;
    }
    if (value && typeof value === 'object') {
      const clone: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
        if (ALWAYS_STRIP.has(key)) continue;
        clone[key] = deepStrip(val);
      }
      return clone;
    }
    return value;
  };

  const omit = <T extends Record<string, unknown>>(row: T): T => {
    const stripped = deepStrip(row) as T;
    if (readOmit.length === 0) return stripped;
    const clone = { ...stripped };
    for (const key of readOmit) delete (clone as Record<string, unknown>)[key];
    return clone;
  };

  const stripBlocked = (body: Record<string, unknown>) => {
    const clone = { ...body };
    for (const key of writeBlock) delete clone[key];
    return clone;
  };

  crudRouter.get('/', async (req, res) => {
    const { range, sort, filter } = req.query as any;

    let skip = 0;
    let take = 10;
    
    if (range) {
      try {
        const parsedRange = JSON.parse(range);
        skip = parsedRange[0];
        take = parsedRange[1] - parsedRange[0] + 1;
      } catch (error: unknown) {}
    }

    let orderBy = {};
    if (sort) {
      try {
        const parsedSort = JSON.parse(sort);
        const field = parsedSort[0];
        const order = parsedSort[1].toLowerCase();
        orderBy = { [field]: order };
      } catch (error: unknown) {}
    }

    let where: Record<string, unknown> = {};
    if (filter) {
      try {
        const parsedFilter = JSON.parse(filter);
        for (const key of Object.keys(parsedFilter)) {
          if (key === 'q') {
            // handle search
          } else if (key === 'id' && Array.isArray(parsedFilter[key])) {
            where[key] = { in: parsedFilter[key] };
          } else {
            where[key] = parsedFilter[key];
          }
        }
      } catch (error: unknown) {}
    }

    try {
      const [data, total] = await Promise.all([
        delegate.findMany({ skip, take, orderBy, where, include }),
        delegate.count({ where })
      ]);

      res.setHeader('Content-Range', `${resourceName} ${skip}-${skip + data.length - 1}/${total}`);
      res.setHeader('X-Total-Count', total);
      res.json(data.map(omit));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(500).json({ error: message });
    }
  });

  crudRouter.get('/:id', async (req, res) => {
    try {
      const data = await delegate.findUnique({ where: { id: req.params.id }, include });
      if (data) {
        res.json(omit(data));
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(500).json({ error: message });
    }
  });

  crudRouter.post('/', async (req, res) => {
    try {
      const { id, ...rest } = req.body;
      const createData = stripBlocked(rest);
      const data = await delegate.create({ data: createData });
      res.status(201).json(omit(data));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(500).json({ error: message });
    }
  });

  crudRouter.put('/:id', async (req, res) => {
    try {
      const { id: _, ...rest } = req.body;
      const updateData = stripBlocked(rest);
      const data = await delegate.update({ where: { id: req.params.id }, data: updateData });
      res.json(omit(data));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(500).json({ error: message });
    }
  });

  crudRouter.delete('/:id', async (req, res) => {
    try {
      const data = await delegate.delete({ where: { id: req.params.id } });
      res.json(omit(data));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(500).json({ error: message });
    }
  });

  return crudRouter;
};

// Custom route for inviting a user via Supabase Auth
router.post('/invite-user', async (req, res) => {
  try {
    const { email, fullName, role } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { fullName, role }
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const userId = authData.user.id;

    // Insert profile record into public.User
    const user = await prisma.user.create({
      data: {
        id: userId,
        email,
        phone: '0000000000',
        fullName: fullName || email.split('@')[0],
        role: role || 'user',
        updatedAt: new Date()
      }
    });

    res.status(201).json(user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(500).json({ error: message });
  }
});

router.post('/tripSchedules/:id/generate-seats', async (req, res) => {
  try {
    const { id } = req.params;
    const { floors = 1, rows = 6, cols = 3 } = req.body;
    
    // Convert cols to letters (A, B, C...)
    const colLetters = Array.from({ length: cols }, (_, i) => String.fromCharCode(65 + i));
    
    const seatNumbers: string[] = [];
    for (let floor = 1; floor <= floors; floor++) {
      for (let row = 1; row <= rows; row++) {
        for (const col of colLetters) {
          seatNumbers.push(`T${floor}-${row}${col}`);
        }
      }
    }

    // Delete existing seats for this trip schedule
    await prisma.seat.deleteMany({
      where: { tripScheduleId: id }
    });

    // Create new seats
    await prisma.seat.createMany({
      data: seatNumbers.map((seatNumber) => ({
        tripScheduleId: id,
        seatNumber,
        status: 'AVAILABLE'
      }))
    });

    const seats = await prisma.seat.findMany({ where: { tripScheduleId: id } });
    res.json(seats);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(500).json({ error: message });
  }
});

router.post('/users/:id/wallet/topup', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Use a transaction to ensure data integrity
    const result = await prisma.$transaction(async (tx) => {
      // Find or create wallet
      let wallet = await tx.wallet.findUnique({ where: { userId: id } });
      
      if (!wallet) {
        wallet = await tx.wallet.create({
          data: {
            userId: id,
            balance: 0
          }
        });
      }

      // Update balance
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            increment: amount
          }
        }
      });

      // Create transaction log
      const transaction = await tx.walletTransaction.create({
        data: {
          userId: id,
          amount,
          type: 'DEPOSIT',
          description: description || 'Admin Top-up'
        }
      });

      return { wallet: updatedWallet, transaction };
    });

    res.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(500).json({ error: message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    // Analytics stats
    const totalUsers = await prisma.user.count();
    const totalBookings = await prisma.booking.count();
    const totalTrips = await prisma.tripSchedule.count();

    // Finance stats
    const payments = await prisma.payment.aggregate({
      _sum: {
        amount: true
      },
      where: {
        status: 'PAID'
      }
    });

    const wallets = await prisma.wallet.aggregate({
      _sum: {
        balance: true
      }
    });

    res.json({
      totalUsers,
      totalBookings,
      totalTrips,
      totalRevenue: payments._sum.amount || 0,
      totalWalletBalance: wallets._sum.balance || 0
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.use('/users', createCrudRouter(prisma.user, 'users', undefined, {
  readOmit: ['password'],
  writeBlock: ['password', 'role'],
}));
router.use('/bookings', createCrudRouter(prisma.booking, 'bookings', { user: true, tripSchedule: true, payment: true }));
router.use('/trips', createCrudRouter(prisma.trip, 'trips', { busAgent: true, route: { include: { departureCity: true, arrivalCity: true } } }));
router.use('/tripSchedules', createCrudRouter(prisma.tripSchedule, 'tripSchedules', { 
  bus: true, 
  trip: { include: { route: { include: { departureCity: true, arrivalCity: true } }, busAgent: true } },
  checkpoints: { include: { station: true } }
}));
router.use('/seats', createCrudRouter(prisma.seat, 'seats'));
router.use('/busAgents', createCrudRouter(prisma.busAgent, 'busAgents'));
router.use('/promotions', createCrudRouter(prisma.promotion, 'promotions'));
router.use('/cities', createCrudRouter(prisma.city, 'cities'));
router.use('/routes', createCrudRouter(prisma.route, 'routes', { departureCity: true, arrivalCity: true }));
router.use('/wallets', createCrudRouter(prisma.wallet, 'wallets'));
router.use('/walletTransactions', createCrudRouter(prisma.walletTransaction, 'walletTransactions'));
router.use('/banners', createCrudRouter(prisma.banner, 'banners'));
router.use('/events', createCrudRouter(prisma.event, 'events'));
router.use('/appConfigs', createCrudRouter(prisma.appConfig, 'appConfigs'));
router.use('/reviews', createCrudRouter(prisma.review, 'reviews', { user: true }));
router.use('/tours', createCrudRouter(prisma.tour, 'tours'));
router.use('/tourBookings', createCrudRouter(prisma.tourBooking, 'tourBookings', { user: true, tour: true }));
router.use('/rentalCars', createCrudRouter(prisma.rentalCar, 'rentalCars'));
router.use('/rentalBookings', createCrudRouter(prisma.rentalBooking, 'rentalBookings', { user: true, car: true }));
router.use('/deliveryOrders', createCrudRouter(prisma.deliveryOrder, 'deliveryOrders', { user: true, vehicle: true }));
router.use('/payments', createCrudRouter(prisma.payment, 'payments', { booking: true }));

// Customer support chat
router.get('/support/conversations', async (req, res) => {
  try {
    const { status } = req.query as { status?: string };
    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const conversations = await prisma.supportConversation.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true, avatar: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    res.json(conversations);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(500).json({ error: message });
  }
});

router.get('/support/conversations/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await prisma.supportMessage.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, fullName: true, avatar: true, role: true } },
      },
    });

    res.json(messages);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(500).json({ error: message });
  }
});

router.post('/support/conversations/:id/messages', async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const message = await prisma.supportMessage.create({
      data: {
        conversationId: id,
        senderId: req.user.id,
        text,
      },
      include: {
        sender: { select: { id: true, fullName: true, avatar: true, role: true } },
      },
    });

    // @updatedAt only fires on direct updates to the conversation, not on related-row creation
    await prisma.supportConversation.update({ where: { id }, data: {} });

    res.status(201).json(message);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(500).json({ error: message });
  }
});

router.patch('/support/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const conversation = await prisma.supportConversation.update({
      where: { id },
      data: { status },
    });

    res.json(conversation);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(500).json({ error: message });
  }
});

export default router;

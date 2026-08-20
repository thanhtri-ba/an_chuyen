import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAccessToken } from './middleware/auth.middleware';
import { requireAdmin } from './middleware/admin.middleware';
import { supabaseAdmin } from './core/supabase';

const router = Router();
router.use(verifyAccessToken);
router.use(requireAdmin);

const prisma = new PrismaClient();

const createCrudRouter = (delegate: any, resourceName: string) => {
  const crudRouter = Router();

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
        delegate.findMany({ skip, take, orderBy, where }),
        delegate.count({ where })
      ]);

      res.setHeader('Content-Range', `${resourceName} ${skip}-${skip + data.length - 1}/${total}`);
      res.setHeader('X-Total-Count', total);
      res.json(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(500).json({ error: message });
    }
  });

  crudRouter.get('/:id', async (req, res) => {
    try {
      const data = await delegate.findUnique({ where: { id: req.params.id } });
      if (data) {
        res.json(data);
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
      const { id, ...createData } = req.body;
      const data = await delegate.create({ data: createData });
      res.status(201).json(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(500).json({ error: message });
    }
  });

  crudRouter.put('/:id', async (req, res) => {
    try {
      const { id: _, ...updateData } = req.body;
      const data = await delegate.update({ where: { id: req.params.id }, data: updateData });
      res.json(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(500).json({ error: message });
    }
  });

  crudRouter.delete('/:id', async (req, res) => {
    try {
      const data = await delegate.delete({ where: { id: req.params.id } });
      res.json(data);
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

router.use('/users', createCrudRouter(prisma.user, 'users'));
router.use('/bookings', createCrudRouter(prisma.booking, 'bookings'));
router.use('/trips', createCrudRouter(prisma.trip, 'trips'));
router.use('/tripSchedules', createCrudRouter(prisma.tripSchedule, 'tripSchedules'));
router.use('/seats', createCrudRouter(prisma.seat, 'seats'));
router.use('/busAgents', createCrudRouter(prisma.busAgent, 'busAgents'));
router.use('/promotions', createCrudRouter(prisma.promotion, 'promotions'));
router.use('/cities', createCrudRouter(prisma.city, 'cities'));
router.use('/routes', createCrudRouter(prisma.route, 'routes'));
router.use('/wallets', createCrudRouter(prisma.wallet, 'wallets'));
router.use('/walletTransactions', createCrudRouter(prisma.walletTransaction, 'walletTransactions'));

export default router;

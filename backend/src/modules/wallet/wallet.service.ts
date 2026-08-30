import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class WalletService {
  static async getWalletInfo(userId: string) {
    let wallet = await prisma.wallet.findUnique({ where: { userId } });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId, balance: 0 },
      });
    }

    return wallet;
  }
}

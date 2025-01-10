import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DailyStorageRepository {
  async findByUserIdAndDate(transaction, userId, date) {
    return transaction.dailyStorage.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });
  }

  async create(transaction, userId, date, mbUsed) {
    return transaction.dailyStorage.create({ data: { userId, date, mbUsed } });
  }

  async update(transaction, userId, date, mbUsed) {
    return transaction.dailyStorage.update({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      data: { mbUsed },
    });
  }

  async findAllToday() {
    const today = new Date().toISOString().split("T")[0];
    return prisma.dailyStorage.findMany({
      where: {
        date: today,
        mbUsed: {
          not: 0,
        },
      },
      select: {
        userId: true,
        mbUsed: true,
      },
    });
  }

  async findTotalMbUsedByMonth(userId, year, month) {
    const datePrefix = `${year}-${month}`;

    const result = await prisma.dailyStorage.aggregate({
      _sum: {
        mbUsed: true,
      },
      where: {
        userId,
        date: {
          startsWith: datePrefix,
        },
      },
    });

    return result._sum.mbUsed || 0;
  }
}

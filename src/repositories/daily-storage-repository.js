import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DailyStorageRepository {
  async findByUserIdAndDate(userId, date) {
    return prisma.dailyStorage.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });
  }

  async create(data) {
    return prisma.dailyStorage.create({ data });
  }

  async update(userId, date, mbUsed) {
    return prisma.dailyStorage.update({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      data: { mbUsed },
    });
  }
}

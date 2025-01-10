import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export class TransactionManager {
  async transaction(callback) {
    return await prisma.$transaction(callback);
  }
}

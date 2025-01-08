import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {
  async create(id, isAdmin) {
    return await prisma.user.create({
      data: {
        id,
        isAdmin,
      },
    });
  }

  async findByUserId(id) {
    return prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }
}

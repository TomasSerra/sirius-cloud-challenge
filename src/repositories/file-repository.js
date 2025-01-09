import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class FileRepository {
  async create(userId, cloudFileName, originalName, size) {
    const date = new Date().toISOString().split("T")[0];
    return await prisma.file.create({
      data: {
        userId,
        cloudFileName,
        originalName,
        date,
        size,
      },
    });
  }

  async findByFileId(fileId) {
    return await prisma.file.findUnique({
      where: {
        fileId,
      },
    });
  }
}

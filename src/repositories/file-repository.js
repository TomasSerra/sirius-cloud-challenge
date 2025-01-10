import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class FileRepository {
  async create(transaction, userId, cloudFileName, originalName, size, date) {
    const createdFile = await transaction.file.create({
      data: {
        userId,
        cloudFileName,
        originalName,
        date,
        size,
      },
    });
    return createdFile.fileId;
  }

  async findByFileId(fileId) {
    return await prisma.file.findUnique({
      where: {
        fileId,
      },
    });
  }
}

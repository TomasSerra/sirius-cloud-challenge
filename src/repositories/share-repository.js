import { PrismaClient } from "@prisma/client";
import { getResponse } from "../responses/response-mapper.js";

const prisma = new PrismaClient();

export class ShareRepository {
  async create(fromUserId, toUserId, fileId) {
    try {
      return await prisma.share.create({
        data: {
          fromUserId,
          toUserId,
          fileId,
        },
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw getResponse(
          409,
          "The file has already been shared between these users."
        );
      } else {
        throw getResponse(
          500,
          "An unexpected error occurred while sharing the file."
        );
      }
    }
  }

  async findByFileIdAndToUserId(fileId, toUserId) {
    return await prisma.share.findFirst({
      where: {
        fileId: fileId,
        toUserId,
      },
    });
  }
}

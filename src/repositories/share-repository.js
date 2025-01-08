import { PrismaClient } from "@prisma/client";
import { getResponse } from "../responses/response-mapper.js";

const prisma = new PrismaClient();

export class ShareRepository {
  async create(fromUserId, toUserId, cloudFileName) {
    try {
      return await prisma.share.create({
        data: {
          fromUserId,
          toUserId,
          cloudFileName,
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
}

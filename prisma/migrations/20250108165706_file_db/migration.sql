-- CreateTable
CREATE TABLE "File" (
    "fileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cloudFileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("fileId")
);

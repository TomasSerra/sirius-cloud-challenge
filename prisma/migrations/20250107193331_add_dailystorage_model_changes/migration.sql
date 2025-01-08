-- CreateTable
CREATE TABLE "DailyStorage" (
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mbUsed" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DailyStorage_pkey" PRIMARY KEY ("userId","date")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

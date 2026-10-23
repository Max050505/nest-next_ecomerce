-- CreateTable
CREATE TABLE "cloudinary_deletions" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "cloudinary_deletions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cloudinary_deletions_processedAt_nextAttemptAt_idx" ON "cloudinary_deletions"("processedAt", "nextAttemptAt");

-- CreateIndex
CREATE INDEX "cloudinary_deletions_publicId_idx" ON "cloudinary_deletions"("publicId");

-- CreateTable
CREATE TABLE "EmailSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "categories" TEXT,
    "frequency" TEXT NOT NULL DEFAULT 'weekly',
    "emailFormat" TEXT NOT NULL DEFAULT 'html',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastEmailSentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmailSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "toolIds" TEXT,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" DATETIME,
    "openedAt" DATETIME,
    "clickedAt" DATETIME,
    CONSTRAINT "EmailLog_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "EmailSubscription" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailSubscription_userId_key" ON "EmailSubscription"("userId");

-- CreateIndex
CREATE INDEX "EmailSubscription_userId_idx" ON "EmailSubscription"("userId");

-- CreateIndex
CREATE INDEX "EmailSubscription_isActive_idx" ON "EmailSubscription"("isActive");

-- CreateIndex
CREATE INDEX "EmailLog_subscriptionId_idx" ON "EmailLog"("subscriptionId");

-- CreateIndex
CREATE INDEX "EmailLog_sentAt_idx" ON "EmailLog"("sentAt");

-- CreateIndex
CREATE INDEX "EmailLog_status_idx" ON "EmailLog"("status");

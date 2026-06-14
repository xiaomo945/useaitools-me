-- CreateTable
CREATE TABLE "ToolReviewTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sections" TEXT NOT NULL,
    "ratingDimensions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ToolReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "blogPostId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "templateId" TEXT,
    "overview" TEXT NOT NULL,
    "features" TEXT,
    "pros" TEXT,
    "cons" TEXT,
    "overallRating" REAL,
    "ratings" TEXT,
    "recommendation" TEXT,
    "bestFor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ToolReview_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ToolReview_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ToolReview_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ToolReviewTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ToolReviewTemplate_isActive_idx" ON "ToolReviewTemplate"("isActive");

-- CreateIndex
CREATE INDEX "ToolReviewTemplate_isDefault_idx" ON "ToolReviewTemplate"("isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "ToolReview_blogPostId_key" ON "ToolReview"("blogPostId");

-- CreateIndex
CREATE INDEX "ToolReview_toolId_idx" ON "ToolReview"("toolId");

-- CreateIndex
CREATE INDEX "ToolReview_blogPostId_idx" ON "ToolReview"("blogPostId");

-- CreateIndex
CREATE INDEX "ToolReview_overallRating_idx" ON "ToolReview"("overallRating");

-- CreateIndex
CREATE INDEX "ToolReview_recommendation_idx" ON "ToolReview"("recommendation");

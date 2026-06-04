-- CreateTable
CREATE TABLE "story_search_index" (
    "id" TEXT NOT NULL,
    "story_id" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "story_search_index_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (unique on story_id for one-to-one)
CREATE UNIQUE INDEX "story_search_index_story_id_key" ON "story_search_index"("story_id");

-- AddForeignKey
ALTER TABLE "story_search_index" ADD CONSTRAINT "story_search_index_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- GIN Index for full-text search (the whole point of this migration)
CREATE INDEX "story_search_index_content_gin" ON "story_search_index" USING GIN (to_tsvector('english', "content"));

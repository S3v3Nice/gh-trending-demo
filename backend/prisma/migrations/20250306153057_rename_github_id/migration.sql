-- Delete the old primary key
ALTER TABLE "repositories" DROP CONSTRAINT IF EXISTS "repositories_pkey";

-- Delete the old `id` column
ALTER TABLE "repositories" DROP COLUMN IF EXISTS "id";

-- Rename `github_id` to `id`
ALTER TABLE "repositories" RENAME COLUMN "github_id" TO "id";

-- Delete the autoincremental sequence, if there was one
DROP SEQUENCE IF EXISTS "repositories_id_seq";

-- Make `id` (formerly `github_id`) the primary key
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "repositories_github_id_key";

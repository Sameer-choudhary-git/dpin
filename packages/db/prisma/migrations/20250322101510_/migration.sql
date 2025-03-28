-- DropIndex
DROP INDEX "Website_url_key";

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

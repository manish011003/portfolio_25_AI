-- Run in the Supabase SQL editor if you prefer not to use Prisma CLI.
-- Safe to re-run: uses IF NOT EXISTS / upserts where possible.

DO $$ BEGIN
  CREATE TYPE "CaseStudyStatus" AS ENUM ('draft', 'published');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "CaseStudyTemplate" AS ENUM ('standard', 'narrative', 'dataHeavy');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "CaseStudy" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "summary" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "body" JSONB NOT NULL DEFAULT '[]',
  "template" "CaseStudyTemplate" NOT NULL DEFAULT 'standard',
  "coverImage" TEXT,
  "usersImpacted" INTEGER NOT NULL DEFAULT 0,
  "themeColor" TEXT NOT NULL DEFAULT '#F5C518',
  "stats" JSONB NOT NULL,
  "tags" TEXT[] NOT NULL,
  "github" TEXT,
  "liveDemo" TEXT,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "status" "CaseStudyStatus" NOT NULL DEFAULT 'draft',
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CaseStudy_slug_key" ON "CaseStudy"("slug");

CREATE TABLE IF NOT EXISTS "Skill" (
  "id" TEXT NOT NULL,
  "icon" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SiteSetting" (
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);

ALTER TABLE "CaseStudy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Skill" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteSetting" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "CaseStudy" ADD COLUMN IF NOT EXISTS "body" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "CaseStudy" ADD COLUMN IF NOT EXISTS "template" "CaseStudyTemplate" NOT NULL DEFAULT 'standard';
ALTER TABLE "CaseStudy" ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS "Experience" (
  "id" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3),
  "description" TEXT NOT NULL,
  "images" TEXT[] NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Experience" ENABLE ROW LEVEL SECURITY;

UPDATE "CaseStudy"
SET body = (
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', 'migrated-' || "CaseStudy"."id" || '-' || ord,
      'type', 'paragraph',
      'text', trim(para)
    ) ORDER BY ord
  ), '[]'::jsonb)
  FROM unnest(string_to_array("description", E'\n\n')) WITH ORDINALITY AS t(para, ord)
  WHERE length(trim(para)) > 0
)
WHERE body = '[]'::jsonb AND length(trim("description")) > 0;

INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read cover images; writes go through the service role in server actions.
DO $$ BEGIN
  CREATE POLICY "Public read covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
